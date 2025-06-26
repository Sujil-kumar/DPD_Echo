from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, User, Feedback
from datetime import datetime

routes = Blueprint('routes', __name__)

@routes.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@routes.route('/manager/dashboard', methods=['GET'])
@jwt_required()
def get_manager_dashboard():
    identity = get_jwt_identity()
    manager_id = identity['id']
    manager = User.query.get(manager_id)
    
    team = User.query.filter_by(manager_id=manager_id).all()
    totalEmployees = len(team)
    data = []
    totalFeedbacks = 0

    for emp in team:
        feedbacks = Feedback.query.filter_by(manager_id=manager_id, employee_id=emp.id).order_by(Feedback.created_at.desc()).all()
        data.append({
            "employee_id": emp.id,
            "name": emp.name,
            "email": emp.email,
            "feedback_count": len(feedbacks),
            "last_feedback_date": feedbacks[0].created_at.strftime("%Y-%m-%d") if feedbacks else "No feedback yet",
            "last_feedback_sentiment": feedbacks[0].sentiment if feedbacks else None
        })
        totalFeedbacks += len(feedbacks)

    return jsonify({
        "managerName": manager.name,
        "team": data,
        "totalEmployees": totalEmployees,
        "totalFeedbacks": totalFeedbacks
    })

@routes.route('/employee/dashboard', methods=['GET'])
@jwt_required()
def employee_dashboard():
    identity = get_jwt_identity()
    employee = User.query.get(identity['id'])

    if not employee or employee.role != 'employee':
        return jsonify({"error": "Access denied"}), 403

    feedbacks = Feedback.query.filter_by(employee_id=employee.id).order_by(Feedback.created_at.desc()).all()
    acknowledged_count = sum(1 for fb in feedbacks if fb.acknowledged)

    data = []
    for fb in feedbacks:
        data.append({
            "id": fb.id,
            "date": fb.created_at.strftime("%B %d, %Y"),
            "sentiment": fb.sentiment,
            "strengths": fb.strengths.split('\n') if fb.strengths else [],
            "improvements": fb.improvements.split('\n') if fb.improvements else [],
            "acknowledged": fb.acknowledged,
            "manager_name": User.query.get(fb.manager_id).name
        })

    return jsonify({
        "employeeName": employee.name,
        "stats": {
            "feedbackReceived": len(feedbacks),
            "acknowledged": acknowledged_count
        },
        "timeline": data
    })

@routes.route('/feedback', methods=['POST'])
@jwt_required()
def give_feedback():
    data = request.get_json()
    identity = get_jwt_identity()

    employee = User.query.filter_by(
        id=data['employee_id'],
        manager_id=identity['id']
    ).first()

    if not employee:
        return jsonify({"error": "Invalid employee or unauthorized"}), 400

    feedback = Feedback(
        employee_id=data['employee_id'],
        manager_id=identity['id'],
        strengths=data['strengths'],
        improvements=data['improvements'],
        sentiment=data['sentiment'],
        created_at=datetime.utcnow()
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({
        "msg": "Feedback submitted",
        "feedback_id": feedback.id
    }), 201


@routes.route('/feedback/<int:employee_id>', methods=['GET'])
@jwt_required()
def view_feedback(employee_id):
    identity = get_jwt_identity()
    manager_id = identity['id']

    employee = User.query.filter_by(id=employee_id, manager_id=manager_id).first()
    if not employee:
        return jsonify({"error": "Unauthorized access"}), 403

    feedbacks = Feedback.query.filter_by(manager_id=manager_id, employee_id=employee_id).order_by(Feedback.created_at.desc()).all()
    total_feedback=len(feedbacks)
    data = [{
        "id": f.id,
        "employee_name": employee.name,
        "strengths": f.strengths.split('\n') if f.strengths else [],
        "improvements": f.improvements.split('\n') if f.improvements else [],
        "sentiment": f.sentiment,
        "created_at": f.created_at.strftime("%B %d, %Y"),
        "acknowledged": f.acknowledged
    } for f in feedbacks]

    return jsonify({"data":data,"total_feedback": total_feedback})


@routes.route('/feedback/acknowledge/<int:feedback_id>', methods=['POST'])
@jwt_required()
def acknowledge_feedback(feedback_id):
    current_user = get_jwt_identity()
    
    feedback = Feedback.query.filter_by(
        id=feedback_id,
        employee_id=current_user['id'] 
    ).first()
    
    if not feedback:
        return jsonify({'error': 'Feedback not found or unauthorized'}), 404
    
    if feedback.acknowledged:
        return jsonify({'error': 'Feedback already acknowledged'}), 400
    feedback.acknowledged = True
    feedback.acknowledged_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': 'Feedback acknowledged',
        'feedback_id': feedback.id,
        'acknowledged_at': feedback.acknowledged_at.isoformat()
    })

@routes.route('/employee/<int:employee_id>', methods=['GET'])
@jwt_required()
def get_employee(employee_id):
    identity = get_jwt_identity()

    employee = User.query.filter_by(id=employee_id, manager_id=identity['id']).first()
    if not employee:
        return jsonify({"error": "Unauthorized access"}), 403

    return jsonify({
        "id": employee.id,
        "name": employee.name,
        "email": employee.email,
        "role": employee.role
    })

@routes.route('/feedback/edit/<int:feedback_id>', methods=['GET', 'PUT'])
@jwt_required()
def handle_feedback(feedback_id):
    current_user = get_jwt_identity()
    manager_id = current_user['id']
    
    
    if request.method == 'GET':
        feedback = Feedback.query.filter_by(
            id=feedback_id,
            manager_id=manager_id 
        ).first_or_404()
        employee = User.query.filter_by(id=feedback.employee_id, manager_id=manager_id).first()
        if not employee:
            return jsonify({"error": "Unauthorized access"}), 403
        return jsonify({
            "id": feedback.id,
            "employee_id": feedback.employee_id,
            "strengths": feedback.strengths,
            "improvements": feedback.improvements,
            "sentiment": feedback.sentiment,
            "employee_name": employee.name
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        feedback = Feedback.query.filter_by(
            id=feedback_id,
            manager_id=current_user['id']
        ).first_or_404()
        
        feedback.strengths = data['strengths']
        feedback.improvements = data['improvements']
        feedback.sentiment = data['sentiment']
        feedback.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify({"message": "Feedback updated successfully"})

@routes.route('/feedback/sentiment-stats', methods=['GET'])
@jwt_required()
def get_sentiment_stats():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    
    if user.role == 'manager':
        team_ids = [emp.id for emp in User.query.filter_by(manager_id=user.id).all()]
        feedbacks = Feedback.query.filter(Feedback.employee_id.in_(team_ids)).all()
    else:  
        feedbacks = Feedback.query.all()
    
    sentiment_counts = {
        'positive': 0,
        'neutral': 0,
        'negative': 0
    }
    
    for fb in feedbacks:
        sentiment_counts[fb.sentiment] += 1
    
    total = len(feedbacks)
    stats = {
        'counts': sentiment_counts,
        'total_feedbacks': total
        }
    
    return jsonify(stats)
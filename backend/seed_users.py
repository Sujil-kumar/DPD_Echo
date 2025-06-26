from app import create_app
from app.models import db, User, Feedback
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()



with app.app_context():
    
    db.drop_all()
    db.create_all()

    manager1 = User(
        name="Sujil",
        email="sujil@example.com",
        password=generate_password_hash("sujil123"),
        role="manager"
    )
    db.session.add(manager1)
    manager2 = User(
        name="Alex",
        email="alex@example.com",
        password=generate_password_hash("alex123"),
        role="manager"
    )
    db.session.add(manager2)
    db.session.commit()

    employees_m1 = [
        User(
            name="Gokul",
            email="gokul@example.com",
            password=generate_password_hash("gokul123"),
            role="employee",
            manager_id=manager1.id
        ),
        User(
            name="Naveen",
            email="naveen@example.com",
            password=generate_password_hash("naveen123"),
            role="employee",
            manager_id=manager1.id
        ),
        User(
            name="Priya",
            email="priya@example.com",
            password=generate_password_hash("priya123"),
            role="employee",
            manager_id=manager1.id
        ),
        User(
            name="Rahul",
            email="rahul@example.com",
            password=generate_password_hash("rahul123"),
            role="employee",
            manager_id=manager1.id
        )
    ]

    employees_m2 = [
        User(
            name="Abi",
            email="abi@example.com",
            password=generate_password_hash("abi123"),
            role="employee",
            manager_id=manager2.id
        ),
        User(
            name="sasi",
            email="sasi@example.com",
            password=generate_password_hash("sasi123"),
            role="employee",
            manager_id=manager2.id
        ),
        User(
            name="Sabari",
            email="sabari@example.com",
            password=generate_password_hash("sabari123"),
            role="employee",
            manager_id=manager2.id
        ),
        User(
            name="Hari",
            email="hari@example.com",
            password=generate_password_hash("hari123"),
            role="employee",
            manager_id=manager2.id
        )
    ]

    db.session.add_all(employees_m1 + employees_m2)
    db.session.commit()

    feedback_data = [
        {
            "manager_id": manager1.id,
            "employee_id": employees_m1[0].id,
            "strengths": "Excellent problem-solving skills\nQuick learner",
            "improvements": "Could speak up more in meetings",
            "sentiment": "positive",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "acknowledged": True    
        },
        {
            "manager_id": manager1.id,
            "employee_id": employees_m1[1].id,
            "strengths": "Great teamwork",
            "improvements": "Time management needs improvement",
            "sentiment": "neutral",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "acknowledged": False
        },
        {
            "manager_id": manager1.id,
            "employee_id": employees_m1[2].id,
            "strengths": "Creative solutions",
            "improvements": "Needs to document work better",
            "sentiment": "positive",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "acknowledged": False
        },
        {
            "manager_id": manager1.id,
            "employee_id": employees_m1[3].id,
            "strengths": "Strong technical skills",
            "improvements": "Should collaborate more",
            "sentiment": "positive",
            "created_at": datetime.utcnow() - timedelta(days=3),
            "acknowledged": True
        },
        
        {
            "manager_id": manager2.id,
            "employee_id": employees_m2[0].id,
            "strengths": "Excellent communication\nProactive",
            "improvements": "Could deepen technical knowledge",
            "sentiment": "positive",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "acknowledged": True    
        },
        {
            "manager_id": manager2.id,
            "employee_id": employees_m2[1].id,
            "strengths": "Reliable under pressure",
            "improvements": "Should take more initiative",
            "sentiment": "neutral",
            "created_at": datetime.utcnow() - timedelta(days=4),
            "acknowledged": False
        },
        {
            "manager_id": manager2.id,
            "employee_id": employees_m2[2].id,
            "strengths": "Great with clients",
            "improvements": "Needs to meet deadlines better",
            "sentiment": "positive",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "acknowledged": False
        },
        {
            "manager_id": manager2.id,
            "employee_id": employees_m2[3].id,
            "strengths": "Innovative thinker",
            "improvements": "Should document processes more",
            "sentiment": "positive",
            "created_at": datetime.utcnow() - timedelta(days=3),
            "acknowledged": True
        }
    ]

    for data in feedback_data:
        feedback = Feedback(**data)
        db.session.add(feedback)
    
    db.session.commit()

    print("\nDPD Echo Database Seeded Successfully!\n")
    print("=== Manager Credentials ===")
    print(f"Manager 1: {manager1.email} | Password: sujil123")
    print(f"Manager 2: {manager2.email} | Password: alex123")
    
    print("\n=== Employee Credentials ===")
    for i, emp in enumerate(employees_m1 + employees_m2, 1):
        print(f"Employee {i}: {emp.email} | Password: {emp.name.lower()}123")
    
    print("\nTotal Managers: 2")
    print("Total Employees: 8")
    print("Total Feedback Entries: 8")
    print("\n===================================")
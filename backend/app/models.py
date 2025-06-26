from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), nullable=False)

    manager_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    team_members = db.relationship(
        "User",
        backref=db.backref("manager", remote_side=[id]),
        lazy=True
    )

    feedbacks_given = db.relationship(
        "Feedback", foreign_keys='Feedback.manager_id', backref="manager_user", lazy=True
    )
    feedbacks_received = db.relationship(
        "Feedback", foreign_keys='Feedback.employee_id', backref="employee_user", lazy=True
    )


class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    strengths = db.Column(db.Text, nullable=False)
    improvements = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    acknowledged = db.Column(db.Boolean, default=False)

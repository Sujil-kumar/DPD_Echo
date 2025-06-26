from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta

from .models import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///feedback.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)

    db.init_app(app)
    JWTManager(app)
    CORS(app)

    with app.app_context():
        db.create_all()

    from .auth import auth
    from .routes import routes
    app.register_blueprint(auth)
    app.register_blueprint(routes)

    return app
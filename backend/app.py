from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a strong secret

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  # <-- Add this line
    role = db.Column(db.String(10), nullable=False, default="admin")  # remove default


# Create DB
with app.app_context():
    db.create_all()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not password or not email:
        return jsonify({'error': 'Username, password, and email are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409  # ✅ check email

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(username=username, password=hashed_password, email=email, role='admin')
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid password'}), 401

    # Create JWT token
    access_token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "role": user.role  # <--- include this
    }), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"message": f"Hello {user.username}, this is a protected route"})

############ CRUD Operations for Users ############

# Get all users

@app.route('/admin/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [
    {
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'email': user.email
    }
    for user in users
]
    return jsonify(user_list)

# Add new user

@app.route('/admin/users', methods=['POST'])
def add_user():
    data = request.get_json()
    
    if not data:
        return jsonify({"msg": "Invalid JSON"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")  # default to 'user'

    if not username or not email or not password:
        return jsonify({"msg": "Missing required fields"}), 400

    # Check if username or email already exists
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"msg": "Username or email already exists"}), 409

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = User(username=username, email=email, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role
    }), 201


# Update existing user
# Update existing user (no JWT required)
@app.route('/admin/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Find the user to update
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Get data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "No JSON data received"}), 400

    # Update user fields
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data and data['password']:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    user.role = data.get('role', user.role)  # directly set "admin" or "user"

    # Commit changes
    db.session.commit()
    return jsonify({"message": "User updated successfully"})

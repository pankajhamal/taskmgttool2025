from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime
import json
# User specific tasks
import ast  # for converting string to list


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
    # New field — points to the admin that owns this user
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

# Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(500))
    status = db.Column(db.String(50), default='Pending')
    priority = db.Column(db.String(50), default='Medium')
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    assigned_to = db.Column(db.String(100), nullable=False)  # changed to STRING
    start_date = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)

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

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"error": "Username or email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # ✅ top-level admin has no owner
    new_user = User(username=username, password=hashed_password, email=email, role='admin', owner_id=None)
    
    db.session.add(new_user)
    db.session.commit()
    # Set owner_id to self for the admin
    new_user.owner_id = new_user.id
    db.session.commit()

    return jsonify({
        "message": "Admin created successfully",
        "id": new_user.id
    }), 201


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
    
    # Return id explicitly so frontend can use it
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "role": user.role,
        "id": user.id   # <-- Add this
    }), 200


############ CRUD Operations for Users ############

# Get all users
@app.route('/admin/users', methods=['GET'])
def get_users():
    owner_id = request.args.get('owner_id')

    if owner_id:
        users = User.query.filter(
            (User.owner_id == owner_id) | (User.id == owner_id)  # include the admin themselves
        ).all()
    else:
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
    role = data.get("role", "user")
    owner_id = data.get("owner_id")  # The admin creating this user

    if not username or not email or not password:
        return jsonify({"msg": "Missing required fields"}), 400

    if not owner_id:
        return jsonify({"msg": "Owner ID is required"}), 400

    # Check for duplicate username or email under the same owner
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"msg": "Username or email already exists"}), 409

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create the new user
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        role=role,
        owner_id=owner_id
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role,
        "owner_id": new_user.owner_id
    }), 201


# Update existing user

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


# Delete existing user
@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


######## Create Task ######################################
# Add new task
# Add new task
@app.route('/tasks', methods=['POST'])
def add_task():

    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    start_date = data.get("startDate")  # optional, format: YYYY-MM-DD
    due_date = data.get("dueDate")      # optional, format: YYYY-MM-DD
    assigned_to = data.get("assignedTo") # username or user_id
    priority = data.get("priority", "Medium")  # default to Medium
    owner_id = data.get("owner_id")     # admin creating the task

    if not title or not owner_id or not assigned_to:
        return jsonify({"msg": "Title, owner_id, and assignedTo are required"}), 400

    # Convert dates to datetime objects if provided
   
    assigned_to = str(data.get("assignedTo"))
    start_dt = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    due_dt = datetime.strptime(due_date, "%Y-%m-%d") if due_date else None


    new_task = Task(
        title=title,
        description=description,
        start_date=start_dt,
        due_date=due_dt,
        assigned_to=assigned_to,
        priority=priority,
        owner_id=owner_id,
        status="pending"  # default status
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "id": new_task.id,
        "title": new_task.title,
        "description": new_task.description,
        "startDate": start_dt.strftime("%Y-%m-%d") if start_dt else None,
        "dueDate": due_dt.strftime("%Y-%m-%d") if due_dt else None,
        "assignedTo": assigned_to,
        "priority": priority,
        "status": new_task.status,
        "owner_id": owner_id
    }), 201


# Get tasks for a specific admin/user
@app.route('/tasks', methods=['GET'])
def get_tasks():
    owner_id = request.args.get('owner_id')
    if not owner_id:
        return jsonify({"msg": "owner_id query param is required"}), 400

    tasks = Task.query.filter_by(owner_id=owner_id).all()
    task_list = []
    for t in tasks:
        task_list.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "owner_id": t.owner_id,
            "due_date": t.due_date.strftime("%Y-%m-%d") if t.due_date else None,
            "priority": t.priority,  # default if not in DB
            "assigned_to": t.assigned_to, 
        })
    return jsonify(task_list), 200


# Edit task 

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    # Update basic fields
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.priority = data.get("priority", task.priority)
    task.status = data.get("status", task.status)  # <-- update status

    # Convert due_date string to Python date object
    due_date_str = data.get("due_date")
    if due_date_str:
        try:
            task.due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"msg": "Invalid due_date format"}), 400

    assigned_members = data.get("assignedTo")
    if assigned_members is not None:
    # Store as string of names like: ['pankaj1', 'kshitiz']
        task.assigned_to = str(assigned_members)

    db.session.commit()
    return jsonify({"msg": "Task updated successfully"})


# Delete task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"msg": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"msg": "Task deleted successfully"}), 200


# Dashboard stats

# Get task counts
# Get task counts for a specific admin
@app.route('/task-counts', methods=['GET'])
def get_task_counts():
    try:
        admin_id = request.args.get('admin_id')
        if not admin_id:
            return jsonify({"error": "admin_id is required"}), 400

        total_tasks = Task.query.filter_by(owner_id=admin_id).count()
        pending_tasks = Task.query.filter_by(owner_id=admin_id, status='Pending').count()
        completed_tasks = Task.query.filter_by(owner_id=admin_id, status='Completed').count()

        return jsonify({
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "completed_tasks": completed_tasks
        })
    except Exception as e:
        print("Error fetching task counts:", e)
        return jsonify({"error": "Something went wrong"}), 500



# Get admin name
# Get admin name for a specific admin
@app.route("/admin", methods=["GET"])
def get_admin():
    admin_id = request.args.get('admin_id')
    if not admin_id:
        return jsonify({"error": "admin_id is required"}), 400

    admin_user = User.query.get(admin_id)
    if not admin_user or admin_user.role != "admin":
        return jsonify({"error": "Admin not found"}), 404

    return jsonify({"name": admin_user.username})



@app.route('/user/tasks', methods=['GET'])
def get_user_tasks():
    username = request.args.get("username")
    if not username:
        return jsonify({"msg": "Username is required"}), 400

    tasks = Task.query.all()  # get all tasks
    user_tasks = []

    for t in tasks:
        try:
            assigned_list = ast.literal_eval(t.assigned_to)  # convert string to list
        except:
            assigned_list = []

        if username in assigned_list:
            user_tasks.append({
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "status": t.status,
                "assigned_to": assigned_list,
                "priority": t.priority if hasattr(t, "priority") else "Low",  # <-- add priority
                "start_date": t.start_date if hasattr(t, "start_date") else None,
                "due_date": t.due_date.strftime("%Y-%m-%d") if t.due_date else None
            })

    return jsonify(user_tasks), 200


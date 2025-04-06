import os
import time
import random
import logging
from flask import Flask, request, jsonify
import smtplib
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
from flask import Flask, request, jsonify
import pandas as pd
import joblib
import numpy as np

# ✅ Load environment variables
load_dotenv()

cred = credentials.Certificate("firebase-service-account.json")  # Your Firebase credentials JSON file
firebase_admin.initialize_app(cred)

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app)

# ✅ Configure Flask-Mail for Gmail
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")  # Load from .env
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")  # Load from .env

mail = Mail(app)

# ✅ Store OTPs with expiration
otp_storage = {}

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)

# Load the trained models
sales_model = joblib.load('models/sales_projection_model.pkl')
restock_model = joblib.load('models/restock_prediction_model.pkl')
price_model = joblib.load('models/price_forecasting_model.pkl')

# ✅ Configure Logging
logging.basicConfig(level=logging.INFO)

# ✅ Route to Send OTP
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    try:
        # ✅ Check if the email is already registered in Firebase
        user = auth.get_user_by_email(email)
        return jsonify({"error": "Email is already registered"}), 400  # Stop here if the email exists

    except firebase_admin.auth.UserNotFoundError:
        # If user is not found, continue sending OTP
        pass  

    # Generate a random 6-digit OTP
    otp = str(random.randint(100000, 999999))

    # Store OTP with timestamp (valid for 5 minutes)
    otp_storage[email] = {"otp": otp, "timestamp": time.time()}

    # Send OTP via email
    msg = Message("Your OTP Code", sender=app.config["MAIL_USERNAME"], recipients=[email])
    msg.body = f"Your OTP code is: {otp}\nThis OTP is valid for 5 minutes."

    try:
        mail.send(msg)
        logging.info(f"OTP sent successfully to {email}")
        return jsonify({"message": "OTP sent successfully!"})

    except Exception as e:
        logging.error(f"Error sending OTP: {e}")
        return jsonify({"error": f"Failed to send email. {str(e)}"}), 500

# ✅ Route to Verify OTP
@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    if email not in otp_storage:
        return jsonify({"error": "No OTP found for this email"}), 400

    stored_otp = otp_storage[email]
    
    # Check OTP expiration (5 minutes)
    if time.time() - stored_otp["timestamp"] > 300:
        del otp_storage[email]
        return jsonify({"error": "OTP expired"}), 400

    if stored_otp["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    del otp_storage[email]  # Remove OTP after successful verification
    return jsonify({"message": "OTP verified successfully!"})

# ✅ Route to Check if Email Exists in Firebase
@app.route("/check-email", methods=["POST", "OPTIONS"])
def check_email():
    if request.method == 'OPTIONS':
        return _corsify_actual_response(jsonify({}))  # Handle preflight request

    try:
        data = request.json
        email = data.get("email")

        user = auth.get_user_by_email(email)
        return _corsify_actual_response(jsonify({"exists": True}))

    except firebase_admin.auth.UserNotFoundError:
        return _corsify_actual_response(jsonify({"exists": False}))

    except Exception as e:
        return _corsify_actual_response(jsonify({"error": str(e)})), 500
    
def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE")
    return response

# Predict Sales Endpoint
@app.route('/predict_sales', methods=['POST'])
def predict_sales():
    data = request.json
    features = data['features']

    # List of columns used during training
    expected_columns = [
        'channel', 'category', 'price', 'stock', 'sales_last_month', 'sales_last_year', 
        'discount', 'marketing_spend', 'website_traffic', 'competitor_pricing', 
        'stock_availability', 'customer_sentiment', 'promotion_type', 'location', 'region', 
        'delivery_time', 'product_rating', 'store_type'
    ]
    
    # Ensure the provided features match the expected columns
    if len(features) != len(expected_columns):
        return jsonify({"error": f"Expected {len(expected_columns)} features, but got {len(features)}"}), 400

    # Create DataFrame from the features list
    features_df = pd.DataFrame([features], columns=expected_columns)
    
    # Apply One-Hot Encoding for categorical features (e.g., 'channel', 'category', etc.)
    features_encoded = pd.get_dummies(features_df, columns=['channel', 'category', 'promotion_type', 'location', 'region', 'store_type'], drop_first=True)
    
    # Ensure the number of features is exactly 18 (after encoding)
    if features_encoded.shape[1] != 18:
        return jsonify({"error": f"Expected 18 features, but got {features_encoded.shape[1]}"}), 400
    
    # Convert the DataFrame to a numpy array
    features_array = np.array(features_encoded).reshape(1, -1)
    
    # Make prediction
    prediction = sales_model.predict(features_array)
    
    return jsonify({'prediction': prediction.tolist()})

# Predict Restock Endpoint
@app.route('/predict_restock', methods=['POST'])
def predict_restock():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    prediction = restock_model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

# Predict Price Endpoint
@app.route('/predict_price', methods=['POST'])
def predict_price():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    prediction = price_model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
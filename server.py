import os
import time
import random
import logging
from flask import Flask, request, jsonify
import smtplib
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Flask App
app = Flask(__name__)

otp_store = {} 

CORS(app)

# ✅ Configure Flask-Mail for Gmail
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")  # Load from .env
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")  # Load from .env

mail = Mail(app)

# ✅ Configure Logging
logging.basicConfig(level=logging.INFO)

# ✅ Store OTPs with expiration
otp_storage = {}

# ✅ Route to Send OTP
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

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

# ✅ Run Flask App
if __name__ == "__main__":
    app.run(debug=True)

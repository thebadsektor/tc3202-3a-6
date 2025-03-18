import firebase_admin
from firebase_admin import credentials, firestore
from auth_service import signup_user, login_user

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("Firebase Admin Initialized Successfully!")

# Test Signup
email = "test@example.com"
password = "SecurePass123"
full_name = "Test User"

signup_response = signup_user(email, password, full_name)
print("📌 Signup Response:", signup_response)

# Test Login
login_response = login_user(email, password)
print("📌 Login Response:", login_response)
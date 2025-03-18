import firebase_admin
from firebase_admin import credentials
from auth_service import signup_user, login_user

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)

print("✅ Firebase Admin Initialized Successfully!")


# Test Signup
signup_response = signup_user("test@example.com", "SecurePass123", "Test User")
print("📌 Signup Response:", signup_response)

# Test Login
login_response = login_user("test@example.com", "SecurePass123")
print("📌 Login Response:", login_response)
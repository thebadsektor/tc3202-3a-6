import firebase_admin
from firebase_admin import credentials, auth, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)
    
# Firestore database instance
db = firestore.client()
auth = auth
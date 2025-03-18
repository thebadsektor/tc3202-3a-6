import requests
from firebase_admin import auth
from firebase_config import db

API_KEY = "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw"

# Signup Function
def signup_user(email, password, full_name):
    try:
        user = auth.create_user(email=email, password=password)
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            "name": full_name,
            "email": email,
            "uid": user.uid
        })
        return {"message": "User created successfully!", "uid": user.uid}
    except Exception as e:
        return {"error": str(e)}

# Login Function using Firebase REST API
def login_user(email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    data = {"email": email, "password": password, "returnSecureToken": True}

    response = requests.post(url, json=data)
    result = response.json()

    if "idToken" in result:
        return {
            "uid": result["localId"],
            "email": result["email"],
            "idToken": result["idToken"],
            "refreshToken": result["refreshToken"]
        }
    else:
        return {"error": result.get("error", {}).get("message", "Login failed")}
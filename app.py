import os
import time
import random
import logging
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
import pandas as pd
import joblib
import numpy as np
from datetime import datetime, timedelta

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Firebase
cred = credentials.Certificate("firebase-service-account.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# ✅ Initialize Flask App
app = Flask(__name__)
CORS(app)

# ✅ Configure Flask-Mail for Gmail
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)

# ✅ Store OTPs with expiration
otp_storage = {}

# ✅ Configure Logging
logging.basicConfig(level=logging.INFO)

# ✅ Load ML Models
model_dir = "tuned_models"
trend_model = joblib.load(os.path.join(model_dir, "trend_model_xgb_optimized_1.pkl"))
stock_model = joblib.load(os.path.join(model_dir, "stock_model_xgb_optimized_1.pkl"))
price_model = joblib.load(os.path.join(model_dir, "price_model_xgb_optimized_1.pkl"))

# ✅ Load preprocessing tools
scaler = joblib.load(os.path.join(model_dir, "minmax_scale_1.pkl"))
label_encoder = joblib.load(os.path.join(model_dir, "label_encoder_1.pkl"))

# ✅ Send OTP Endpoint
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = auth.get_user_by_email(email)
        return jsonify({"error": "Email is already registered"}), 400
    except firebase_admin.auth.UserNotFoundError:
        pass

    otp = str(random.randint(100000, 999999))
    otp_storage[email] = {"otp": otp, "timestamp": time.time()}

    msg = Message("Your OTP Code", sender=app.config["MAIL_USERNAME"], recipients=[email])
    msg.body = f"Your OTP code is: {otp}\nThis OTP is valid for 5 minutes."

    try:
        mail.send(msg)
        logging.info(f"OTP sent to {email}")
        return jsonify({"message": "OTP sent successfully!"})
    except Exception as e:
        logging.error(f"Error sending OTP: {e}")
        return jsonify({"error": f"Failed to send email. {str(e)}"}), 500
    
@app.route("/send-otp2", methods=["POST"])
def send_otp2():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    otp = str(random.randint(100000, 999999))
    otp_storage[email] = {"otp": otp, "timestamp": time.time()}

    msg = Message("Your OTP Code", sender=app.config["MAIL_USERNAME"], recipients=[email])
    msg.body = f"Your OTP code is: {otp}\nThis OTP is valid for 5 minutes."

    try:
        mail.send(msg)
        logging.info(f"OTP sent to {email}")
        return jsonify({"message": "OTP sent successfully!"})
    except Exception as e:
        logging.error(f"Error sending OTP: {e}")
        return jsonify({"error": f"Failed to send email. {str(e)}"}), 500
    

# ✅ Verify OTP Endpoint
@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    if email not in otp_storage:
        return jsonify({"error": "No OTP found for this email"}), 400

    stored = otp_storage[email]
    if time.time() - stored["timestamp"] > 300:
        del otp_storage[email]
        return jsonify({"error": "OTP expired"}), 400

    if stored["otp"] != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    del otp_storage[email]
    return jsonify({"message": "OTP verified successfully!"})

# ✅ Check if Email Exists
@app.route("/check-email", methods=["POST", "OPTIONS"])
def check_email():
    if request.method == "OPTIONS":
        return _corsify_actual_response(jsonify({}))

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

# ✅ Predict Endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Convert JSON to DataFrame
        input_df = pd.DataFrame([data])

        # Scale numeric features
        numeric_columns = scaler.feature_names_in_
        input_scaled = pd.DataFrame(scaler.transform(input_df[numeric_columns]), columns=numeric_columns)

        # Run predictions
        trend_pred = trend_model.predict(input_scaled)
        stock_pred = stock_model.predict(input_scaled)
        price_pred = price_model.predict(input_scaled)

        # Decode label
        predicted_category = label_encoder.inverse_transform(trend_pred)[0]

        return jsonify({
            "predicted_category": predicted_category,
            "predicted_stock_level": round(float(stock_pred[0]), 2),
            "predicted_price": round(float(price_pred[0]), 2)
        })

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/predict-top-trending", methods=["GET"])
def predict_top_trending():
    try:
        # Load dataset
        df = pd.read_csv("tuned_models/Dataset_for_forecasting_system.csv")
        df.columns = df.columns.str.strip()

        # Convert to datetime
        df['Date'] = pd.to_datetime(df[['Year', 'Month', 'Day']])
        df.dropna(inplace=True)

        # Forecast next month
        max_date = df['Date'].max()
        next_month = max_date + pd.DateOffset(months=1)
        df['NextMonth'] = next_month

        # Recreate Product column
        brand_cols = [col for col in df.columns if col.startswith("ProductBrand_")]
        category_cols = [col for col in df.columns if col.startswith("ProductCategory_")]
        df['ProductBrand'] = df[brand_cols].idxmax(axis=1).str.replace("ProductBrand_", "")
        df['ProductCategory'] = df[category_cols].idxmax(axis=1).str.replace("ProductCategory_", "")
        df['Product'] = df['ProductBrand'] + " " + df['ProductCategory']

        # Add missing expected columns
        expected_columns = [
            'ProductBrand_Other_Brands',
            'Dynamic_Pricing_Strategy_Competitive_Pricing',
            'Dynamic_Pricing_Strategy_Discount_Pricing',
            'Dynamic_Pricing_Strategy_Premium_Pricing',
            'Dynamic_Pricing_Strategy_Standard_Pricing',
            'avg_price_per_brand',
            'count_per_category'
        ]
        for col in expected_columns:
            if col not in df.columns:
                df[col] = 0  # Default to 0

        # Feature engineering
        df['avg_price_per_brand'] = df.groupby('Product')['ProductPrice'].transform('mean')
        df['count_per_category'] = df.groupby('ProductCategory')['Product'].transform('count')

        # Handle missing sales column
        if 'Sales' in df.columns:
            df['ActualSales'] = df.groupby('Product')['Sales'].transform('sum')
        else:
            df['ActualSales'] = 0

        # Load models
        stock_model = joblib.load("tuned_models/stock_model_xgb_optimized_1.pkl")
        price_model = joblib.load("tuned_models/price_model_xgb_optimized_1.pkl")
        scaler = joblib.load("tuned_models/minmax_scale_1.pkl")

        # Prepare features
        feature_columns = stock_model.feature_names_in_
        df_model_input = df[feature_columns].copy()

        # Scale numeric columns
        numeric_columns = df_model_input.select_dtypes(include=['number']).columns
        df_model_input[numeric_columns] = scaler.transform(df_model_input[numeric_columns])

        # Handle missing values
        df_model_input = df_model_input.fillna(df_model_input.mean())

        # Predict stock and price
        df['predicted_stock'] = stock_model.predict(df_model_input)
        df['predicted_price'] = price_model.predict(df_model_input)

        # Round for presentation
        df['predicted_price'] = df['predicted_price'].apply(lambda x: round(x, 2))
        df['predicted_stock'] = df['predicted_stock'].apply(lambda x: round(x))

        # Aggregate predictions
        top_products = df.groupby('Product').agg({
            'predicted_price': 'mean',
            'predicted_stock': 'mean'
        }).sort_values(by='predicted_stock', ascending=False).head(25).reset_index()

        # Divide predicted stock by 9 before rounding and calculating sales
        top_products['predicted_stock'] = top_products['predicted_stock'] / 9

        # Round again to ensure clean output
        top_products['predicted_price'] = top_products['predicted_price'].apply(lambda x: format(x, '.2f'))
        top_products['predicted_stock'] = top_products['predicted_stock'].apply(lambda x: int(round(x)))

        # Ensure predicted_price is float before multiplying
        top_products['predicted_price'] = top_products['predicted_price'].astype(float)

        # Calculate predicted sales
        top_products['predicted_sales'] = top_products['predicted_stock'] * top_products['predicted_price']
        top_products['predicted_sales'] = top_products['predicted_sales'].apply(lambda x: round(x, 2))

        # Return top 25 products with predictions
        return jsonify({
            "top_25_trending_products": top_products.to_dict(orient='records')
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/product-summary", methods=["GET"])
def product_summary():
    try:
        # Load dataset
        df = pd.read_csv("tuned_models/Dataset_for_forecasting_system.csv")
        df.columns = df.columns.str.strip()  # Strip any extra spaces in column names
        
        # Create 'Product' column by combining 'ProductCategory' and 'ProductBrand'
        category_cols = [col for col in df.columns if col.startswith("ProductCategory_")]
        brand_cols = [col for col in df.columns if col.startswith("ProductBrand_")]

        # Create 'ProductCategory' and 'ProductBrand' columns by finding the max category/brand per row
        df['ProductCategory'] = df[category_cols].idxmax(axis=1).str.replace("ProductCategory_", "")
        df['ProductBrand'] = df[brand_cols].idxmax(axis=1).str.replace("ProductBrand_", "")
        
        # Combine them to create a 'Product' column
        df['Product'] = df['ProductBrand'] + " " + df['ProductCategory']
        
        # Check if the necessary columns exist
        required_columns = ['Units_Sold_per_Transaction', 'ProductPrice']
        if not all(col in df.columns for col in required_columns):
            return jsonify({
                "error": "Required columns are missing in the dataset",
                "columns": df.columns.tolist()  # Return the column names in the response for debugging
            }), 400
        
        # Calculate total orders and total sales by aggregating relevant columns
        summary_df = df.groupby('Product').agg(
            total_orders=pd.NamedAgg(column='Units_Sold_per_Transaction', aggfunc='sum'),
            total_sales=pd.NamedAgg(column='ProductPrice', aggfunc=lambda x: (x * df.loc[x.index, 'Units_Sold_per_Transaction']).sum()),
            product_count=pd.NamedAgg(column='Product', aggfunc='count')
        ).reset_index()

        # Optional: Round the results for better presentation
        summary_df['total_sales'] = summary_df['total_sales'].apply(lambda x: round(x, 2))
        summary_df['total_orders'] = summary_df['total_orders'].apply(lambda x: int(x))

        # Return the aggregated data as JSON
        return jsonify({
            "product_summary": summary_df.to_dict(orient='records')
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ✅ Run Flask App
if __name__ == "__main__":
    app.run(debug=True)

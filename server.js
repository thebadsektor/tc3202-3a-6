const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json'); // Make sure this file exists
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: "https://firestore.googleapis.com/v1/projects/techforecastinitial/databases/(default)/documents/" // Replace with your Firestore URL
});

const app = express();
app.use(cors());
app.use(bodyParser.json());



// Signup API
app.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        const user = await admin.auth().createUser({ email, password });

        // Store user details in Firestore
        await admin.firestore().collection('users').doc(user.uid).set({
            fullName, email, createdAt: new Date()
        });

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login API
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await admin.auth().getUserByEmail(email);
        res.json({ message: "Login successful!", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw",
    authDomain: "techforecastinitial.firebaseapp.com",
    projectId: "techforecastinitial",
    storageBucket: "techforecastinitial.firebasestorage.app",
    messagingSenderId: "1022311444244",
    appId: "1:1022311444244:web:ef464c4c03285bb351dc01",
    measurementId: "G-G421TQ07R4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.showLogin = function () {
    document.getElementById("signupContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
    localStorage.setItem("lastPage", "login");
};

window.showSignup = function () {
    document.getElementById("signupContainer").style.display = "block";
    document.getElementById("loginContainer").style.display = "none";
    localStorage.setItem("lastPage", "signup");
};

// OTP Generation and Verification
window.sendOtp = async function () {
    const email = document.getElementById("email").value.trim();
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const otpTimer = document.getElementById("otpTimer");

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    sendOtpBtn.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:5000/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("otp", data.otp);
            localStorage.setItem("otpExpires", Date.now() + 5 * 60 * 1000); // 5-minute expiration
            alert("OTP sent successfully! Check your email.");

            // Start countdown
            startOtpCountdown(180);
        } else {
            alert("Error: " + data.error);
            sendOtpBtn.disabled = false; 
        }
    } catch (error) {
        alert("Failed to send OTP. Check your server connection.");
        sendOtpBtn.disabled = false;
    }
};

function startOtpCountdown(durationInSeconds) {
    let sendOtpBtn = document.getElementById("sendOtpBtn");
    let otpTimer = document.getElementById("otpTimer");
    
    if (!otpTimer) {
        console.error("OTP Timer element not found!");
        return;
    }

    let timeLeft = durationInSeconds;
    otpTimer.innerText = `Resend OTP in ${timeLeft} seconds`;
    
    let countdown = setInterval(() => {
        timeLeft--;
        otpTimer.innerText = `Resend OTP in ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            otpTimer.innerText = "Click to Resend OTP";
            sendOtpBtn.disabled = false;
        }
    }, 1000);

    sendOtpBtn.disabled = true;
}

window.verifyOtp = async function () {
    const email = document.getElementById("email").value.trim();
    const enteredOtp = document.getElementById("otpCode").value.trim();
    const otpStatus = document.getElementById("otpStatus");

    if (!enteredOtp) {
        alert("Please enter the OTP.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, otp: enteredOtp })
        });

        const data = await response.json();

        if (response.ok) {
            otpStatus.innerText = "✅ OTP Verified! You can now sign up.";
            otpStatus.style.color = "green";
            localStorage.setItem("otpVerified", "true");
        } else {
            otpStatus.innerText = "❌ Incorrect OTP. Try again.";
            otpStatus.style.color = "red";
        }
    } catch (error) {
        alert("OTP verification failed. Check your server connection.");
    }
};


// ✅ Toggle Signup/Login Forms
document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("loginContainer");
    const signupContainer = document.getElementById("signupContainer");

    // Check the last visited page
    const lastPage = localStorage.getItem("lastPage");

    if (lastPage === "signup") {
        showSignup();
    } else {
        showLogin();
    }

    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", loginUser);
    }

    const signupBtn = document.getElementById("signupBtn");
    if (signupBtn) {
        signupBtn.addEventListener("click", signupUser);
    }
});

// ✅ Signup Function
async function signupUser() {
    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const shopName = document.getElementById("shopName").value.trim();
    const address = document.getElementById("address").value.trim();
    const otpStatus = document.getElementById("otpStatus").innerText.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (otpStatus !== "✅ OTP Verified! You can now sign up.") {
        alert("Please verify your OTP before signing up.");
        return;
    }

    if (!firstName || !lastName || !shopName || !address || !email || !password || ! confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/; // Only letters, one space allowed
    const shopRegex = /^[a-zA-Z0-9\s]{4,}$/; // Min 4 characters, letters & numbers
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/; // 8 chars, 1 number, 1 special char

    if (!nameRegex.test(firstName) || firstName.length < 2) {
        alert("First name must be at least 2 characters and contain no special characters.");
        return;
    }
    if (middleName && !nameRegex.test(middleName)) {
        alert("Middle name must contain only letters and at most one space.");
        return;
    }
    if (!nameRegex.test(lastName) || lastName.length < 2) {
        alert("Last name must be at least 2 characters and contain no special characters.");
        return;
    }
    if (!shopRegex.test(shopName)) {
        alert("Shop name must be at least 4 characters long.");
        return;
    }
    if (!address) {
        alert("Please enter your address.");
        return;
    }
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters and include 1 special character and 1 number.");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            shopName: shopName,
            address: address,
            email: email,
            createdAt: new Date()
        });

        alert("User registered successfully!");
        showLogin(); // Show login form
    } catch (error) {
        alert("Signup Error: " + error.message);
    }
}

// ✅ Login Function
async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "home.html"; // Redirect to home page
    } catch (error) {
        alert("Login Error: " + error.message);
    }
}

window.logoutUser = async function () {
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
        alert("Logout Error: " + error.message);
    }
};

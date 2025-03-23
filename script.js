import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
    const signupContainer = document.getElementById("signupContainer");
    const loginContainer = document.getElementById("loginContainer");
    const forgotPasswordContainer = document.getElementById("forgotPasswordContainer");

    // Check if each element exists before modifying it
    if (signupContainer) {
        signupContainer.style.display = "none";
    }

    if (loginContainer) {
        loginContainer.style.display = "block";
    }

    if (forgotPasswordContainer) {
        forgotPasswordContainer.style.display = "none";
    }
    // Store the last visited page in localStorage
    localStorage.setItem("lastPage", "login");
};


window.showForgotPassword = function () {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("forgotPasswordContainer").style.display = "block";
    localStorage.setItem("lastPage", "login");
};

window.showSignup = function () {
    document.getElementById("signupContainer").style.display = "block";
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("forgotPasswordContainer").style.display = "none";
    localStorage.setItem("lastPage", "login");
};

// OTP Generation and Verification
window.sendOtp = async function () {
    const email = document.getElementById("email").value.trim();
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const otpTimer = document.getElementById("otpTimer");

    if (!email) {
        Swal.fire({
            title: "Please enter your email.",
            text: "No email provided.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: "Invalid Email",
            text: "Please enter a valid email address.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        return;
    }

    sendOtpBtn.disabled = true;
    showLoadingSpinner();

    try {
        const response = await fetch("http://127.0.0.1:5000/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        hideLoadingSpinner();

        if (response.status === 400 && data.error === "Email is already registered") {
            // 🚨 Show alert if email is already registered
            Swal.fire({
                title: "Email Already Registered!",
                text: "Please use a different email.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false
            });
            sendOtpBtn.disabled = false;
            return;
        }

        if (response.ok) {
            localStorage.setItem("otp", data.otp);
            localStorage.setItem("otpExpires", Date.now() + 5 * 60 * 1000); // 5-minute expiration

            // Show a disappearing alert
            Swal.fire({
                title: "OTP Sent Successfully!",
                text: "Check your email.",
                icon: "success",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });

            // Start countdown
            startOtpCountdown(120);
        } else {
            Swal.fire({
                title: "Error sending OTP!",
                text: "Please try again.",
                icon: "error",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
            sendOtpBtn.disabled = false; 
        }
    } catch (error) {
         Swal.fire({
                title: "Error sending OTP!",
                text: "Please try again.",
                icon: "error",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
        sendOtpBtn.disabled = false;
    }
};

// ✅ Show Loading Spinner
function showLoadingSpinner() {
    Swal.fire({
        title: "Sending OTP...",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

// ✅ Hide Loading Spinner
function hideLoadingSpinner() {
    Swal.close(); // Closes the loading alert before showing a new one
}

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
    const otpInput = document.getElementById("otpCode");

    if (!enteredOtp) {
        Swal.fire({
            title: "Please enter the OTP.",
            text: "No OTP provided.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
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
            if (otpInput) {
                otpInput.disabled = true;
            }
        } else {
            otpStatus.innerText = "❌ Incorrect OTP. Try again.";
            otpStatus.style.color = "red";
            Swal.fire({
                title: "Verification code incorrect!",
                text: "Please try again..",
                icon: "error",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error verifying OTP!",
            text: "Please try again.",
            icon: "error",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
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

function checkEmailExists(email) {
    return auth.fetchSignInMethodsForEmail(email)
        .then(signInMethods => {
            if (signInMethods.length > 0) {
                throw new Error("Email is already in use.");
            }
        });
}

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

    if (!firstName || !lastName || !shopName || !address || !email || !password || ! confirmPassword) {
        Swal.fire({
            title: "Please fill all fields.",
            text: "All fields are required.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }

    const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/; // Only letters, one space allowed
    const shopRegex = /^[a-zA-Z0-9\s]{4,}$/; // Min 4 characters, letters & numbers
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/; // 8 chars, 1 number, 1 special char

    if (!nameRegex.test(firstName) || firstName.length < 2) {
        Swal.fire({
            title: "Invalid First Name",
            text: "First name must be at least 2 characters and contain no special characters.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (middleName && !nameRegex.test(middleName)) {
        Swal.fire({
            title: "Invalid Middle Name",
            text: "Middle name must contain only letters.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (!nameRegex.test(lastName) || lastName.length < 2) {
        Swal.fire({
            title: "Invalid Last Name",
            text: "Last name must be at least 2 characters and contain no special characters.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (!shopRegex.test(shopName)) {
        Swal.fire({
            title: "Invalid Shop Name",
            text: "Shop name must be at least 4 characters and contain only letters and numbers.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (!address) {
        Swal.fire({
            title: "Invalid Address",
            text: "Address is required.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (otpStatus !== "✅ OTP Verified! You can now sign up.") {
        Swal.fire({
            title: "Please verify your email.",
            text: "You must verify your email with OTP.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (!passwordRegex.test(password)) {
        Swal.fire({
            title: "Invalid Password",
            text: "Password must be at least 8 characters and contain a number and special character.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }
    if (password !== confirmPassword) {
        Swal.fire({
            title: "Passwords do not match",
            text: "Please re-enter your password.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
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

        Swal.fire({
            title: "Signup Successful!",
            text: "You can now login.",
            icon: "success",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        showLogin(); // Show login form
    } catch (error) {
        Swal.fire({
            title: "Signup Error",
            text: error.message,
            icon: "error",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
    }
}

// ✅ Login Function
async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        Swal.fire({
            title: "Please fill all fields.",
            text: "Email and password are required.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Print UID to console
        console.log("User UID:", user.uid);
        localStorage.setItem("uid", user.uid);

        Swal.fire({
            title: "Login Successful!",
            text: "Redirecting to home page.",
            icon: "success",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        setTimeout(() => {
            window.location.href = "home.html";
        }, 3000);
    } catch (error) {
        Swal.fire({
            title: "Login Error",
            text: "Please check your email and password.",
            icon: "error",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
    }
}

// ✅ Reset Password Function
window.resetPassword = async function () {
    const email = document.getElementById("resetEmail").value.trim();
    const resetBtn = document.getElementById("resetBtn");

    if (!email) {
        Swal.fire({
            title: "Please enter your email.",
            text: "Email field cannot be empty.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: "Invalid Email",
            text: "Please enter a valid email address.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        return;
    }

    resetBtn.disabled = true; // Disable button while processing
    showLoadingSpinner();

    try {
        const response = await fetch("http://127.0.0.1:5000/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (response.status === 404 || data.error === "Email not found") {
            hideLoadingSpinner();
            Swal.fire({
                title: "Email Not Found!",
                text: "The provided email is not registered in our system.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false
            });
            resetBtn.disabled = false;
            return;
        }

        if(response.ok && data.exists){
            if (typeof auth === "undefined") {
                hideLoadingSpinner();
                Swal.fire({
                    title: "Firebase Auth Not Initialized",
                    text: "There was an issue with Firebase authentication setup.",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false
                });
                resetBtn.disabled = false;
                return;
            }

            await sendPasswordResetEmail(auth, email);

            hideLoadingSpinner();
            Swal.fire({
                title: "Password Reset Email Sent!",
                text: "Check your inbox to reset your password.",
                icon: "success",
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            }).then(() => {
                window.location.href = "index.html"; // Redirect after alert closes
            });
        }else {
            hideLoadingSpinner();
            Swal.fire({
                title: "Error Resetting Password",
                text: "Email didn't found.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        hideLoadingSpinner();
        Swal.fire({
            title: "Error Resetting Password",
            text: error.message,
            icon: "error",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
    }
    resetBtn.disabled = false;
};


window.logoutUser = async function () {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, log out",
        cancelButtonText: "No, stay",
        reverseButtons: true
    });

    if (result.isConfirmed) {
        try {
            await signOut(auth);
            Swal.fire({
                title: "Logged Out",
                text: "You have been logged out successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "index.html"; // Redirect to login page
            });
        } catch (error) {
            Swal.fire({
                title: "Logout Error",
                text: "An error occurred while logging out.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false
            });
        }
    }
};

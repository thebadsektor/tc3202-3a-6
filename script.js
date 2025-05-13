import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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

function markInvalidOtp(input) {
    input.style.border = "2px solid red";
    input.addEventListener("input", () => {
        input.style.border = ""; // Remove red border when typing again
    }, { once: true }); // Ensures the listener only runs once per error
}

// OTP Generation and Verification
window.sendOtp = async function () {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
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
        emailInput.style.border = "2px solid red";
        emailInput.addEventListener("input", () => {
            emailInput.style.border = "";
        }, { once: true });
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
        emailInput.style.border = "2px solid red";
        emailInput.addEventListener("input", () => {
            emailInput.style.border = "";
        }, { once: true });
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

function showloginLoadingSpinner() {
    Swal.fire({
        title: "Logging in...",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

function showsigningin() {
    Swal.fire({
        title: "Signing in...",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
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
    const verifyEmailBtn = document.getElementById("verifyOtpBtn");

    if (!enteredOtp) {
        Swal.fire({
            title: "Please enter the OTP.",
            text: "No OTP provided.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        markInvalidOtp(otpInput);
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
                verifyEmailBtn.disabled = true;
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
            markInvalidOtp(otpInput);
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

    setupPasswordToggles();
});

function checkEmailExists(email) {
    return auth.fetchSignInMethodsForEmail(email)
        .then(signInMethods => {
            if (signInMethods.length > 0) {
                throw new Error("Email is already in use.");
            }
        });
}

const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", function (e) {
    // Remove any non-numeric character immediately
    this.value = this.value.replace(/[^0-9]/g, '');
});

function markInvalid(input) {
    input.style.border = "2px solid red";
    input.addEventListener("input", () => {
        input.style.border = ""; // Reset the border when the user starts typing
    });
}

function markInvalidGender(genderRadios) {
    genderRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            genderRadios.forEach(radio => {
                radio.closest('label').style.border = ''; // Reset the border when the user selects any option
            });
        });
    });
    genderRadios.forEach(radio => {
        radio.closest('label').style.border = "2px solid red"; // Set border to red when no gender is selected
    });
}

// ✅ Signup Function
async function signupUser() {
    const firstNameInput = document.getElementById("firstName");
    const middleNameInput = document.getElementById("middleName");
    const lastNameInput = document.getElementById("lastName");
    const shopNameInput = document.getElementById("shopName");
    const addressInput = document.getElementById("address");
    const otpStatusInput = document.getElementById("otpStatus").innerText.trim();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const phoneInput = document.getElementById("phone");

    const genderRadios = document.getElementsByName("gender");
    let selectedGender = "";
    genderRadios.forEach(radio => {
        if (radio.checked) {
            selectedGender = radio.value;
        }
    });

    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const shopName = shopNameInput.value.trim();
    const address = addressInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const phone = phoneInput.value.trim();

    if (!firstName || !lastName || !shopName || !address || !email || !password || !confirmPassword || !phone) {
        Swal.fire({
            title: "Please fill all fields.",
            text: "All fields are required.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });

        if (!firstName) markInvalid(firstNameInput);
        if (!lastName) markInvalid(lastNameInput);
        if (!shopName) markInvalid(shopNameInput);
        if (!address) markInvalid(addressInput);
        if (!email) markInvalid(emailInput);
        if (!password) markInvalid(passwordInput);
        if (!confirmPassword) markInvalid(confirmPasswordInput);
        if (!phone) markInvalid(phoneInput);
        if (!selectedGender) markInvalidGender(genderRadios);

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
        markInvalid(firstNameInput);
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
        markInvalid(middleNameInput);
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
        markInvalid(lastNameInput);
        return;
    }
    if (!selectedGender) {
        Swal.fire({
            title: "Invalid Gender",
            text: "Please select your gender.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        markInvalidGender(genderRadios);
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
        markInvalid(shopNameInput);
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
        markInvalid(addressInput);
        return;
    }
    if (phone.length !== 11 || !phone.startsWith("09")) {
        Swal.fire({
            title: "Invalid Phone Number",
            text: "Phone number must be exactly 11 digits and start with 09.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        markInvalid(phoneInput);
        return;
    }

    if (otpStatusInput !== "✅ OTP Verified! You can now sign up.") {
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
        markInvalid(passwordInput);
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
        markInvalid(passwordInput);
        markInvalid(confirmPasswordInput);
        return;
    }

    showsigningin();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const randomProfileIndex = Math.floor(Math.random() * 5) + 1;
        const profileImage = `profile/profile${randomProfileIndex}.jpg`;

        await setDoc(doc(db, "users", user.uid), {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            gender: selectedGender,
            shopName: shopName,
            address: address,
            email: email,
            phone : phone,
            profileImage: profileImage, 
            createdAt: new Date()
        });

        hideLoadingSpinner();
        Swal.fire({
            title: "Signup Successful!",
            text: "You can now login.",
            icon: "success",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        showLogin(); // Show login form
    } catch (error) {
        hideLoadingSpinner();
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
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    emailInput.style.border = "";
    passwordInput.style.border = "";

    if (!email || !password) {
        if (!email) {
            emailInput.style.border = "2px solid red";
        }

        if (!password) {
            passwordInput.style.border = "2px solid red";
        }

        Swal.fire({
            title: "Please fill all fields.",
            text: "Email and password are required.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });

        return;
    }

    showloginLoadingSpinner();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Print UID to console
        console.log("User UID:", user.uid);
        localStorage.setItem("uid", user.uid);

        hideLoadingSpinner();

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
        document.getElementById("loginEmail").style.border = "2px solid red";
        document.getElementById("loginPassword").style.border = "2px solid red";
        Swal.fire({
            title: "Login Error",
            text: "Please check your email and password.",
            icon: "error",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
    }
}

document.getElementById("loginEmail").addEventListener("input", function () {
    this.style.border = "";
});

document.getElementById("loginPassword").addEventListener("input", function () {
    this.style.border = "";
});

// ✅ Reset Password Function
window.resetPassword = async function () {
    const emailInput = document.getElementById("resetEmail");
    const email = emailInput.value.trim();
    const resetBtn = document.getElementById("resetBtn");

    emailInput.style.border = "";

    if (!email) {
        emailInput.style.border = "2px solid red";
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
        emailInput.style.border = "2px solid red";
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
            emailInput.style.border = "2px solid red";
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
            emailInput.style.border = "2px solid red";
            hideLoadingSpinner();
            Swal.fire({
                title: "Error Sending Email",
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

document.getElementById("resetEmail").addEventListener("input", function () {
    this.style.border = "";
});

function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const inputId = toggle.getAttribute('data-target');
            const passwordInput = document.getElementById(inputId);

            if (passwordInput) {
                const isVisible = passwordInput.type === 'text';
                passwordInput.type = isVisible ? 'password' : 'text';
                toggle.src = isVisible ? 'img_svg/show.png' : 'img_svg/hidden.png';
                toggle.alt = isVisible ? 'Show Password' : 'Hide Password';
            }
        });
    });
}
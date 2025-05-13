import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, writeBatch, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut, reauthenticateWithCredential,deleteUser, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBf4xDYf1i5UDAc9jpB33Cein_sgATriyw",
    authDomain: "techforecastinitial.firebaseapp.com",
    projectId: "techforecastinitial",
    storageBucket: "techforecastinitial.appspot.com", // fixed typo
    messagingSenderId: "1022311444244",
    appId: "1:1022311444244:web:ef464c4c03285bb351dc01",
    measurementId: "G-G421TQ07R4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let loggedInEmail = null;
let loggedFname = null;
let loggedLname = null;

document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname;
    if (path.includes("profile.html")) {
      const profilebtn = document.getElementById("profilebtn");
      if (profilebtn) {
        profilebtn.classList.add("active");
      }
    }

    const firstNameInput = document.getElementById("first-name");
    const middleNameInput = document.getElementById("middle-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email-address");
    const addressInput = document.getElementById("address");
    const shopNameInput = document.getElementById("shop-name");
    const phoneNumberInput = document.getElementById("phone-number");

    showLoadingSpinner();

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("No user detected. Redirecting to login...");
            window.location.href = "index.html";
            return;
        }

        emailInput.value = user.email || "";
        loggedInEmail = user.email || "";

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                firstNameInput.value = userData.firstName || "";
                middleNameInput.value = userData.middleName || "";
                lastNameInput.value = userData.lastName || "";
                addressInput.value = userData.address || "";
                shopNameInput.value = userData.shopName || "";
                phoneNumberInput.value = userData.phone || "";

                loggedFname = userData.firstName || "";
                loggedLname = userData.lastName || "";

                if (userData.gender) {
                  const genderRadio = document.querySelector(`input[name="gender"][value="${userData.gender}"]`);
                  if (genderRadio) genderRadio.checked = true;
                }
                
                const profileImgElement = document.getElementById("profile-img");

                if (profileImgElement) {
                    if (userData.profileImage) {
                        profileImgElement.src = userData.profileImage;
                    } else {
                        profileImgElement.src = "img_svg/default_profile.svg";
                    }
                } else {
                    console.warn("Profile image element not found");
                }

                const fullName = `${userData.firstName || ""} ${userData.middleName || ""} ${userData.lastName || ""}`.trim();
                document.querySelector(".profile-info h1").textContent = fullName || "Unnamed User";
                document.querySelector(".profile-info p").textContent = user.email || "No Email";
            } else {
                console.log("User document not found.");
            }
        } catch (error) {
            Swal.fire("Error", "Failed to load user data.", "error");
        } finally {
            hideLoadingSpinner();
        }
    });
});

// SweetAlert2 loading spinner
function showLoadingSpinner() {
    Swal.fire({
        title: "Loading...",
        text: "Please Wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

function hideLoadingSpinner() {
    Swal.close();
}

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
      await Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });      
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout error:", error);
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

async function checkNotificationStatus(userId) {
    try {
      const bellImage = document.querySelector('.notification-bell');
      bellImage.src = "img_svg/load.jpg";
  
      const notificationsRef = collection(db, "notifications", userId, "logs");
      const querySnapshot = await getDocs(notificationsRef);
  
      let isUnread = false;
  
      querySnapshot.forEach((doc) => {
        const notification = doc.data();
        if (notification.read === "no") {
          isUnread = true;
        }
      });
  
      bellImage.src = isUnread ? "img_svg/notificationwith.jpg" : "img_svg/notification.jpg";
    } catch (error) {
      console.error("Error checking notification status:", error);
      const bellImage = document.querySelector('.notification-bell');
      bellImage.src = "img_svg/notification.jpg";
    }
  }
  
  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      checkNotificationStatus(user.uid);
    }
  });
  
// Function to toggle the visibility of notifications when the bell is clicked
function toggleNotifications() {
  const notificationContainer = document.getElementById("notification-container");
  notificationContainer.style.display = (notificationContainer.style.display === "none" || notificationContainer.style.display === "") ? "block" : "none";
  
  // Fetch and display notifications if they are not already loaded
  if (notificationContainer.style.display === "block") {
      fetchNotifications();
  }
}

async function fetchNotifications() {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is signed in.");
    return;
  }

  const userId = user.uid;
  const notificationsRef = collection(db, "notifications", userId, "logs");
  const q = query(notificationsRef, orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);

    const notificationList = document.getElementById("notifications-list");
    notificationList.innerHTML = "";

    // 👉 Check if there are no notifications
    if (querySnapshot.empty) {
      notificationList.innerHTML = `<div class="notification empty">Empty notification</div>`;
      return;
    }

    // Display each notification
    querySnapshot.forEach(doc => {
      const notification = doc.data();
      const notificationElement = document.createElement("div");
      notificationElement.classList.add("notification");

      if (notification.read === "no") {
        notificationElement.classList.add("unread");
      } else {
        notificationElement.classList.add("read");
      }

      notificationElement.innerHTML = `
        <p>${notification.message}</p>
        <span class="timestamp">${new Date(notification.timestamp.seconds * 1000).toLocaleString()}</span>
      `;

      notificationList.appendChild(notificationElement);
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

window.toggleNotifications = function () {
  const notificationContainer = document.getElementById("notification-container");
  notificationContainer.style.display = (notificationContainer.style.display === "none" || notificationContainer.style.display === "") ? "block" : "none";
  
  // Fetch and display notifications if container is shown
  if (notificationContainer.style.display === "block") {
      fetchNotifications();
  }
};

async function deleteAllNotifications() {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const logsRef = collection(db, "notifications", userId, "logs");

  const snapshot = await getDocs(logsRef);
  const batch = writeBatch(db);

  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  document.getElementById("notifications-list").innerHTML = "";
  location.reload(); // Refresh the page to update bell image and UI
}

async function markAllAsRead() {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const logsRef = collection(db, "notifications", userId, "logs");

  const snapshot = await getDocs(logsRef);
  const batch = writeBatch(db);

  snapshot.forEach(doc => {
    batch.update(doc.ref, { read: "yes" });
  });

  await batch.commit();
  fetchNotifications(); // Optional: update UI
  location.reload();    // Refresh the page to update the bell image
}

window.markAllAsRead = markAllAsRead;
window.deleteAllNotifications = deleteAllNotifications;

window.showDeleteModal = function () {
  const modal = document.getElementById("deleteModal");
  if (modal) modal.style.display = "flex";
};

window.closeDeleteModal = function () {
  const modal = document.getElementById("deleteModal");
  if (modal) modal.style.display = "none";
};

window.cancelDelete = function() {
  const modal = document.getElementById("deleteModal");
  if (modal) modal.style.display = "none";
};

function markInvalid(input) {
    input.style.border = "2px solid red";
    input.addEventListener("input", () => {
        input.style.border = "";
    }, { once: true });
}

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
        markInvalid(emailInput);
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
        markInvalid(emailInput);
        return;
    }

    if (email !== loggedInEmail) {
        Swal.fire({
            title: "Incorrect Email!",
            text: "Please input the correct email address.",
            icon: "error",
            timer: 3000,
            showConfirmButton: false
        });
        markInvalid(emailInput);
        sendOtpBtn.disabled = false;
        return;
    }

    sendOtpBtn.disabled = true;
    showLoadingSpinner();

    try {
        const response = await fetch("http://127.0.0.1:5000/send-otp2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        hideLoadingSpinner();

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
      console.log(error);
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
    const otpInput = document.getElementById("otpCode");
    const enteredOtp = otpInput.value.trim();
    const otpStatus = document.getElementById("otpStatus");
    const verifyEmailBtn = document.getElementById("verifyOtpBtn");

    if (!enteredOtp) {
        Swal.fire({
            title: "Please enter the OTP.",
            text: "No OTP provided.",
            icon: "warning",
            timer: 3000, // Auto-close after 3 seconds
            showConfirmButton: false
        });
        markInvalid(otpInput);
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
            markInvalid(otpInput);
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

async function deleteUserData(uid) {
  const db = getFirestore();
  const userRef = doc(db, "users", uid);

  // Optional: delete subcollections if any (customize as needed)
  const subcollections = ["notifications", "logs"]; // Change based on your structure
  for (const sub of subcollections) {
    const subSnap = await getDocs(collection(db, `users/${uid}/${sub}`));
    for (const docSnap of subSnap.docs) {
      await deleteDoc(doc(db, `users/${uid}/${sub}/${docSnap.id}`));
    }
  }

  // Delete main user doc
  await deleteDoc(userRef);
}

window.confirmDeleteAccount = async function () {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        Swal.fire("Error", "No user is currently signed in.", "error");
        return;
    }

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const otpStatus = document.getElementById("otpStatus");

    if (!email) {
        Swal.fire({
            title: "Missing Information",
            text: "Please fill in your Email to proceed.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        markInvalid(emailInput);
        return;
    }

    if (otpStatus.innerText !== "✅ OTP Verified! You can now sign up.") {
        Swal.fire({
            title: "Email Not Verified",
            text: "Please verify your email first before proceeding.",
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        });
        return;
    }

    if (email !== loggedInEmail) {
        Swal.fire({
            title: "Incorrect Email!",
            text: "Please input the correct information.",
            icon: "error",
            timer: 3000,
            showConfirmButton: false
        });
        markInvalid(emailInput);
        return;
    }

    // This modal interaction will trigger after OTP verification
    const { value: password } = await Swal.fire({
        title: "Re-enter Password",
        input: "password",
        inputLabel: "Please confirm your password to delete your account",
        inputPlaceholder: "Enter your password",
        inputAttributes: {
            maxlength: 100,
            autocapitalize: "off",
            autocorrect: "off"
        },
        showCancelButton: true
    });

    if (!password) {
        Swal.fire({
            title: "Cancelled",
            text: "Password confirmation was cancelled.",
            icon: "info",
            timer: 3000,
            showConfirmButton: false
        });
        return;
    }

    try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        showdeletingspinner();

        // Delete Firestore data
        await deleteUserData(user.uid);

        // Delete from Firebase Authentication
        await deleteUser(user);

        hideLoadingSpinner();
        Swal.fire({
          title: "Deleted!",
          text: "Your account has been deleted.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          willClose: () => {
            window.location.href = "index.html"; // Redirect after 3 seconds
          }
        });
    } catch (error) {
        console.error("Account deletion error:", error);

        if (error.code === "auth/invalid-credentials") {
            Swal.fire({
                title: "Incorrect Password",
                text: "The password you entered is incorrect.",
                icon: "error",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "profile.html";
            });
        } else {
          Swal.fire({
              title: "Error",
              text: "Please try again.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
              willClose: () => {
                  window.location.href = "profile.html";
              }
          });
        }
    }
  
};

function showdeletingspinner() {
    Swal.fire({
        title: "Deleting...",
        text: "Please Wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}
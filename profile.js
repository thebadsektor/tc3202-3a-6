import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, writeBatch, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
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
            console.error("Error getting user document:", error);
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

  try {
    const querySnapshot = await getDocs(notificationsRef);

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
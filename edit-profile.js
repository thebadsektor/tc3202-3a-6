import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, writeBatch, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const imageInput = document.getElementById("imageUpload");
const profileImg = document.getElementById("profile-img");

document.addEventListener("DOMContentLoaded", () => {
    const firstNameInput = document.getElementById("firstName");
    const middleNameInput = document.getElementById("middleName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");
    const shopNameInput = document.getElementById("shopName");
    const phoneNumberInput = document.getElementById("phone-number");
    const saveButton = document.getElementById("saveButton");
    const editProfileForm = document.getElementById("editProfileForm");
    const imageInput = document.getElementById("imageUpload");
    const profileImg = document.getElementById("profile-img");

    let originalData = {}; // Store original data for comparison
    let selectedProfileImageFile = null;

    // ✅ Check if user is logged in
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            showLoadingSpinner();

            emailInput.value = user.email; // Set email (non-editable)
            const userDocRef = doc(db, "users", user.uid);

            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    originalData = userDoc.data(); // Store original data
                    firstNameInput.value = originalData.firstName || "";
                    middleNameInput.value = originalData.middleName || "";
                    lastNameInput.value = originalData.lastName || "";
                    addressInput.value = originalData.address || "";
                    shopNameInput.value = originalData.shopName || "";
                    phoneNumberInput.value = originalData.phone || "";

                    if (originalData.gender) {
                        const genderRadio = document.querySelector(`input[name="gender"][value="${originalData.gender}"]`);
                        if (genderRadio) genderRadio.checked = true;
                    }
                      
                    if (profileImg) {
                        profileImg.src = originalData.profileImage || "img_svg/default_profile.svg";
                    }

                    saveButton.disabled = false; // Disable save button initially
                } else {
                    console.log("No user data found.");
                }
            } catch (error) {
                console.error("🔥 Error fetching user data:", error);
            } finally {
                hideLoadingSpinner(); // ✅ Hide spinner after fetching data
            }
        } else {
            console.log("🔴 No user detected. Redirecting to login...");
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    });

    /// ✅ Function to check if actual changes are made
    function checkForChanges() {
        const genderRadio = document.querySelector('input[name="gender"]:checked');
    
        const currentData = {
            firstName: firstNameInput.value.trim(),
            middleName: middleNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            address: addressInput.value.trim(),
            shopName: shopNameInput.value.trim(),
            phone: phoneNumberInput.value.trim(),
            gender: genderRadio ? genderRadio.value : "",
        };
    
        // Compare if current form state is different from originalData
        const hasChanges = JSON.stringify(currentData) !== JSON.stringify(originalData);
    
        saveButton.disabled = !hasChanges; // Enable button only if actual changes exist
    }    

    // ✅ Listen for input changes dynamically
    editProfileForm.addEventListener("input", checkForChanges);

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            selectedProfileImageFile = file;

            const reader = new FileReader();
            reader.onload = (event) => {
                profileImg.src = event.target.result; // Preview the new image
            };
            reader.readAsDataURL(file);
            checkForChanges(); // Enable save button if something changed
        } else {
            Swal.fire("Invalid File", "Please select a valid image file.", "warning");
        }
    });

    // ✅ Save changes to Firestore
    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        saveButton.disabled = false;
        const user = auth.currentUser;

        if (!user) {
            console.log("❌ No user detected.");
            return;
        }

        // ✅ Trim inputs to remove accidental spaces
        const firstName = firstNameInput.value.trim();
        const middleName = middleNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const address = addressInput.value.trim();
        const shopName = shopNameInput.value.trim();
        const phone = phoneNumberInput.value.trim();
        const genderRadio = document.querySelector('input[name="gender"]:checked');
        const gender = genderRadio ? genderRadio.value : "";

        // ✅ Check for empty fields (excluding optional middle name)
        if (!firstName || !lastName || !shopName || !address || !phone || !gender) {
            Swal.fire({
                title: "Missing Fields",
                text: "Please fill in all required fields.",
                icon: "warning",
                timer: 3000, 
                showConfirmButton: false
            });
            return;
        }

        const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/; // Only letters, one space allowed
        const shopRegex = /^[a-zA-Z0-9\s]{4,}$/; // Min 4 characters, letters & numbers

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
        if (phone.length !== 11 || !phone.startsWith("09")) {
            Swal.fire({ title: "Invalid Phone", text: "Enter a valid 11-digit phone number.", icon: "warning", timer: 3000, showConfirmButton: false }); return;
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

        const hasChanges =
            firstNameInput.value !== (originalData.firstName || "") ||
            middleNameInput.value !== (originalData.middleName || "") ||
            lastNameInput.value !== (originalData.lastName || "") ||
            addressInput.value !== (originalData.address || "") ||
            shopNameInput.value !== (originalData.shopName || "") ||
            phone !== (originalData.phone || "") ||
            gender !== (originalData.gender || "") ||
            profileImg.src !== (originalData.profileImage || "");

        if (!hasChanges) {
            Swal.fire({
                title: "No Changes Detected",
                text: "You haven't made any changes. Please modify fields before saving.",
                icon: "warning",
                timer: 3000,
                showConfirmButton: false
            });
            return;
        }

        savingLoadingSpinner();

        const userDocRef = doc(db, "users", user.uid);
        try {

            let profileImageUrl = originalData.profileImage; // Keep the old image if no new image is selected
            if (selectedProfileImageFile) {
                const storage = getStorage();
                const imageRef = storageRef(storage, `profileImages/${user.uid}`);

                try {
                    const snapshot = await uploadBytes(imageRef, selectedProfileImageFile);
                    profileImageUrl = await getDownloadURL(snapshot.ref); // Get the new image URL
                } catch (error) {
                    console.error("🔥 Error uploading image:", error);
                    Swal.fire({
                        title: "Image Upload Error",
                        text: "There was an error uploading the profile image.",
                        icon: "error",
                        timer: 3000, 
                        showConfirmButton: false
                    });
                    return;
                }
            }

            await updateDoc(userDocRef, {
                firstName: firstNameInput.value,
                middleName: middleNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                shopName: shopNameInput.value,
                phone : phoneNumberInput.value,
                gender: gender,
                profileImage: profileImageUrl
            });

            hideLoadingSpinner();

            Swal.fire({
                title: "✅ Success!",
                text: "Profile updated successfully!",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                // Redirect to home.html after the user clicks OK
                window.location.replace("home.html");
            });
            
            originalData = { // Update local data to match saved values
                firstName: firstNameInput.value,
                middleName: middleNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                shopName: shopNameInput.value,
                phone: phoneNumberInput.value,
                gender: gender,
                profileImage: profileImageUrl
            };
        } catch (error) {
            console.error("🔥 Error updating profile:", error);
        }
    });
});

const phoneInput = document.getElementById("phone-number");
phoneInput.addEventListener("input", function (e) {
    // Remove any non-numeric character immediately
    this.value = this.value.replace(/[^0-9]/g, '');
});

// ✅ Show Loading Spinner
function showLoadingSpinner() {
    Swal.fire({
        title: "Loading data...",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

function savingLoadingSpinner() {
    Swal.fire({
        title: "Saving changes...",
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

// Logout handler
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
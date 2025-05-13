document.addEventListener("DOMContentLoaded", function () {

  const path = window.location.pathname;
  if (path.includes("contact.html")) {
    const contactbtn = document.getElementById("contactbtn");
    if (contactbtn) {
      contactbtn.classList.add("active");
    }
  }

});

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Common SweetAlert options
  const swalOptions = {
    toast: true,
    position: 'top', // This centers it at the top
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
    background: '#1e2133',
    color: '#fff',
    customClass: {
      popup: 'swal2-toast-custom'
    }
  };


  if (name === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Name is required!' });
    markInvalid(document.getElementById("name"));
    return;
  }

  if (email === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Email is required!' });
    markInvalid(document.getElementById("email"));
    return;
  }

  if (!emailRegex.test(email)) {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Invalid email format!' });
    markInvalid(document.getElementById("email"));
    return;
  }

  if (subject === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Subject is required!' });
    markInvalid(document.getElementById("subject"));
    return;
  }

  if (message === "") {
    Swal.fire({ ...swalOptions, icon: 'error', title: 'Message cannot be empty!' });
    markInvalid(document.getElementById("message"));
    return;
  }

  // All fields valid
  Swal.fire({
    ...swalOptions,
    icon: 'success',
    title: 'Message sent!'
  }).then(() => {
  // Redirect after the toast disappears
  window.location.href = 'home.html';
});

  // Optional: reset form
  
});

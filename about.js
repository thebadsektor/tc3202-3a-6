document.addEventListener("DOMContentLoaded", function () {

  const path = window.location.pathname;
  if (path.includes("about.html")) {
    const aboutbtn = document.getElementById("about-btn");
    if (aboutbtn) {
      aboutbtn.classList.add("active");
    }
  }

});

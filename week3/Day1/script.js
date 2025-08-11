function toggleMenu() {
  document.getElementById("mobile-menu").classList.toggle("hidden");
  if (document.getElementById("cross").classList.contains("hidden")) {
    showCross();
  } else {
    showHam();
  }
}
function showHam() {
  document.getElementById("mobile-menu").classList.add("hidden");
  document.getElementById("ham").classList.remove("hidden");
  document.getElementById("cross").classList.add("hidden");
}
function showCross() {
  document.getElementById("mobile-menu").classList.remove("hidden");
  document.getElementById("ham").classList.add("hidden");
  document.getElementById("cross").classList.remove("hidden");
}
function toggleSubmenu(id, button) {
  const submenu = document.getElementById(id);
  const isOpen = submenu.classList.contains("hidden");

  // Hide all other submenus
  document.querySelectorAll("#mobile-menu ul[id]").forEach((ul) => {
    if (ul.id !== id) {
      ul.classList.add("hidden");
      ul.previousElementSibling
        ?.querySelector("svg")
        ?.classList.remove("rotate-180");
    }
  });

  // Toggle the clicked submenu
  submenu.classList.toggle("hidden", !isOpen);

  // Rotate the arrow icon
  const icon = button.querySelector("svg");
  if (isOpen) {
    icon.classList.add("rotate-180");
  } else {
    icon.classList.remove("rotate-180");
  }
}
function toggleMobileDropdown(menu, arrow) {
  menu.classList.toggle("hidden");
  arrow.classList.toggle("rotate-180");
}

// Our Services
const mobileServicesToggle = document.getElementById("mobile-services-toggle");
const mobileServicesMenu = document.getElementById("mobile-services-menu");
const mobileServicesArrow = document.getElementById("mobile-services-arrow");

mobileServicesToggle.addEventListener("click", () => {
  toggleMobileDropdown(mobileServicesMenu, mobileServicesArrow);
});

// Feature
const featureToggle = document.getElementById("feature_toggle");
const featureMenu = document.getElementById("feature_menu");
const featureArrow = document.getElementById("feature_arrow"); // <-- Make sure your HTML arrow has this ID

featureToggle.addEventListener("click", () => {
  toggleMobileDropdown(featureMenu, featureArrow);
});

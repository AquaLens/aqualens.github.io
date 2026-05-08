// Get the current page path
const currentPath = window.location.pathname.replace(/\/$/, '');

// Find all navigation links in the header
const navLinks = document.querySelectorAll('.nav-links a');

// Loop through each navigation link to check if it matches current page
navLinks.forEach(link => {
    // Extract the path from each link's href
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');

    // If the link path matches the current page path add active class
    if (linkPath === currentPath) {
        link.classList.add('active');
    }
});

// Hamburger menu toggle
(function() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('header nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
    }
  });

  // Dropdown toggle on mobile (tap instead of hover)
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('a');
    if (!toggle) return;
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  });
})();

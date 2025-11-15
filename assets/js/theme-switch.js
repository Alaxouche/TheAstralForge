// Theme switching logic - initialized via footer injection
// This script is kept for potential future enhancements
// The actual theme toggle functionality is handled in footer_custom.html
// to ensure the button exists before attaching event listeners

(function() {
  // Apply saved theme preference on page load
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    document.documentElement.classList.remove('dark-mode');
  } else {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.classList.remove('light-mode');
  }
  
  document.documentElement.setAttribute('data-theme', savedTheme);
})();


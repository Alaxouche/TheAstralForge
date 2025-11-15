window.addEventListener("DOMContentLoaded", function() {
    const toggleDarkMode = document.getElementById("theme-toggle");
    const themeStyle = document.getElementById("theme-style");
  
    // Initialiser le thème au chargement
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  
    // Ajouter l'écouteur de clic
    if (toggleDarkMode) {
      toggleDarkMode.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
      });
    }
  
    function getTheme() {
      return document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
    }
  
    function setTheme(theme) {
      // Mettre à jour les classes CSS
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        if (themeStyle) {
          themeStyle.href = '{{ "/assets/css/just-the-docs-dark.css" | relative_url }}';
        }
        // Mettre à jour l'icône du bouton
        if (toggleDarkMode) {
          toggleDarkMode.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
          toggleDarkMode.setAttribute('aria-label', 'Light mode');
        }
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
        if (themeStyle) {
          themeStyle.href = '{{ "/assets/css/just-the-docs-light.css" | relative_url }}';
        }
        // Mettre à jour l'icône du bouton
        if (toggleDarkMode) {
          toggleDarkMode.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
          toggleDarkMode.setAttribute('aria-label', 'Dark mode');
        }
      }
    }
  });

window.addEventListener("DOMContentLoaded", function() {
    const toggleDarkMode = document.getElementById("theme-toggle");
    const themeStyle = document.getElementById("theme-style");
  
    // Initialiser le thème au chargement
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
  
    // Ajouter l'écouteur de clic
    if (toggleDarkMode) {
      toggleDarkMode.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
        // Ajouter une classe pour la transition
        document.documentElement.classList.add('theme-transition');
        
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        
        // Retirer la classe de transition après 300ms
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 300);
      });
    }
  
    function getTheme() {
      return document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
    }
  
    function applyTheme(theme) {
      // Mettre à jour les classes CSS
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        if (themeStyle) {
          themeStyle.href = '{{ "/assets/css/just-the-docs-dark.css" | relative_url }}';
        }
        // Mettre à jour l'attribut aria-label
        if (toggleDarkMode) {
          toggleDarkMode.setAttribute('aria-label', 'Switch to light mode');
        }
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
        if (themeStyle) {
          themeStyle.href = '{{ "/assets/css/just-the-docs-light.css" | relative_url }}';
        }
        // Mettre à jour l'attribut aria-label
        if (toggleDarkMode) {
          toggleDarkMode.setAttribute('aria-label', 'Switch to dark mode');
        }
      }
      
      // Mettre à jour le data-attribute pour CSS
      document.documentElement.setAttribute('data-theme', theme);
    }
  });


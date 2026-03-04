(() => {
  const storageKey = "sg-theme";
  const root = document.documentElement;
  const button = document.querySelector(".theme-toggle");

  if (!button) {
    return;
  }

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    button.dataset.theme = theme;

    const label = button.querySelector(".theme-toggle-label");
    if (label) {
      label.textContent = theme === "light" ? "Light" : "Dark";
    }
  };

  applyTheme(getPreferredTheme());

  button.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    mediaQuery.addEventListener("change", (event) => {
      if (localStorage.getItem(storageKey)) {
        return;
      }

      applyTheme(event.matches ? "light" : "dark");
    });
  }
})();

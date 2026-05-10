// Ethical Cookie Consent & Dark Patterns Prevention
class EthicalConsent {
  constructor() {
    this.storageKey = 'user-consent';
    this.consent = this.loadConsent();
    this.init();
  }

  init() {
    // Show consent banner only if not already answered
    if (!this.consent.answered) {
      this.showConsentBanner();
    }

    // Apply user preferences
    this.applyConsent();
  }

  loadConsent() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : {
      answered: false,
      analytics: false,
      functional: true, // Essential cookies always enabled
      preferences: false,
      timestamp: null
    };
  }

  saveConsent() {
    this.consent.timestamp = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(this.consent));
  }

  showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.innerHTML = `
      <div class="consent-content">
        <div class="consent-header">
          <h3>We Respect Your Privacy</h3>
          <svg class="consent-icon" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>

        <p class="consent-description">
          We use <strong>privacy-first analytics</strong> to improve your experience. 
          No personal data is collected, no third-party trackers, and no ads. Ever.
        </p>

        <div class="consent-details">
          <details class="consent-accordion">
            <summary>View Cookie Details</summary>
            <div class="consent-options">
              <label class="consent-option">
                <input type="checkbox" checked disabled>
                <div class="option-content">
                  <strong>Essential Cookies</strong>
                  <span>Required for site functionality (always enabled)</span>
                </div>
              </label>

              <label class="consent-option">
                <input type="checkbox" id="consent-analytics" ${this.consent.analytics ? 'checked' : ''}>
                <div class="option-content">
                  <strong>Analytics Cookies</strong>
                  <span>Anonymous usage statistics to improve the site (no personal data)</span>
                </div>
              </label>

              <label class="consent-option">
                <input type="checkbox" id="consent-preferences" ${this.consent.preferences ? 'checked' : ''}>
                <div class="option-content">
                  <strong>Preference Cookies</strong>
                  <span>Remember your settings (theme, language, etc.)</span>
                </div>
              </label>
            </div>
          </details>
        </div>

        <div class="consent-actions">
          <button class="btn-consent-reject" onclick="window.EthicalConsent.rejectAll()">
            Reject All
          </button>
          <button class="btn-consent-accept" onclick="window.EthicalConsent.acceptSelected()">
            Accept Selected
          </button>
          <button class="btn-consent-all" onclick="window.EthicalConsent.acceptAll()">
            Accept All
          </button>
        </div>

        <div class="consent-footer">
          <a href="/privacy-policy" class="consent-link">Privacy Policy</a>
          <span>•</span>
          <a href="#" onclick="window.EthicalConsent.showConsentBanner(); return false;" class="consent-link">
            Manage Preferences
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    setTimeout(() => banner.classList.add('consent-visible'), 100);
  }

  hideConsentBanner() {
    const banner = document.querySelector('.consent-banner');
    if (banner) {
      banner.classList.remove('consent-visible');
      setTimeout(() => banner.remove(), 300);
    }
  }

  acceptAll() {
    this.consent.answered = true;
    this.consent.analytics = true;
    this.consent.preferences = true;
    this.saveConsent();
    this.applyConsent();
    this.hideConsentBanner();
    this.showToast('All cookies accepted', 'success');
  }

  rejectAll() {
    this.consent.answered = true;
    this.consent.analytics = false;
    this.consent.preferences = false;
    this.saveConsent();
    this.applyConsent();
    this.hideConsentBanner();
    this.showToast('Only essential cookies will be used', 'info');
  }

  acceptSelected() {
    this.consent.answered = true;
    this.consent.analytics = document.getElementById('consent-analytics')?.checked || false;
    this.consent.preferences = document.getElementById('consent-preferences')?.checked || false;
    this.saveConsent();
    this.applyConsent();
    this.hideConsentBanner();
    this.showToast('Preferences saved', 'success');
  }

  applyConsent() {
    // Enable/disable analytics based on consent
    if (this.consent.analytics && window.PrivateAnalytics) {
      window.PrivateAnalytics.enable();
    } else if (window.PrivateAnalytics) {
      window.PrivateAnalytics.disable();
    }

    // Apply preference cookies
    if (!this.consent.preferences) {
      // Clear non-essential preference data
      const keysToKeep = [this.storageKey, 'user-consent'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key) && !key.startsWith('essential-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Anti-Dark Patterns: Clear opt-out button
  revokeConsent() {
    this.consent = {
      answered: true,
      analytics: false,
      functional: true,
      preferences: false,
      timestamp: new Date().toISOString()
    };
    this.saveConsent();
    this.applyConsent();
    this.showToast('All non-essential cookies removed', 'success');
  }

  // Export user data (GDPR compliance)
  exportUserData() {
    const data = {
      consent: this.consent,
      localStorage: { ...localStorage },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Your data has been downloaded', 'success');
  }

  // Delete all user data
  deleteAllData() {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      this.showToast('All data deleted', 'success');
      setTimeout(() => location.reload(), 1500);
    }
  }

  showToast(message, type = 'info') {
    if (window.ToastSystem) {
      window.ToastSystem.show(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.EthicalConsent = new EthicalConsent();
  });
}

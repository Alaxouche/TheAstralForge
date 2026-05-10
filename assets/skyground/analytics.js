// Privacy-First Analytics Dashboard (No External Tracking)
class PrivateAnalytics {
  constructor() {
    this.storageKey = 'site-analytics';
    this.sessionKey = 'session-analytics';
    this.enabled = false;
    this.data = this.loadData();
    this.session = this.initSession();
    this.init();
  }

  init() {
    // Check if user consented to analytics
    const consent = JSON.parse(localStorage.getItem('user-consent') || '{}');
    if (consent.analytics) {
      this.enable();
    }
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;

    // Track page views
    this.trackPageView();

    // Track interactions
    this.setupEventTracking();

    // Track performance metrics
    this.trackPerformance();

    // Auto-save every 30 seconds
    setInterval(() => this.saveData(), 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => this.saveData());
  }

  disable() {
    this.enabled = false;
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : {
      pageViews: {},
      interactions: {},
      performance: [],
      sessions: [],
      firstVisit: new Date().toISOString()
    };
  }

  saveData() {
    if (!this.enabled) return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    sessionStorage.setItem(this.sessionKey, JSON.stringify(this.session));
  }

  initSession() {
    const saved = sessionStorage.getItem(this.sessionKey);
    if (saved) return JSON.parse(saved);

    return {
      id: this.generateSessionId(),
      startTime: new Date().toISOString(),
      pageViews: 0,
      interactions: 0,
      duration: 0
    };
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track Page Views
  trackPageView() {
    if (!this.enabled) return;

    const page = window.location.pathname;
    
    if (!this.data.pageViews[page]) {
      this.data.pageViews[page] = {
        count: 0,
        firstView: new Date().toISOString(),
        lastView: null,
        avgTimeOnPage: 0,
        totalTime: 0
      };
    }

    this.data.pageViews[page].count++;
    this.data.pageViews[page].lastView = new Date().toISOString();
    this.session.pageViews++;

    // Track time on previous page
    if (this.currentPageStartTime) {
      const timeSpent = Date.now() - this.currentPageStartTime;
      const prevPage = this.previousPage;
      if (prevPage && this.data.pageViews[prevPage]) {
        this.data.pageViews[prevPage].totalTime += timeSpent;
        this.data.pageViews[prevPage].avgTimeOnPage = 
          this.data.pageViews[prevPage].totalTime / this.data.pageViews[prevPage].count;
      }
    }

    this.previousPage = page;
    this.currentPageStartTime = Date.now();
    this.saveData();
  }

  // Track Interactions (Buttons, Links, etc.)
  setupEventTracking() {
    if (!this.enabled) return;

    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, .btn-primary, .btn-secondary');
      if (!target) return;

      const label = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown';
      this.trackEvent('click', label, target.tagName.toLowerCase());
    });

    // Track downloads
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[download], a[href$=".zip"], a[href$=".exe"]');
      if (!link) return;

      this.trackEvent('download', link.href, 'file');
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const formName = form.id || form.name || 'unnamed-form';
      this.trackEvent('form-submit', formName, 'form');
    });

    // Track search usage
    document.querySelectorAll('input[type="search"]').forEach(input => {
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
          this.trackEvent('search', 'query-submitted', 'search');
        }
      });
    });
  }

  trackEvent(category, action, label = '') {
    if (!this.enabled) return;

    const eventKey = `${category}:${action}`;
    
    if (!this.data.interactions[eventKey]) {
      this.data.interactions[eventKey] = {
        count: 0,
        label: label,
        firstInteraction: new Date().toISOString(),
        lastInteraction: null
      };
    }

    this.data.interactions[eventKey].count++;
    this.data.interactions[eventKey].lastInteraction = new Date().toISOString();
    this.session.interactions++;
    
    this.saveData();
  }

  // Track Performance Metrics
  trackPerformance() {
    if (!this.enabled) return;

    // Wait for page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        if (!perf) return;

        this.data.performance.push({
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          metrics: {
            dns: Math.round(perf.domainLookupEnd - perf.domainLookupStart),
            connection: Math.round(perf.connectEnd - perf.connectStart),
            request: Math.round(perf.responseEnd - perf.requestStart),
            domLoad: Math.round(perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart),
            pageLoad: Math.round(perf.loadEventEnd - perf.loadEventStart),
            total: Math.round(perf.loadEventEnd - perf.fetchStart)
          }
        });

        // Keep only last 50 performance entries
        if (this.data.performance.length > 50) {
          this.data.performance = this.data.performance.slice(-50);
        }

        this.saveData();
      }, 0);
    });
  }

  // Get Analytics Summary
  getSummary() {
    const totalPageViews = Object.values(this.data.pageViews)
      .reduce((sum, page) => sum + page.count, 0);
    
    const totalInteractions = Object.values(this.data.interactions)
      .reduce((sum, event) => sum + event.count, 0);

    const avgPerformance = this.data.performance.length > 0
      ? this.data.performance.reduce((sum, p) => sum + p.metrics.total, 0) / this.data.performance.length
      : 0;

    const topPages = Object.entries(this.data.pageViews)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);

    const topInteractions = Object.entries(this.data.interactions)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPageViews,
      totalInteractions,
      avgPerformance: Math.round(avgPerformance),
      uniquePages: Object.keys(this.data.pageViews).length,
      topPages,
      topInteractions,
      firstVisit: this.data.firstVisit,
      currentSession: this.session
    };
  }

  // Render Dashboard
  renderDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const summary = this.getSummary();

    container.innerHTML = `
      <div class="analytics-dashboard">
        <div class="dashboard-header">
          <h2>Your Analytics Dashboard</h2>
          <p>All data is stored locally on your device. No external tracking.</p>
        </div>

        <div class="analytics-stats">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">${summary.totalPageViews}</div>
            <div class="stat-label">Page Views</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🖱️</div>
            <div class="stat-value">${summary.totalInteractions}</div>
            <div class="stat-label">Interactions</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📄</div>
            <div class="stat-value">${summary.uniquePages}</div>
            <div class="stat-label">Unique Pages</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">${summary.avgPerformance}ms</div>
            <div class="stat-label">Avg Load Time</div>
          </div>
        </div>

        <div class="analytics-charts">
          <div class="chart-card">
            <h3>Top Pages</h3>
            <div class="chart-list">
              ${summary.topPages.map(([page, data]) => `
                <div class="chart-item">
                  <span class="chart-label">${page}</span>
                  <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(data.count / summary.totalPageViews) * 100}%"></div>
                  </div>
                  <span class="chart-value">${data.count}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="chart-card">
            <h3>Top Interactions</h3>
            <div class="chart-list">
              ${summary.topInteractions.map(([key, data]) => `
                <div class="chart-item">
                  <span class="chart-label">${data.label}</span>
                  <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${(data.count / summary.totalInteractions) * 100}%"></div>
                  </div>
                  <span class="chart-value">${data.count}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="analytics-actions">
          <button class="btn-secondary" onclick="window.PrivateAnalytics.exportData()">
            Export Data
          </button>
          <button class="btn-secondary" onclick="window.PrivateAnalytics.clearData()">
            Clear Analytics
          </button>
        </div>
      </div>
    `;
  }

  // Export Data
  exportData() {
    const summary = this.getSummary();
    const exportData = {
      summary,
      fullData: this.data,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Clear Data
  clearData() {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      this.data = {
        pageViews: {},
        interactions: {},
        performance: [],
        sessions: [],
        firstVisit: new Date().toISOString()
      };
      this.saveData();
      alert('Analytics data cleared');
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.PrivateAnalytics = new PrivateAnalytics();
  });
}

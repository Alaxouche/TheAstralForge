// Installation Time Estimator for Wabbajack Modlists
class InstallEstimator {
  constructor() {
    this.modlistSizes = {
      'wunduniik': { download: 180, install: 300, time: 120 },
      'ghost-of-the-grid': { download: 150, install: 280, time: 110 },
      'krentoraan': { download: 120, install: 200, time: 90 },
      'no-mans-sky-explorer': { download: 100, install: 180, time: 80 }
    };
    this.init();
  }

  init() {
    const estimatorContainers = document.querySelectorAll('[data-install-estimator]');
    estimatorContainers.forEach(container => {
      const modlistId = container.dataset.installEstimator;
      this.renderEstimator(container, modlistId);
    });
  }

  calculateTime(downloadSize, connectionSpeed = 50) {
    // downloadSize in GB, connectionSpeed in Mbps
    const downloadTimeMins = (downloadSize * 8 * 1024) / (connectionSpeed * 60);
    const installTimeMins = downloadSize * 0.4; // Rough estimate: 0.4 min per GB
    return {
      download: Math.round(downloadTimeMins),
      install: Math.round(installTimeMins),
      total: Math.round(downloadTimeMins + installTimeMins)
    };
  }

  formatTime(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  renderEstimator(container, modlistId) {
    const data = this.modlistSizes[modlistId];
    if (!data) return;

    const connectionSpeeds = [
      { label: 'Slow (25 Mbps)', value: 25 },
      { label: 'Average (50 Mbps)', value: 50 },
      { label: 'Fast (100 Mbps)', value: 100 },
      { label: 'Very Fast (200 Mbps)', value: 200 }
    ];

    let selectedSpeed = 50;
    const updateEstimate = () => {
      const time = this.calculateTime(data.download, selectedSpeed);
      
      container.innerHTML = `
        <div class="install-estimator">
          <div class="estimator-header">
            <svg class="estimator-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <h3>Installation Time Estimate</h3>
          </div>
          
          <div class="estimator-stats">
            <div class="stat-item">
              <span class="stat-label">Download Size</span>
              <span class="stat-value">${data.download} GB</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Install Size</span>
              <span class="stat-value">${data.install} GB</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Space</span>
              <span class="stat-value">${data.download + data.install} GB</span>
            </div>
          </div>

          <div class="speed-selector">
            <label for="connection-speed-${modlistId}">Your Connection Speed:</label>
            <select id="connection-speed-${modlistId}" class="speed-select">
              ${connectionSpeeds.map(s => 
                `<option value="${s.value}" ${s.value === selectedSpeed ? 'selected' : ''}>${s.label}</option>`
              ).join('')}
            </select>
          </div>

          <div class="time-breakdown">
            <div class="time-item">
              <div class="time-icon download-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div class="time-content">
                <span class="time-label">Download Time</span>
                <span class="time-value">${this.formatTime(time.download)}</span>
              </div>
            </div>
            
            <div class="time-item">
              <div class="time-icon install-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div class="time-content">
                <span class="time-label">Installation Time</span>
                <span class="time-value">${this.formatTime(time.install)}</span>
              </div>
            </div>
          </div>

          <div class="total-time">
            <span class="total-label">Total Estimated Time:</span>
            <span class="total-value">${this.formatTime(time.total)}</span>
          </div>

          <div class="estimator-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>Times are estimates. Actual duration may vary based on your hardware and connection.</p>
          </div>
        </div>
      `;

      // Add event listener to speed selector
      const select = container.querySelector(`#connection-speed-${modlistId}`);
      if (select) {
        select.addEventListener('change', (e) => {
          selectedSpeed = parseInt(e.target.value);
          updateEstimate();
        });
      }
    };

    updateEstimate();
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.InstallEstimator = new InstallEstimator();
  });
}

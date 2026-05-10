// Interactive Installation Wizard with Progress Tracking
class InstallWizard {
  constructor(containerId, modlistId) {
    this.container = document.getElementById(containerId);
    this.modlistId = modlistId;
    this.currentStep = 0;
    this.storageKey = `install-wizard-${modlistId}`;
    
    this.steps = [
      {
        id: 'prerequisites',
        title: 'Prerequisites Check',
        icon: `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        tasks: [
          { id: 'disk-space', text: 'Verify sufficient disk space (500GB+ free)', required: true },
          { id: 'skyrim-clean', text: 'Clean Skyrim SE installation (1.6.1170+)', required: true },
          { id: 'dlc-all', text: 'All Skyrim DLCs installed', required: true },
          { id: 'antivirus', text: 'Antivirus exclusions configured', required: true },
          { id: 'wabbajack', text: 'Latest Wabbajack installed', required: true }
        ]
      },
      {
        id: 'exclusions',
        title: 'Folder Exclusions',
        icon: `<path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>`,
        tasks: [
          { id: 'exclude-wabbajack', text: 'Add Wabbajack folder to Windows Defender exclusions', required: true },
          { id: 'exclude-modlist', text: 'Add modlist output folder to exclusions', required: true },
          { id: 'exclude-downloads', text: 'Add downloads folder to exclusions', required: true }
        ]
      },
      {
        id: 'wabbajack-install',
        title: 'Wabbajack Installation',
        icon: `<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>`,
        tasks: [
          { id: 'open-wabbajack', text: 'Launch Wabbajack application', required: true },
          { id: 'browse-modlists', text: 'Browse modlists or load from file', required: true },
          { id: 'select-folders', text: 'Select installation and downloads folders', required: true },
          { id: 'start-install', text: 'Click "Begin" to start installation', required: true },
          { id: 'wait-complete', text: 'Wait for installation to complete (~2-4 hours)', required: true }
        ]
      },
      {
        id: 'post-install',
        title: 'Post-Installation',
        icon: `<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`,
        tasks: [
          { id: 'read-readme', text: 'Read the complete README documentation', required: true },
          { id: 'game-folder-options', text: 'Review Game Folder Files (optional configurations)', required: false },
          { id: 'mcm-settings', text: 'Configure MCM settings as recommended', required: false },
          { id: 'test-launch', text: 'Launch game via ModOrganizer2.exe', required: true }
        ]
      },
      {
        id: 'complete',
        title: 'Installation Complete!',
        icon: `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        tasks: []
      }
    ];
    
    this.init();
  }

  init() {
    if (!this.container) return;
    
    // Load saved progress
    this.loadProgress();
    
    // Render wizard
    this.render();
    
    // Setup event listeners
    this.setupListeners();
  }

  loadProgress() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      this.currentStep = data.currentStep || 0;
      this.completedTasks = new Set(data.completedTasks || []);
    } else {
      this.completedTasks = new Set();
    }
  }

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      currentStep: this.currentStep,
      completedTasks: Array.from(this.completedTasks),
      lastUpdated: new Date().toISOString()
    }));
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset your installation progress?')) {
      localStorage.removeItem(this.storageKey);
      this.currentStep = 0;
      this.completedTasks = new Set();
      this.render();
    }
  }

  render() {
    const step = this.steps[this.currentStep];
    const progress = ((this.currentStep / (this.steps.length - 1)) * 100).toFixed(0);
    
    this.container.innerHTML = `
      <div class="install-wizard">
        <!-- Progress Header -->
        <div class="wizard-header">
          <div class="wizard-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">
              Step ${this.currentStep + 1} of ${this.steps.length} - ${progress}% Complete
            </div>
          </div>
          <button class="wizard-reset" onclick="window.wizardInstance.resetProgress()">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Reset Progress
          </button>
        </div>

        <!-- Step Navigation -->
        <div class="wizard-steps">
          ${this.steps.map((s, idx) => `
            <div class="wizard-step ${idx === this.currentStep ? 'active' : ''} ${idx < this.currentStep ? 'completed' : ''}">
              <div class="step-number">${idx + 1}</div>
              <div class="step-title">${s.title}</div>
            </div>
          `).join('')}
        </div>

        <!-- Step Content -->
        <div class="wizard-content">
          <div class="step-icon">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${step.icon}
            </svg>
          </div>
          
          <h2 class="step-heading">${step.title}</h2>
          
          ${this.currentStep === this.steps.length - 1 ? `
            <div class="completion-message">
              <p>🎉 Congratulations! You've completed the installation process.</p>
              <p>Your modlist is ready to play. Launch the game through ModOrganizer2.exe and enjoy!</p>
              <div class="completion-actions">
                <a href="#gameplay-guide" class="btn-primary">Gameplay Guide</a>
                <a href="#known-issues" class="btn-secondary">Known Issues</a>
                <a href="https://discord.gg/yourserver" class="btn-secondary" target="_blank">Join Discord</a>
              </div>
            </div>
          ` : `
            <div class="task-list">
              ${step.tasks.map(task => `
                <label class="task-item ${this.completedTasks.has(task.id) ? 'completed' : ''}">
                  <input 
                    type="checkbox" 
                    id="${task.id}" 
                    ${this.completedTasks.has(task.id) ? 'checked' : ''}
                    onchange="window.wizardInstance.toggleTask('${task.id}')"
                  >
                  <span class="task-checkbox">
                    <svg class="checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span class="task-text">
                    ${task.text}
                    ${task.required ? '<span class="task-badge">Required</span>' : '<span class="task-badge optional">Optional</span>'}
                  </span>
                </label>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Navigation Buttons -->
        <div class="wizard-nav">
          <button 
            class="btn-secondary" 
            onclick="window.wizardInstance.previousStep()"
            ${this.currentStep === 0 ? 'disabled' : ''}
          >
            ← Previous
          </button>
          
          ${this.currentStep < this.steps.length - 1 ? `
            <button 
              class="btn-primary" 
              onclick="window.wizardInstance.nextStep()"
              ${!this.canProceed() ? 'disabled title="Complete all required tasks"' : ''}
            >
              Next →
            </button>
          ` : `
            <button class="btn-primary" onclick="window.wizardInstance.resetProgress()">
              Start New Installation
            </button>
          `}
        </div>
      </div>
    `;
  }

  toggleTask(taskId) {
    if (this.completedTasks.has(taskId)) {
      this.completedTasks.delete(taskId);
    } else {
      this.completedTasks.add(taskId);
    }
    this.saveProgress();
    this.render();
  }

  canProceed() {
    const step = this.steps[this.currentStep];
    const requiredTasks = step.tasks.filter(t => t.required);
    return requiredTasks.every(t => this.completedTasks.has(t.id));
  }

  nextStep() {
    if (this.canProceed() && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.saveProgress();
      this.render();
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.saveProgress();
      this.render();
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Initialize wizard on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const wizardContainer = document.getElementById('install-wizard');
    if (wizardContainer) {
      const modlistId = wizardContainer.dataset.modlist || 'wunduniik';
      window.wizardInstance = new InstallWizard('install-wizard', modlistId);
    }
  });
}

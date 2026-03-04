// Notification System
class NotificationSystem {
  constructor() {
    this.storageKey = 'astralforge_notifications_seen';
    this.notifications = [
      {
        id: 'welcome-2026',
        type: 'info',
        message: 'Welcome to The Astral Forge! Check out our latest modlist updates.',
        dismissible: true,
        persistent: false
      }
    ];
    this.init();
  }

  init() {
    this.seenNotifications = this.getSeenNotifications();
    this.renderNotifications();
  }

  getSeenNotifications() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  markAsSeen(notificationId) {
    if (!this.seenNotifications.includes(notificationId)) {
      this.seenNotifications.push(notificationId);
      localStorage.setItem(this.storageKey, JSON.stringify(this.seenNotifications));
    }
  }

  renderNotifications() {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const unseenNotifications = this.notifications.filter(
      notif => !this.seenNotifications.includes(notif.id)
    );

    if (unseenNotifications.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = unseenNotifications.map(notif => `
      <div class="notification notification-${notif.type}" data-notification-id="${notif.id}">
        <div class="notification-content">
          <span class="notification-icon">
            ${this.getIcon(notif.type)}
          </span>
          <p class="notification-message">${notif.message}</p>
        </div>
        ${notif.dismissible ? `
          <button class="notification-close" aria-label="Close notification">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        ` : ''}
      </div>
    `).join('');

    // Attach close handlers
    container.querySelectorAll('.notification-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const notif = e.target.closest('.notification');
        const id = notif.dataset.notificationId;
        this.markAsSeen(id);
        notif.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => {
          notif.remove();
          if (container.children.length === 0) {
            container.style.display = 'none';
          }
        }, 300);
      });
    });
  }

  getIcon(type) {
    const icons = {
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 20h20L12 2zm0 6v6m0 2v2"/></svg>'
    };
    return icons[type] || icons.info;
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.NotificationSystem = new NotificationSystem();
  });
}

import { Tooltip } from 'bootstrap';

export function initializeTooltips() {
  // Initialize all tooltips on the page
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl, {
    delay: { show: 500, hide: 100 },
    trigger: 'hover',
    animation: true,
    container: 'body',
    boundary: 'window'
  }));
}

// Initialize tooltips when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeTooltips();
});

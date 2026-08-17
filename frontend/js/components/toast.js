// CyberShield AI Toast Notification System

export function showToast(title, message, type = 'info', duration = 4500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'soc-toast flex items-start gap-3';
  
  let borderColor = '#00D1FF';
  let icon = 'info';
  let iconColor = 'text-primary';
  
  if (type === 'critical' || type === 'error') {
    borderColor = '#ffb4ab';
    icon = 'emergency';
    iconColor = 'text-error';
    toast.style.borderLeftColor = '#ffb4ab';
  } else if (type === 'warning') {
    borderColor = '#feb127';
    icon = 'warning';
    iconColor = 'text-tertiary-container';
    toast.style.borderLeftColor = '#feb127';
  } else if (type === 'success') {
    borderColor = '#4ade80';
    icon = 'check_circle';
    iconColor = 'text-[#4ade80]';
    toast.style.borderLeftColor = '#4ade80';
  } else {
    toast.style.borderLeftColor = '#00D1FF';
  }

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[22px] mt-0.5">${icon}</span>
    <div class="flex-1">
      <div class="font-headline-sm text-[13px] font-bold text-on-surface uppercase tracking-wide flex justify-between items-center">
        <span>${title}</span>
        <button class="text-on-surface-variant hover:text-on-surface text-sm ml-2" onclick="this.closest('.soc-toast').remove()">
          <span class="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>
      <div class="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-snug">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

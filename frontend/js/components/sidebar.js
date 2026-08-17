// CyberShield AI Sidebar Navigation Component

export function renderSidebar(currentTab, state) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'monitoring', label: 'Monitoring', icon: 'monitoring' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'dns' },
    { id: 'threats', label: 'Threats', icon: 'security', badge: state.threats ? state.threats.length : 0 },
    { id: 'incidents', label: 'Incidents', icon: 'emergency', badge: state.incidents ? state.incidents.length : 0, badgeCritical: true },
    { id: 'simulator', label: 'Attack Simulator', icon: 'model_training' },
    { id: 'recovery', label: 'Recovery', icon: 'settings_backup_restore' },
    { id: 'logs', label: 'Logs', icon: 'article' }
  ];

  return `
    <nav class="hidden md:flex flex-col w-[240px] h-screen fixed left-0 top-0 border-r border-outline-variant dark:border-outline-variant bg-surface py-lg z-50 select-none">
      <!-- Brand Logo -->
      <div class="px-md mb-xl flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center shadow-[0_0_10px_rgba(0,209,255,0.3)]">
          <span class="material-symbols-outlined text-on-primary-container text-[20px]" style="font-variation-settings: 'FILL' 1;">shield</span>
        </div>
        <div>
          <h1 class="font-headline-sm text-headline-sm font-bold text-on-surface">CyberShield AI</h1>
          <p class="font-label-md text-label-md text-on-surface-variant uppercase text-[10px] tracking-wider">Enterprise SOC</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <ul class="space-y-xs px-sm">
          ${tabs.map(tab => {
            const isActive = currentTab === tab.id;
            const activeClasses = isActive 
              ? 'text-primary bg-secondary-container/15 border-l-4 border-primary font-bold' 
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent';
            const iconFill = isActive ? "'FILL' 1" : "'FILL' 0";

            return `
              <li>
                <a href="#${tab.id}" 
                   data-nav="${tab.id}" 
                   class="flex items-center justify-between px-md py-sm rounded-r transition-colors cursor-pointer text-body-md ${activeClasses}">
                  <div class="flex items-center gap-md">
                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${iconFill};">${tab.icon}</span>
                    <span>${tab.label}</span>
                  </div>
                  ${tab.badge && tab.badge > 0 ? `
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono-data font-semibold ${tab.badgeCritical ? 'bg-error/20 text-error border border-error/30' : 'bg-primary/20 text-primary border border-primary/30'}">
                      ${tab.badge}
                    </span>
                  ` : ''}
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      </div>

      <!-- Footer Quick Status & Links -->
      <div class="mt-auto pt-md border-t border-outline-variant px-sm">
        <div class="px-md py-2 mb-2 bg-surface-container-low rounded border border-outline-variant/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${state.telemetry.risk_level === 'CRITICAL' ? 'bg-error animate-ping' : 'bg-primary pulse-dot'}"></span>
            <span class="font-mono-data text-[10px] text-on-surface-variant uppercase">Engine Live</span>
          </div>
          <span class="font-mono-data text-[10px] text-primary">v1.0.4</span>
        </div>
        <ul class="space-y-xs">
          <li>
            <a href="#settings" class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded transition-colors cursor-pointer text-body-sm">
              <span class="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="#logs" class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded transition-colors cursor-pointer text-body-sm">
              <span class="material-symbols-outlined text-[18px]">help</span>
              <span>SOC Support</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `;
}

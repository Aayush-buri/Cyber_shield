// CyberShield AI - Top Header Bar Component
export function renderTopbar(activeRoute, state) {
  const isSimulationActive = Boolean(state.active_simulation);
  const incidents = state.incidents || [];
  const activeIncidentsCount = incidents.filter(i => i.status === 'Active').length;

  return `
    <header class="h-16 fixed top-0 right-0 left-0 md:left-[240px] z-30 bg-[#0e1417]/90 backdrop-blur-md border-b border-[#3c494e] px-md md:px-xl flex items-center justify-between">
      <!-- Left: Mobile Menu Toggle & Title / Breadcrumbs -->
      <div class="flex items-center gap-md">
        <button id="mobile-menu-btn" class="md:hidden text-on-surface-variant hover:text-on-surface p-1">
          <span class="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div class="flex items-center gap-sm">
          <span class="font-mono-data text-xs text-on-surface-variant uppercase font-bold tracking-wider">CYBERSHIELD SOC</span>
          <span class="text-on-surface-variant/40">/</span>
          <span class="font-label-md text-xs font-semibold text-primary capitalize">${activeRoute}</span>
        </div>
      </div>

      <!-- Right: Search, Global Actions, System Status & User Profile -->
      <div class="flex items-center gap-sm sm:gap-md">
        <!-- Global Search Input with Dynamic Dropdown -->
        <div class="relative hidden sm:block">
          <div class="flex items-center bg-surface-container px-sm py-1.5 rounded border border-outline-variant focus-within:border-primary transition-all w-60 lg:w-72">
            <span class="material-symbols-outlined text-on-surface-variant text-[16px] mr-1.5">search</span>
            <input id="global-search-input" class="bg-transparent border-none text-on-surface font-body-sm text-xs focus:ring-0 w-full placeholder:text-on-surface-variant" placeholder="Search hosts, threats, IoCs..." type="text" autocomplete="off"/>
            <span class="text-[10px] font-mono-data text-on-surface-variant/60 bg-surface px-1.5 py-0.5 rounded border border-outline-variant/40">⌘K</span>
          </div>

          <!-- Dynamic Search Results Dropdown -->
          <div id="search-results-dropdown" class="hidden absolute top-full left-0 right-0 mt-1.5 bg-surface border border-outline-variant rounded-lg shadow-2xl p-2 z-50 max-h-80 overflow-y-auto custom-scrollbar">
            <div id="search-results-content" class="flex flex-col gap-1 text-xs"></div>
          </div>
        </div>

        <!-- Simulation Active Alert Banner / Quick Reset -->
        ${isSimulationActive ? `
          <div class="flex items-center gap-1.5 bg-error/15 text-error border border-error/30 px-2.5 py-1 rounded text-xs font-mono-data font-bold animate-pulse">
            <span class="material-symbols-outlined text-[14px]">warning</span>
            <span class="hidden md:inline">SIM ACTIVE: ${state.active_simulation.toUpperCase()}</span>
            <button id="quick-reset-btn" class="ml-1 text-[11px] bg-error text-on-error px-1.5 py-0.2 rounded hover:bg-error/80 uppercase">Reset</button>
          </div>
        ` : `
          <div class="hidden lg:flex items-center gap-1.5 bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30 px-2.5 py-1 rounded text-xs font-mono-data font-bold">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
            </span>
            <span class="text-[11px]">ALL SYSTEMS ONLINE</span>
          </div>
        `}

        <!-- Notifications Bell Dropdown -->
        <div class="relative">
          <button id="btn-topbar-notifications" class="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface border border-outline-variant relative transition-colors">
            <span class="material-symbols-outlined text-[18px]">notifications</span>
            ${activeIncidentsCount > 0 ? `
              <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-black font-mono-data text-[9px] font-bold flex items-center justify-center shadow">
                ${activeIncidentsCount}
              </span>
            ` : ''}
          </button>

          <!-- Notifications Popup -->
          <div id="notifications-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-surface border border-outline-variant rounded-lg shadow-2xl p-md z-50">
            <div class="flex justify-between items-center pb-2 border-b border-outline-variant mb-2">
              <span class="font-bold text-xs text-on-surface uppercase tracking-wider">Active Alerts (${activeIncidentsCount})</span>
              <a href="#incidents" class="text-[10px] text-primary hover:underline font-bold">View All</a>
            </div>
            <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              ${incidents.map(inc => `
                <div class="p-2 bg-surface-container rounded border border-outline-variant/40 hover:border-primary/50 transition-colors">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-on-surface">${inc.id}</span>
                    <span class="text-[10px] font-mono-data text-error font-bold">${inc.severity}</span>
                  </div>
                  <p class="text-[11px] text-on-surface-variant mt-0.5">${inc.title}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Attack Simulator Quick Action -->
        <a href="#simulator" class="hidden sm:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/40 px-2.5 py-1 rounded text-xs font-mono-data font-bold transition-all shadow-[0_0_10px_rgba(0,209,255,0.2)]">
          <span class="material-symbols-outlined text-[14px]">science</span>
          <span>Attack Lab</span>
        </a>

        <!-- SOC Officer Avatar -->
        <div class="flex items-center gap-2 pl-sm border-l border-outline-variant">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-surface-container flex items-center justify-center text-black font-bold text-xs shadow-[0_0_10px_rgba(0,209,255,0.4)]">
            CS
          </div>
          <div class="hidden xl:flex flex-col">
            <span class="font-bold text-xs text-on-surface leading-tight">Lead Analyst</span>
            <span class="font-mono-data text-[10px] text-on-surface-variant">SOC-Tier-3</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

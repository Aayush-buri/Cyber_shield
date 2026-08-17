// CyberShield AI - Overview Dashboard View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderOverview(state) {
  const telemetry = state.telemetry;
  const securityScore = state.security_score || 84;
  const activeThreats = state.threats ? state.threats.length : 3;

  return `
    <div class="flex flex-col gap-xl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 class="font-headline-md text-headline-md font-bold text-on-surface">System Overview</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Real-time telemetry and threat intelligence</p>
        </div>
        <div class="flex gap-sm">
          <button id="btn-export-overview" class="px-3 py-1.5 border border-outline-variant rounded text-on-surface text-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">download</span> Export
          </button>
          <button id="btn-refresh-overview" class="px-3 py-1.5 bg-primary-container text-on-primary font-medium rounded text-body-sm hover:opacity-90 transition-opacity flex items-center gap-1 shadow-[0_0_10px_rgba(0,209,255,0.3)]">
            <span class="material-symbols-outlined text-[16px]">autorenew</span> Refresh
          </button>
        </div>
      </div>

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <!-- Card 1: Security Score -->
        <div class="card rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Security Score</span>
            <span class="material-symbols-outlined text-primary text-xl">shield_locked</span>
          </div>
          <div class="flex items-end gap-2 mt-2">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface">${securityScore}<span class="text-on-surface-variant text-lg">/100</span></span>
          </div>
          <div class="w-full bg-surface-container-highest rounded-full h-1.5 mt-3">
            <div class="bg-primary h-1.5 rounded-full transition-all duration-700" style="width: ${securityScore}%"></div>
          </div>
        </div>

        <!-- Card 2: Active Threats -->
        <div class="card rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Threats</span>
            <span class="material-symbols-outlined text-error text-xl">warning</span>
          </div>
          <div class="flex items-end gap-2 mt-2">
            <span class="font-headline-lg text-headline-lg font-bold ${activeThreats > 0 ? 'text-error' : 'text-primary'}">${activeThreats}</span>
            <span class="font-body-sm text-body-sm text-error bg-error/10 px-1.5 py-0.5 rounded mb-1 flex items-center">
              <span class="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span>${activeThreats}
            </span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-2">Across 4 zones</p>
        </div>

        <!-- Card 3: Monitored Devices -->
        <div class="card rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Monitored Devices</span>
            <span class="material-symbols-outlined text-primary-fixed-dim text-xl">router</span>
          </div>
          <div class="flex items-end gap-2 mt-2">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface">1,240</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-2"><span class="text-primary font-bold">99.8%</span> Online</p>
        </div>

        <!-- Card 4: Contained Threats -->
        <div class="card rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Contained Threats</span>
            <span class="material-symbols-outlined text-tertiary-fixed-dim text-xl">backspace</span>
          </div>
          <div class="flex items-end gap-2 mt-2">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface">${telemetry.contained_threats_count || 450}</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-2">Last 24 hours</p>
        </div>
      </div>

      <!-- Mid Row (Threat Activity Chart & Critical Infrastructure) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <!-- Real-time Threat Activity Chart -->
        <div class="card rounded-lg lg:col-span-2 flex flex-col">
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Real-time Threat Activity</h3>
            <div class="flex gap-2">
              <button class="chart-tab px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-xs text-on-surface cursor-pointer">1H</button>
              <button class="chart-tab px-2.5 py-1 bg-primary/20 border border-primary/40 rounded text-xs text-primary font-bold cursor-pointer">24H</button>
              <button class="chart-tab px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-xs text-on-surface cursor-pointer">7D</button>
            </div>
          </div>
          <div class="p-md flex-1 relative min-h-[250px] flex items-center justify-center">
            <!-- SVG Chart with gradient -->
            <svg class="w-full h-full min-h-[220px]" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="overview-chart-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#00d1ff" stop-opacity="0.3"></stop>
                  <stop offset="100%" stop-color="#00d1ff" stop-opacity="0.0"></stop>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line stroke="#1E293B" stroke-dasharray="4" stroke-width="1" x1="0" x2="800" y1="50" y2="50"></line>
              <line stroke="#1E293B" stroke-dasharray="4" stroke-width="1" x1="0" x2="800" y1="100" y2="100"></line>
              <line stroke="#1E293B" stroke-dasharray="4" stroke-width="1" x1="0" x2="800" y1="150" y2="150"></line>
              <!-- Area -->
              <path id="overview-chart-area" fill="url(#overview-chart-grad)" d="M0,180 L50,150 L100,160 L150,100 L200,120 L250,80 L300,130 L350,90 L400,140 L450,70 L500,110 L550,50 L600,90 L650,40 L700,80 L750,30 L800,60 L800,200 L0,200 Z"></path>
              <!-- Line -->
              <path id="overview-chart-line" fill="none" stroke="#00d1ff" stroke-width="2.5" class="drop-shadow-[0_0_8px_rgba(0,209,255,0.6)]" d="M0,180 L50,150 L100,160 L150,100 L200,120 L250,80 L300,130 L350,90 L400,140 L450,70 L500,110 L550,50 L600,90 L650,40 L700,80 L750,30 L800,60"></path>
            </svg>
            <!-- Y Axis Labels -->
            <div class="absolute left-2 top-0 h-full flex flex-col justify-between py-md text-[10px] font-mono-data text-on-surface-variant pointer-events-none">
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
          </div>
        </div>

        <!-- Infrastructure Status List -->
        <div class="card rounded-lg flex flex-col">
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Critical Infrastructure</h3>
            <a href="#infrastructure" class="text-primary text-xs font-medium hover:underline">View All</a>
          </div>
          <div class="p-sm flex-1 flex flex-col gap-1 overflow-y-auto max-h-[300px] custom-scrollbar">
            ${(state.devices || []).map(device => {
              let dotColor = 'bg-primary shadow-[0_0_8px_rgba(0,209,255,0.8)]';
              let badgeColor = 'bg-primary/10 text-primary border-primary/20';
              if (device.status === 'Critical') {
                dotColor = 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.8)] animate-ping';
                badgeColor = 'bg-error/10 text-error border-error/20';
              } else if (device.status === 'Warning') {
                dotColor = 'bg-tertiary shadow-[0_0_8px_rgba(255,213,156,0.8)]';
                badgeColor = 'bg-tertiary/10 text-tertiary border-tertiary/20';
              } else if (device.status === 'Isolated') {
                dotColor = 'bg-secondary-fixed-dim';
                badgeColor = 'bg-surface-container text-on-surface-variant border-outline-variant';
              }

              return `
                <div class="flex items-center justify-between p-sm rounded hover:bg-surface-container-high transition-colors cursor-pointer" onclick="location.hash='#infrastructure'">
                  <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full ${dotColor}"></div>
                    <div>
                      <p class="font-body-md text-on-surface font-medium">${device.name}</p>
                      <p class="font-mono-data text-[11px] text-on-surface-variant">${device.ip}</p>
                    </div>
                  </div>
                  <span class="text-xs ${badgeColor} px-2 py-0.5 rounded border font-mono-data font-semibold">
                    ${device.status}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Live Alerts Table -->
      <div class="card rounded-lg flex flex-col overflow-hidden">
        <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Live Alerts & Audit Log</h3>
          <a href="#logs" class="text-primary text-sm font-medium hover:underline">View All Logs</a>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest font-label-md text-label-md text-on-surface-variant">
                <th class="py-sm px-md font-semibold">Timestamp</th>
                <th class="py-sm px-md font-semibold">Source IP / Host</th>
                <th class="py-sm px-md font-semibold">Threat / Activity</th>
                <th class="py-sm px-md font-semibold">Risk Level</th>
                <th class="py-sm px-md font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody class="font-body-sm text-body-sm">
              ${(state.logs || []).slice(0, 5).map(log => {
                let badgeClass = 'bg-secondary/10 text-secondary border-secondary/20';
                let icon = 'info';
                if (log.status === 'CRITICAL') {
                  badgeClass = 'bg-error/10 text-error border-error/20';
                  icon = 'block';
                } else if (log.status === 'WARNING') {
                  badgeClass = 'bg-tertiary/10 text-tertiary border-tertiary/20';
                  icon = 'warning';
                }

                return `
                  <tr class="table-row hover:bg-surface-container-high/50 transition-colors border-b border-outline-variant/40">
                    <td class="py-sm px-md font-mono-data text-on-surface-variant text-[12px]">${log.timestamp}</td>
                    <td class="py-sm px-md font-mono-data text-on-surface text-[12px] font-medium">${log.source_ip} <span class="text-on-surface-variant text-[10px]">(${log.host_name})</span></td>
                    <td class="py-sm px-md text-on-surface">${log.activity_type}</td>
                    <td class="py-sm px-md">
                      <span class="${badgeClass} border px-2 py-0.5 rounded text-[11px] font-mono-data font-semibold flex items-center w-fit gap-1">
                        <span class="material-symbols-outlined text-[12px]">${icon}</span> ${log.status}
                      </span>
                    </td>
                    <td class="py-sm px-md text-right">
                      ${log.action_available === 'Isolate' ? `
                        <button data-action="isolate" data-ip="${log.source_ip}" class="btn-isolate bg-error text-on-error px-3 py-1 rounded text-xs font-semibold hover:bg-error/80 transition-colors shadow-[0_0_8px_rgba(255,180,171,0.3)]">
                          Isolate
                        </button>
                      ` : `
                        <a href="#incidents" class="text-primary text-xs font-medium hover:underline">Investigate</a>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function attachOverviewHandlers(container, state, refreshCallback) {
  const refreshBtn = container.querySelector('#btn-refresh-overview');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('animate-spin');
      await refreshCallback();
      refreshBtn.classList.remove('animate-spin');
      showToast('Telemetry Refreshed', 'Overview metrics synchronized with backend simulation engine.', 'success');
    });
  }

  const exportBtn = container.querySelector('#btn-export-overview');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `cybershield-soc-report-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Export Completed', 'System overview telemetry exported as JSON report.', 'success');
    });
  }

  // Chart Timeframe Switcher
  container.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.chart-tab').forEach(t => {
        t.className = 'chart-tab px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-xs text-on-surface cursor-pointer';
      });
      tab.className = 'chart-tab px-2.5 py-1 bg-primary/20 border border-primary/40 rounded text-xs text-primary font-bold cursor-pointer';
      
      const svgArea = container.querySelector('#overview-chart-area');
      const svgLine = container.querySelector('#overview-chart-line');
      const tf = tab.textContent.trim();
      
      if (tf === '1H') {
        if (svgArea) svgArea.setAttribute('d', 'M0,160 L100,140 L200,150 L300,90 L400,110 L500,80 L600,60 L700,70 L800,30 L800,200 L0,200 Z');
        if (svgLine) svgLine.setAttribute('d', 'M0,160 L100,140 L200,150 L300,90 L400,110 L500,80 L600,60 L700,70 L800,30');
      } else if (tf === '24H') {
        if (svgArea) svgArea.setAttribute('d', 'M0,180 L50,150 L100,160 L150,100 L200,120 L250,80 L300,130 L350,90 L400,140 L450,70 L500,110 L550,50 L600,90 L650,40 L700,80 L750,30 L800,60 L800,200 L0,200 Z');
        if (svgLine) svgLine.setAttribute('d', 'M0,180 L50,150 L100,160 L150,100 L200,120 L250,80 L300,130 L350,90 L400,140 L450,70 L500,110 L550,50 L600,90 L650,40 L700,80 L750,30 L800,60');
      } else if (tf === '7D') {
        if (svgArea) svgArea.setAttribute('d', 'M0,120 L150,130 L300,110 L450,60 L600,80 L750,40 L800,50 L800,200 L0,200 Z');
        if (svgLine) svgLine.setAttribute('d', 'M0,120 L150,130 L300,110 L450,60 L600,80 L750,40 L800,50');
      }
    });
  });

  container.querySelectorAll('.btn-isolate').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ip = btn.getAttribute('data-ip');
      const device = (state.devices || []).find(d => d.ip === ip) || state.devices[0];
      if (device) {
        btn.textContent = 'Isolating...';
        btn.disabled = true;
        await api.containDevice(device.id);
        showToast('Asset Isolated', `${device.name} (${device.ip}) quarantined from network grid.`, 'critical');
        await refreshCallback();
      }
    });
  });
}

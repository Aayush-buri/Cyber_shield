// CyberShield AI - Monitoring Dashboard View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderMonitoring(state) {
  const telemetry = state.telemetry;
  const riskScore = telemetry.system_risk_score || 24;
  const riskLevel = telemetry.risk_level || 'LOW RISK';

  // SVG Gauge calculations
  const circumference = 251.2;
  const strokeDashoffset = circumference - (circumference * (riskScore / 100));
  let gaugeColor = '#00D1FF';
  let gaugeTextColor = 'text-primary-container';
  if (riskScore > 60) {
    gaugeColor = '#ffb4ab';
    gaugeTextColor = 'text-error';
  } else if (riskScore > 30) {
    gaugeColor = '#feb127';
    gaugeTextColor = 'text-tertiary-container';
  }

  // Generate 32 CPU nodes
  const cpuNodes = Array.from({ length: 32 }, (_, i) => {
    const isHot = riskScore > 60 ? (i % 3 === 0) : (i % 11 === 0);
    const opacity = 0.4 + (Math.sin(i + Date.now() / 1000) * 0.3 + 0.3);
    const colorClass = isHot ? 'bg-error shadow-[0_0_4px_rgba(255,180,171,0.8)]' : 'bg-primary-container';
    return `<div class="aspect-square rounded-[2px] ${colorClass}" style="opacity: ${opacity.toFixed(2)}"></div>`;
  }).join('');

  return `
    <div class="flex flex-col gap-lg">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-sm">
            Monitoring
            <span class="flex h-3 w-3 relative ml-sm">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
            </span>
          </h1>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Live telemetry and system health tracking</p>
        </div>
        <div class="flex gap-sm">
          <button id="btn-filter-monitoring" class="px-md py-sm rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md flex items-center gap-xs">
            <span class="material-symbols-outlined text-[16px]">filter_list</span> Filter
          </button>
          <button id="btn-export-monitoring" class="px-md py-sm rounded bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity font-label-md text-label-md flex items-center gap-xs font-bold shadow-[0_0_10px_rgba(0,209,255,0.3)]">
            <span class="material-symbols-outlined text-[16px]">download</span> Export Report
          </button>
        </div>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-md">
        <!-- System Risk Score -->
        <div class="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <h2 class="font-title-lg text-title-lg font-bold text-on-surface">System Risk Score</h2>
            <span class="material-symbols-outlined text-on-surface-variant">policy</span>
          </div>
          <div class="flex items-center justify-center py-lg">
            <div class="relative w-36 h-36 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#2f3639" stroke-width="8"></circle>
                <circle class="transition-all duration-700" cx="50" cy="50" fill="transparent" r="40" stroke="${gaugeColor}" stroke-dasharray="251.2" stroke-dashoffset="${strokeDashoffset}" stroke-width="8" stroke-linecap="round"></circle>
              </svg>
              <div class="absolute flex flex-col items-center">
                <span class="font-mono-data text-headline-lg font-bold ${gaugeTextColor}">${riskScore}</span>
                <span class="font-label-md text-label-md text-on-surface-variant mt-xs tracking-wider">${riskLevel}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between text-[11px] font-mono-data text-on-surface-variant border-t border-outline-variant/40 pt-2">
            <span>SAFE: 0-30</span>
            <span>WARN: 31-60</span>
            <span>CRIT: 81-100</span>
          </div>
        </div>

        <!-- Failed Logins -->
        <div class="col-span-12 md:col-span-6 lg:col-span-2 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div>
            <h2 class="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs uppercase tracking-wider">
              Failed Logins
              <span class="material-symbols-outlined text-[14px]">warning</span>
            </h2>
            <div class="mt-sm flex items-end gap-xs">
              <span class="font-mono-data text-headline-md font-bold text-error">${(telemetry.failed_logins_count || 1492).toLocaleString()}</span>
              <span class="font-body-sm text-body-sm text-error/80 mb-1">+12%</span>
            </div>
          </div>
          <!-- Sparkline SVG -->
          <div class="h-12 w-full mt-md">
            <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path class="opacity-80" d="M0,25 L10,22 L20,28 L30,15 L40,20 L50,5 L60,18 L70,10 L80,25 L90,12 L100,20" fill="none" stroke="#ffb4ab" stroke-width="2"></path>
              <path class="opacity-20" d="M0,30 L0,25 L10,22 L20,28 L30,15 L40,20 L50,5 L60,18 L70,10 L80,25 L90,12 L100,20 L100,30 Z" fill="#ffb4ab"></path>
            </svg>
          </div>
        </div>

        <!-- Data Transfer -->
        <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Data Transfer</h2>
            <span class="material-symbols-outlined text-[16px] text-primary">sync_alt</span>
          </div>
          <div class="mt-md space-y-sm">
            <div>
              <div class="flex justify-between font-mono-data text-mono-data mb-xs text-xs">
                <span class="text-on-surface">Egress</span>
                <span class="text-primary-container font-bold">${telemetry.egress_traffic_tbs || 4.2} TB/s</span>
              </div>
              <div class="w-full bg-surface-variant rounded-full h-1.5">
                <div class="bg-primary-container h-1.5 rounded-full transition-all duration-500" style="width: 75%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between font-mono-data text-mono-data mb-xs text-xs">
                <span class="text-on-surface">Ingress</span>
                <span class="text-tertiary-container font-bold">${telemetry.ingress_traffic_tbs || 1.8} TB/s</span>
              </div>
              <div class="w-full bg-surface-variant rounded-full h-1.5">
                <div class="bg-tertiary-container h-1.5 rounded-full transition-all duration-500" style="width: 45%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- File Activity -->
        <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <h2 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">File Activity</h2>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant">folder_open</span>
          </div>
          <div class="mt-md grid grid-cols-2 gap-sm">
            <div class="bg-surface-container-high rounded p-sm border border-outline-variant/50">
              <div class="font-mono-data text-body-sm text-on-surface-variant text-[11px]">Created</div>
              <div class="font-mono-data text-title-lg font-bold text-on-surface mt-xs">${(telemetry.file_creations_count || 8432).toLocaleString()}</div>
            </div>
            <div class="bg-surface-container-high rounded p-sm border border-outline-variant/50">
              <div class="font-mono-data text-body-sm text-on-surface-variant text-[11px]">Modified</div>
              <div class="font-mono-data text-title-lg font-bold text-tertiary-fixed-dim mt-xs">${(telemetry.file_modifications_count || 12104).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <!-- Middle Row: Network Traffic Telemetry -->
        <div class="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col min-h-[300px]">
          <div class="flex justify-between items-center mb-md">
            <h2 class="font-title-lg text-title-lg font-bold text-on-surface">Network Traffic Telemetry</h2>
            <div class="flex gap-xs bg-surface-variant rounded p-xs">
              <button class="monitoring-tf-btn px-sm py-xs text-[10px] font-label-md rounded bg-surface-container-high text-on-surface font-bold">1H</button>
              <button class="monitoring-tf-btn px-sm py-xs text-[10px] font-label-md rounded text-on-surface-variant hover:text-on-surface">6H</button>
              <button class="monitoring-tf-btn px-sm py-xs text-[10px] font-label-md rounded text-on-surface-variant hover:text-on-surface">24H</button>
            </div>
          </div>
          <div class="flex-1 w-full relative pt-md flex items-center justify-center">
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between py-md pointer-events-none opacity-20">
              <div class="border-b border-outline-variant w-full h-0"></div>
              <div class="border-b border-outline-variant w-full h-0"></div>
              <div class="border-b border-outline-variant w-full h-0"></div>
              <div class="border-b border-outline-variant w-full h-0"></div>
              <div class="border-b border-outline-variant w-full h-0"></div>
            </div>
            <!-- SVG Line Graph -->
            <svg class="w-full h-full min-h-[180px]" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="trafficGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#00d1ff" stop-opacity="0.35"></stop>
                  <stop offset="100%" stop-color="#00d1ff" stop-opacity="0.0"></stop>
                </linearGradient>
              </defs>
              <path id="monitoring-traffic-line" fill="none" stroke="#00d1ff" stroke-width="2.5" class="drop-shadow-[0_0_8px_rgba(0,209,255,0.6)]" d="M0,150 L50,120 L100,160 L150,90 L200,110 L250,50 L300,130 L350,80 L400,100 L450,40 L500,120 L550,60 L600,140 L650,70 L700,110 L750,30 L800,90 L850,50 L900,120 L950,60 L1000,100"></path>
              <path id="monitoring-traffic-area" fill="url(#trafficGradient)" d="M0,200 L0,150 L50,120 L100,160 L150,90 L200,110 L250,50 L300,130 L350,80 L400,100 L450,40 L500,120 L550,60 L600,140 L650,70 L700,110 L750,30 L800,90 L850,50 L900,120 L950,60 L1000,100 L1000,200 Z"></path>
            </svg>
          </div>
        </div>

        <!-- Resource Utilization -->
        <div class="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col">
          <h2 class="font-title-lg text-title-lg font-bold text-on-surface mb-lg">Resource Utilization</h2>
          
          <!-- CPU Node Grid -->
          <div class="mb-lg">
            <div class="flex justify-between items-end mb-sm">
              <span class="font-label-md text-label-md text-on-surface-variant uppercase text-xs">CPU Cluster Load</span>
              <span class="font-mono-data text-primary-container font-bold text-sm">${telemetry.cpu_cluster_load_percent || 68}%</span>
            </div>
            <div class="grid grid-cols-8 gap-xs">
              ${cpuNodes}
            </div>
          </div>

          <!-- Memory Bar -->
          <div>
            <div class="flex justify-between items-end mb-sm">
              <span class="font-label-md text-label-md text-on-surface-variant uppercase text-xs">Memory Allocation</span>
              <span class="font-mono-data text-tertiary-container font-bold text-sm">${telemetry.memory_allocation_percent || 84}%</span>
            </div>
            <div class="w-full bg-surface-variant rounded h-4 overflow-hidden flex border border-outline-variant/30">
              <div class="bg-primary-container h-full" style="width: 40%"></div>
              <div class="bg-tertiary-container h-full" style="width: 30%"></div>
              <div class="bg-error h-full" style="width: 14%"></div>
            </div>
            <div class="flex gap-md mt-xs font-mono-data text-[10px] text-on-surface-variant">
              <span class="flex items-center gap-[4px]"><span class="w-2 h-2 rounded-sm bg-primary-container inline-block"></span> System</span>
              <span class="flex items-center gap-[4px]"><span class="w-2 h-2 rounded-sm bg-tertiary-container inline-block"></span> Cache</span>
              <span class="flex items-center gap-[4px]"><span class="w-2 h-2 rounded-sm bg-error inline-block"></span> Overhead</span>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Real-time Activity Table -->
        <div class="col-span-12 bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
          <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
            <h2 class="font-title-lg text-title-lg font-bold text-on-surface">Real-time Activity Log</h2>
            <span class="px-sm py-[2px] rounded bg-primary/10 text-primary border border-primary/30 font-mono-data text-[10px] flex items-center gap-xs font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"></span> LIVE
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface border-b border-outline-variant font-label-md text-label-md text-on-surface-variant">
                  <th class="p-md font-medium uppercase tracking-wider">Timestamp</th>
                  <th class="p-md font-medium uppercase tracking-wider">Source IP / Host</th>
                  <th class="p-md font-medium uppercase tracking-wider">Activity Type</th>
                  <th class="p-md font-medium uppercase tracking-wider">Status</th>
                  <th class="p-md font-medium uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody class="font-mono-data text-mono-data text-on-surface">
                ${(state.logs || []).slice(0, 6).map(log => {
                  let badge = 'bg-surface-variant text-on-surface border-outline-variant';
                  if (log.status === 'CRITICAL') {
                    badge = 'bg-error/10 text-error border-error/20';
                  } else if (log.status === 'WARNING') {
                    badge = 'bg-tertiary-container/10 text-tertiary-fixed-dim border-tertiary-container/20';
                  }

                  return `
                    <tr class="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors">
                      <td class="p-md text-on-surface-variant text-xs">${log.timestamp}</td>
                      <td class="p-md text-xs font-semibold">${log.source_ip} <span class="text-on-surface-variant text-[10px] ml-xs">${log.host_name}</span></td>
                      <td class="p-md text-xs text-on-surface">${log.activity_type}</td>
                      <td class="p-md">
                        <span class="px-2 py-1 rounded ${badge} border font-bold text-[11px]">
                          ${log.status}
                        </span>
                      </td>
                      <td class="p-md text-right">
                        <a href="#incidents" class="text-primary hover:text-primary-container text-xs uppercase tracking-wide font-bold">Investigate</a>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachMonitoringHandlers(container, state, refreshCallback) {
  // Chart Timeframe Switcher
  container.querySelectorAll('.monitoring-tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.monitoring-tf-btn').forEach(b => {
        b.className = 'monitoring-tf-btn px-sm py-xs text-[10px] font-label-md rounded text-on-surface-variant hover:text-on-surface cursor-pointer';
      });
      btn.className = 'monitoring-tf-btn px-sm py-xs text-[10px] font-label-md rounded bg-surface-container-high text-on-surface font-bold cursor-pointer';

      const line = container.querySelector('#monitoring-traffic-line');
      const area = container.querySelector('#monitoring-traffic-area');
      const tf = btn.textContent.trim();

      if (tf === '1H') {
        if (line) line.setAttribute('d', 'M0,150 L50,120 L100,160 L150,90 L200,110 L250,50 L300,130 L350,80 L400,100 L450,40 L500,120 L550,60 L600,140 L650,70 L700,110 L750,30 L800,90 L850,50 L900,120 L950,60 L1000,100');
        if (area) area.setAttribute('d', 'M0,200 L0,150 L50,120 L100,160 L150,90 L200,110 L250,50 L300,130 L350,80 L400,100 L450,40 L500,120 L550,60 L600,140 L650,70 L700,110 L750,30 L800,90 L850,50 L900,120 L950,60 L1000,100 L1000,200 Z');
      } else if (tf === '6H') {
        if (line) line.setAttribute('d', 'M0,110 L100,130 L200,90 L300,140 L400,70 L500,100 L600,50 L700,90 L800,40 L900,80 L1000,60');
        if (area) area.setAttribute('d', 'M0,200 L0,110 L100,130 L200,90 L300,140 L400,70 L500,100 L600,50 L700,90 L800,40 L900,80 L1000,60 L1000,200 Z');
      } else if (tf === '24H') {
        if (line) line.setAttribute('d', 'M0,140 L150,120 L300,150 L450,80 L600,110 L750,60 L900,90 L1000,70');
        if (area) area.setAttribute('d', 'M0,200 L0,140 L150,120 L300,150 L450,80 L600,110 L750,60 L900,90 L1000,70 L1000,200 Z');
      }
    });
  });

  const exportBtn = container.querySelector('#btn-export-monitoring');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('Exporting Report', 'Generating real-time telemetry audit stream...', 'info');
      setTimeout(() => {
        showToast('Report Downloaded', 'SOC telemetry report exported successfully.', 'success');
      }, 800);
    });
  }
}

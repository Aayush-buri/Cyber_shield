// CyberShield AI - Infrastructure Overview & Live Topology View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderInfrastructure(state) {
  const devices = state.devices || [];
  const selectedId = state.selectedDeviceId || (devices[0] ? devices[0].id : 'db-prod-04');
  const selectedDevice = devices.find(d => d.id === selectedId) || devices[0];

  return `
    <div class="flex flex-col gap-lg">
      <!-- Status Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
        <!-- Segment: Power Grid -->
        <div class="soc-card rounded flex flex-col p-md bg-surface-container border border-outline-variant">
          <div class="flex justify-between items-start mb-sm">
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-primary text-sm">bolt</span>
              <h3 class="font-label-md text-label-md text-on-surface font-semibold">Power Grid Network</h3>
            </div>
            <span class="bg-primary/10 text-primary font-mono-data text-[10px] px-2 py-0.5 rounded border border-primary/20 font-bold">NOMINAL</span>
          </div>
          <div class="flex items-end gap-sm mt-auto">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface">99.9%</span>
            <span class="font-body-sm text-on-surface-variant mb-1 text-xs">Uptime</span>
          </div>
          <div class="w-full bg-surface-container-high h-1.5 mt-md rounded-full overflow-hidden">
            <div class="bg-primary h-full w-[99.9%]"></div>
          </div>
        </div>

        <!-- Segment: Water System -->
        <div class="soc-card rounded flex flex-col p-md bg-surface-container border border-outline-variant">
          <div class="flex justify-between items-start mb-sm">
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-error text-sm">water_drop</span>
              <h3 class="font-label-md text-label-md text-on-surface font-semibold">Water Control Sys</h3>
            </div>
            <span class="bg-error/10 text-error font-mono-data text-[10px] px-2 py-0.5 rounded border border-error/20 flex items-center gap-1 font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> ALERT
            </span>
          </div>
          <div class="flex items-end gap-sm mt-auto">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface">98.2%</span>
            <span class="font-body-sm text-on-surface-variant mb-1 text-xs">Uptime</span>
          </div>
          <div class="w-full bg-surface-container-high h-1.5 mt-md rounded-full overflow-hidden">
            <div class="bg-error h-full w-[98.2%]"></div>
          </div>
        </div>

        <!-- Segment: Comms -->
        <div class="soc-card rounded flex flex-col p-md bg-surface-container border border-outline-variant">
          <div class="flex justify-between items-start mb-sm">
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-tertiary text-sm">satellite_alt</span>
              <h3 class="font-label-md text-label-md text-on-surface font-semibold">Comms Relay</h3>
            </div>
            <span class="bg-tertiary/10 text-tertiary font-mono-data text-[10px] px-2 py-0.5 rounded border border-tertiary/20 font-bold">DEGRADED</span>
          </div>
          <div class="flex items-end gap-sm mt-auto">
            <span class="font-headline-lg text-headline-lg font-bold text-on-surface">94.5%</span>
            <span class="font-body-sm text-on-surface-variant mb-1 text-xs">Uptime</span>
          </div>
          <div class="w-full bg-surface-container-high h-1.5 mt-md rounded-full overflow-hidden">
            <div class="bg-tertiary h-full w-[94.5%]"></div>
          </div>
        </div>
      </div>

      <!-- Live Topology Map Box -->
      <div class="soc-card rounded-lg flex flex-col overflow-hidden border border-outline-variant bg-[#121820]">
        <div class="px-md py-sm border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0 z-10">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">hub</span>
            <h2 class="font-title-lg text-title-lg font-bold text-on-surface">Live Network & SCADA Topology</h2>
          </div>
          <div class="flex items-center gap-xs">
            <span class="text-[11px] font-mono-data text-on-surface-variant mr-2 hidden sm:inline">Click any node to open Inspector Drawer</span>
            <button id="topo-zoom-in" class="w-7 h-7 flex items-center justify-center rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant transition-colors">
              <span class="material-symbols-outlined text-[16px]">zoom_in</span>
            </button>
            <button id="topo-zoom-out" class="w-7 h-7 flex items-center justify-center rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant transition-colors">
              <span class="material-symbols-outlined text-[16px]">zoom_out</span>
            </button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div id="topology-viewport" class="bg-grid-pattern relative min-h-[380px] p-md overflow-hidden bg-[#0A0E14] flex items-center justify-center">
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <!-- Connecting Lines -->
            <path d="M 400,90 L 180,180" stroke="#1E293B" stroke-dasharray="4 4" stroke-width="2"></path>
            <path d="M 400,90 L 620,180" stroke="#1E293B" stroke-dasharray="4 4" stroke-width="2"></path>
            <path d="M 400,90 L 400,240" stroke="#00D1FF" stroke-dasharray="4 4" stroke-width="2"></path>
            <path d="M 180,180 L 120,300" stroke="#1E293B" stroke-dasharray="4 4" stroke-width="2"></path>
            <path d="M 620,180 L 680,300" stroke="#ffb4ab" stroke-dasharray="4 4" stroke-width="2"></path>
            <path d="M 400,240 L 400,320" stroke="#00D1FF" stroke-dasharray="4 4" stroke-width="2"></path>

            <!-- Animated Data Flow Particles -->
            <circle cx="400" cy="90" fill="#00D1FF" r="4">
              <animate attributeName="cx" dur="2.5s" repeatCount="indefinite" values="400;180"></animate>
              <animate attributeName="cy" dur="2.5s" repeatCount="indefinite" values="90;180"></animate>
              <animate attributeName="opacity" dur="2.5s" repeatCount="indefinite" values="0;1;0"></animate>
            </circle>
            <circle cx="400" cy="90" fill="#00D1FF" r="4">
              <animate attributeName="cx" dur="2.0s" repeatCount="indefinite" values="400;400"></animate>
              <animate attributeName="cy" dur="2.0s" repeatCount="indefinite" values="90;240"></animate>
              <animate attributeName="opacity" dur="2.0s" repeatCount="indefinite" values="0;1;0"></animate>
            </circle>
            <circle cx="620" cy="180" fill="#ffb4ab" r="4">
              <animate attributeName="cx" dur="1.8s" repeatCount="indefinite" values="620;680"></animate>
              <animate attributeName="cy" dur="1.8s" repeatCount="indefinite" values="180;300"></animate>
              <animate attributeName="opacity" dur="1.8s" repeatCount="indefinite" values="0;1;0"></animate>
            </circle>
          </svg>

          <!-- Interactive Topology Nodes -->
          <div class="relative w-full max-w-3xl h-[340px] pointer-events-auto">
            <!-- Central Router Core -->
            <div class="topo-node absolute top-[20px] left-[50%] -translate-x-1/2 flex flex-col items-center cursor-pointer group z-20" data-device-id="comms-relay">
              <div class="w-14 h-14 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center relative shadow-[0_0_20px_rgba(0,209,255,0.4)] group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-primary text-2xl">hub</span>
                <div class="absolute inset-0 rounded-full border border-primary pulse-ring"></div>
              </div>
              <span class="mt-2 font-mono-data text-[11px] font-bold text-on-surface bg-surface px-2.5 py-0.5 rounded border border-outline-variant shadow">CORE-RTR-01</span>
            </div>

            <!-- Subnet 1: Power Grid -->
            <div class="topo-node absolute top-[140px] left-[15%] flex flex-col items-center cursor-pointer group z-20" data-device-id="pwr-plc-01">
              <div class="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all shadow">
                <span class="material-symbols-outlined text-primary text-xl">bolt</span>
              </div>
              <span class="mt-2 font-mono-data text-[10px] text-on-surface bg-surface px-2 py-0.5 rounded border border-outline-variant">PWR-SW-01 (10.0.4.15)</span>
            </div>

            <!-- Subnet 2: Database Cluster -->
            <div class="topo-node absolute top-[190px] left-[50%] -translate-x-1/2 flex flex-col items-center cursor-pointer group z-20" data-device-id="db-prod-04">
              <div class="w-12 h-12 rounded-full bg-surface-container border-2 border-primary-container flex items-center justify-center group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,209,255,0.3)]">
                <span class="material-symbols-outlined text-primary-container text-xl">database</span>
              </div>
              <span class="mt-2 font-mono-data text-[10px] text-on-surface font-semibold bg-surface px-2 py-0.5 rounded border border-outline-variant">DB-PROD-04 (10.0.5.22)</span>
            </div>

            <!-- Subnet 3: Water SCADA (Alert State) -->
            <div class="topo-node absolute top-[140px] right-[15%] flex flex-col items-center cursor-pointer group z-20" data-device-id="wtr-scada-42">
              <div class="w-12 h-12 rounded-full bg-error/15 border-2 border-error flex items-center justify-center relative shadow-[0_0_15px_rgba(255,180,171,0.4)] group-hover:scale-110 transition-all animate-pulse">
                <span class="material-symbols-outlined text-error text-xl">water_drop</span>
                <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-error border-2 border-[#121820]"></div>
              </div>
              <span class="mt-2 font-mono-data text-[10px] text-error font-bold bg-surface px-2 py-0.5 rounded border border-error/50">WTR-PLC-42 (SCADA)</span>
            </div>

            <!-- Leaf: Workstation -->
            <div class="topo-node absolute top-[280px] left-[5%] flex flex-col items-center cursor-pointer group z-20" data-device-id="wkst-04">
              <div class="w-10 h-10 rounded bg-surface-container border border-outline-variant flex items-center justify-center group-hover:border-primary transition-all">
                <span class="material-symbols-outlined text-on-surface-variant text-lg">desktop_windows</span>
              </div>
              <span class="mt-1 font-mono-data text-[9px] text-on-surface-variant bg-surface px-1.5 py-0.5 rounded border border-outline-variant">WKST-04</span>
            </div>

            <!-- Leaf: Main Server -->
            <div class="topo-node absolute top-[280px] right-[5%] flex flex-col items-center cursor-pointer group z-20" data-device-id="main-server">
              <div class="w-10 h-10 rounded bg-surface-container border border-outline-variant flex items-center justify-center group-hover:border-primary transition-all">
                <span class="material-symbols-outlined text-on-surface-variant text-lg">dns</span>
              </div>
              <span class="mt-1 font-mono-data text-[9px] text-on-surface-variant bg-surface px-1.5 py-0.5 rounded border border-outline-variant">MAIN-SRV-01</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Asset Inventory Table -->
      <div class="soc-card rounded-lg flex flex-col overflow-hidden border border-outline-variant bg-[#121820]">
        <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div>
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Virtual Infrastructure Inventory</h3>
            <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">Critical endpoints, PLCs, and database nodes</p>
          </div>
          <span class="text-xs font-mono-data text-primary font-bold">${devices.length} Total Nodes Monitored</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest font-label-md text-label-md text-on-surface-variant text-xs uppercase">
                <th class="py-sm px-md font-semibold">Asset Name & ID</th>
                <th class="py-sm px-md font-semibold">Zone / Type</th>
                <th class="py-sm px-md font-semibold">IP Address</th>
                <th class="py-sm px-md font-semibold">Risk Score</th>
                <th class="py-sm px-md font-semibold">Status</th>
                <th class="py-sm px-md font-semibold">Telemetry</th>
                <th class="py-sm px-md font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="font-body-sm text-body-sm">
              ${devices.map(device => {
                let badgeClass = 'bg-primary/10 text-primary border-primary/20';
                if (device.status === 'Critical') {
                  badgeClass = 'bg-error/10 text-error border-error/20 animate-pulse';
                } else if (device.status === 'Warning') {
                  badgeClass = 'bg-tertiary/10 text-tertiary border-tertiary/20';
                } else if (device.status === 'Isolated') {
                  badgeClass = 'bg-surface-container text-on-surface-variant border-outline-variant';
                }

                return `
                  <tr class="hover:bg-surface-container-high/50 transition-colors border-b border-outline-variant/40">
                    <td class="py-sm px-md font-medium text-on-surface">
                      <div class="font-bold text-xs">${device.name}</div>
                      <div class="text-[10px] font-mono-data text-on-surface-variant">${device.os}</div>
                    </td>
                    <td class="py-sm px-md">
                      <span class="text-xs text-on-surface-variant">${device.zone}</span>
                      <div class="text-[10px] font-mono-data text-primary font-semibold">${device.type}</div>
                    </td>
                    <td class="py-sm px-md font-mono-data text-xs text-on-surface font-semibold">${device.ip}</td>
                    <td class="py-sm px-md font-mono-data text-xs">
                      <span class="${device.risk_score > 60 ? 'text-error font-bold' : device.risk_score > 30 ? 'text-tertiary font-bold' : 'text-primary'}">${device.risk_score}/100</span>
                    </td>
                    <td class="py-sm px-md">
                      <span class="${badgeClass} border px-2 py-0.5 rounded text-[11px] font-mono-data font-semibold">
                        ${device.status}
                      </span>
                    </td>
                    <td class="py-sm px-md text-xs font-mono-data text-on-surface-variant">
                      <span>CPU: ${device.cpu_percent}%</span> | <span>${device.network_traffic_mbps} MB/s</span>
                    </td>
                    <td class="py-sm px-md text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button data-action="inspect" data-device-id="${device.id}" class="btn-inspect-device bg-surface-container hover:bg-surface-variant text-on-surface border border-outline-variant px-2.5 py-1 rounded text-[11px] font-semibold transition-colors">
                          Inspect
                        </button>
                        ${device.status !== 'Isolated' ? `
                          <button data-action="isolate" data-device-id="${device.id}" class="btn-isolate-asset bg-error/15 hover:bg-error text-error hover:text-on-error border border-error/30 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors">
                            Isolate
                          </button>
                        ` : `
                          <button data-action="recover" data-device-id="${device.id}" class="btn-recover-asset bg-primary/15 hover:bg-primary text-primary hover:text-black border border-primary/30 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors">
                            Recover
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Slide-Over Device Inspector Drawer Modal -->
      <div id="device-inspector-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-surface border border-outline-variant rounded-lg w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
          <div class="p-md bg-surface-container border-b border-outline-variant flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[22px]">developer_board</span>
              <h3 id="drawer-title" class="font-headline-sm text-sm font-bold text-on-surface">Device Telemetry Inspector</h3>
            </div>
            <button id="close-inspector-btn" class="text-on-surface-variant hover:text-on-surface">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div class="p-lg flex flex-col gap-md">
            <div class="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/60">
              <div>
                <div id="drawer-name" class="font-bold text-sm text-on-surface">DB-PROD-04 Cluster</div>
                <div id="drawer-ip" class="font-mono-data text-xs text-on-surface-variant">10.0.5.22</div>
              </div>
              <span id="drawer-status" class="px-2 py-0.5 rounded text-xs font-mono-data font-bold bg-primary/10 text-primary border border-primary/20">Nominal</span>
            </div>

            <!-- Specs Grid -->
            <div class="grid grid-cols-2 gap-sm text-xs">
              <div class="p-sm bg-surface-container-low rounded border border-outline-variant/40">
                <span class="text-on-surface-variant text-[10px] uppercase font-bold">Zone / Segment</span>
                <div id="drawer-zone" class="font-semibold text-on-surface mt-0.5">Core Cluster</div>
              </div>
              <div class="p-sm bg-surface-container-low rounded border border-outline-variant/40">
                <span class="text-on-surface-variant text-[10px] uppercase font-bold">OS Platform</span>
                <div id="drawer-os" class="font-semibold text-on-surface mt-0.5">RHEL 9 / PostgreSQL 15</div>
              </div>
              <div class="p-sm bg-surface-container-low rounded border border-outline-variant/40">
                <span class="text-on-surface-variant text-[10px] uppercase font-bold">CPU Utilization</span>
                <div id="drawer-cpu" class="font-mono-data font-bold text-primary mt-0.5">38%</div>
              </div>
              <div class="p-sm bg-surface-container-low rounded border border-outline-variant/40">
                <span class="text-on-surface-variant text-[10px] uppercase font-bold">Network Traffic</span>
                <div id="drawer-net" class="font-mono-data font-bold text-primary mt-0.5">88.2 MB/s</div>
              </div>
            </div>

            <!-- Inspector Actions -->
            <div class="flex gap-sm mt-sm pt-sm border-t border-outline-variant/40">
              <button id="drawer-action-isolate" class="soc-button-destructive flex-1 py-2 text-xs font-bold flex justify-center items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">gpp_bad</span> Isolate Host
              </button>
              <button id="drawer-action-recover" class="soc-button-primary flex-1 py-2 text-xs font-bold flex justify-center items-center gap-1 shadow-[0_0_10px_rgba(0,209,255,0.3)]">
                <span class="material-symbols-outlined text-[16px]">healing</span> Restore / Reconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachInfrastructureHandlers(container, state, refreshCallback) {
  const modal = container.querySelector('#device-inspector-modal');
  const closeBtn = container.querySelector('#close-inspector-btn');

  let activeModalDeviceId = null;

  const openInspector = (deviceId) => {
    const device = (state.devices || []).find(d => d.id === deviceId);
    if (!device || !modal) return;
    activeModalDeviceId = device.id;

    modal.querySelector('#drawer-title').textContent = `${device.name} Telemetry Inspector`;
    modal.querySelector('#drawer-name').textContent = device.name;
    modal.querySelector('#drawer-ip').textContent = `${device.ip} (${device.type})`;
    modal.querySelector('#drawer-zone').textContent = device.zone;
    modal.querySelector('#drawer-os').textContent = device.os;
    modal.querySelector('#drawer-cpu').textContent = `${device.cpu_percent}%`;
    modal.querySelector('#drawer-net').textContent = `${device.network_traffic_mbps} MB/s`;

    const statusSpan = modal.querySelector('#drawer-status');
    statusSpan.textContent = device.status;
    if (device.status === 'Critical') {
      statusSpan.className = 'px-2 py-0.5 rounded text-xs font-mono-data font-bold bg-error/15 text-error border border-error/30 animate-pulse';
    } else if (device.status === 'Isolated') {
      statusSpan.className = 'px-2 py-0.5 rounded text-xs font-mono-data font-bold bg-surface-container text-on-surface-variant border border-outline-variant';
    } else {
      statusSpan.className = 'px-2 py-0.5 rounded text-xs font-mono-data font-bold bg-primary/10 text-primary border border-primary/20';
    }

    modal.classList.remove('hidden');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // Topology node clicks open inspector
  container.querySelectorAll('.topo-node').forEach(node => {
    node.addEventListener('click', () => {
      const deviceId = node.getAttribute('data-device-id');
      openInspector(deviceId);
    });
  });

  // Inspect button clicks in table
  container.querySelectorAll('.btn-inspect-device').forEach(btn => {
    btn.addEventListener('click', () => {
      const deviceId = btn.getAttribute('data-device-id');
      openInspector(deviceId);
    });
  });

  // Drawer action buttons
  const drawerIsolateBtn = container.querySelector('#drawer-action-isolate');
  if (drawerIsolateBtn) {
    drawerIsolateBtn.addEventListener('click', async () => {
      if (activeModalDeviceId) {
        await api.containDevice(activeModalDeviceId);
        showToast('Asset Isolated', `${activeModalDeviceId} has been quarantined.`, 'critical');
        modal.classList.add('hidden');
        await refreshCallback();
      }
    });
  }

  const drawerRecoverBtn = container.querySelector('#drawer-action-recover');
  if (drawerRecoverBtn) {
    drawerRecoverBtn.addEventListener('click', async () => {
      if (activeModalDeviceId) {
        await api.recoverDevice(activeModalDeviceId);
        showToast('Asset Restored', `${activeModalDeviceId} restored to Nominal.`, 'success');
        modal.classList.add('hidden');
        await refreshCallback();
      }
    });
  }

  // Isolate button clicks in table
  container.querySelectorAll('.btn-isolate-asset').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const deviceId = btn.getAttribute('data-device-id');
      btn.textContent = 'Isolating...';
      btn.disabled = true;
      await api.containDevice(deviceId);
      showToast('Endpoint Isolated', `Quarantine rule applied to ${deviceId}. Network socket terminated.`, 'critical');
      await refreshCallback();
    });
  });

  // Recover button clicks in table
  container.querySelectorAll('.btn-recover-asset').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const deviceId = btn.getAttribute('data-device-id');
      btn.textContent = 'Restoring...';
      btn.disabled = true;
      await api.recoverDevice(deviceId);
      showToast('Endpoint Restored', `${deviceId} has been recovered and verified Nominal.`, 'success');
      await refreshCallback();
    });
  });
}

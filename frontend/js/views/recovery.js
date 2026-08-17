// CyberShield AI - Recovery Center View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderRecovery(state) {
  const recoveryStatus = state.recoveryStatus || {
    tasks: [
      { id: 'rec-db', name: 'Database Restoration', target_asset_id: 'db-prod-04', progress_percent: 85, eta: '4m 12s', details: 'Syncing shards 14-42... ETA: 4m 12s' },
      { id: 'rec-endpoints', name: 'Endpoint Deployment', target_asset_id: 'wkst-04', progress_percent: 40, eta: '2m 30s', details: 'Deploying agents to zone Alpha-1' },
      { id: 'rec-network', name: 'Network Tunneling', target_asset_id: 'comms-relay', progress_percent: 100, eta: '0s', details: 'Connection re-established. Tunnels secure.' }
    ],
    backup_health: [
      { target: 'Core_DB_Cluster', last_snapshot: '12 mins ago', integrity: 'Verified' },
      { target: 'User_Auth_Logs', last_snapshot: '1 hr ago', integrity: 'Verified' },
      { target: 'Edge_Configs_US', last_snapshot: '4 hrs ago', integrity: 'Checking' }
    ]
  };

  return `
    <div class="flex flex-col gap-lg">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-sm mb-xs">
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">Recovery Center</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1">Manage system restoration and monitor backup integrity protocols.</p>
        </div>
        <button id="btn-master-recovery" class="bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/50 px-md py-sm rounded flex items-center gap-sm hover:bg-[#00D1FF]/20 transition-colors font-label-md text-label-md uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(0,209,255,0.3)]">
          <span class="material-symbols-outlined text-[18px]">play_circle</span> Initiate Master Recovery
        </button>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-md">
        <!-- System Restoration Status (Spans 8 cols) -->
        <div class="col-span-12 lg:col-span-8 card-panel rounded-lg p-lg flex flex-col relative overflow-hidden bg-[#121820] border border-outline-variant">
          <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span class="material-symbols-outlined text-[120px]">sync</span>
          </div>

          <div class="flex justify-between items-center mb-md pb-sm border-b border-outline-variant/50">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-sm">
              <span class="material-symbols-outlined text-primary text-[20px]">cloud_sync</span>
              System Restoration Status
            </h3>
            <span class="font-mono-data text-mono-data text-on-surface-variant bg-surface-container px-2 py-1 rounded text-xs border border-outline-variant/30 font-bold">
              ID: REC-SYS-0992
            </span>
          </div>

          <div class="space-y-6 mt-2">
            <!-- Database Restoration -->
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="font-label-md text-label-md text-on-surface uppercase tracking-wider text-xs font-semibold">Database Restoration</span>
                <span id="prog-db-val" class="font-mono-data text-mono-data text-primary font-bold">85%</span>
              </div>
              <div class="h-2.5 w-full bg-[#1a2123] border border-[#1E293B] rounded-full overflow-hidden relative">
                <div id="prog-db-bar" class="h-full bg-[#00D1FF] shadow-[0_0_8px_rgba(0,209,255,0.4)] rounded-full transition-all duration-700" style="width: 85%;"></div>
                <div class="absolute top-0 left-0 h-full w-full animate-shimmer"></div>
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 text-[11px]">Syncing shards 14-42... ETA: 4m 12s</p>
            </div>

            <!-- Endpoint Deployment -->
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="font-label-md text-label-md text-on-surface uppercase tracking-wider text-xs font-semibold">Endpoint Deployment</span>
                <span id="prog-ep-val" class="font-mono-data text-mono-data text-tertiary font-bold">40%</span>
              </div>
              <div class="h-2.5 w-full bg-[#1a2123] border border-[#1E293B] rounded-full overflow-hidden">
                <div id="prog-ep-bar" class="h-full bg-tertiary rounded-full shadow-[0_0_8px_rgba(255,213,156,0.4)] transition-all duration-700" style="width: 40%;"></div>
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 text-[11px]">Deploying agents to zone Alpha-1</p>
            </div>

            <!-- Network Tunneling -->
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="font-label-md text-label-md text-on-surface uppercase tracking-wider text-xs font-semibold">Network Tunneling</span>
                <span id="prog-net-val" class="font-mono-data text-mono-data text-[#4ade80] font-bold">100%</span>
              </div>
              <div class="h-2.5 w-full bg-[#1a2123] border border-[#1E293B] rounded-full overflow-hidden">
                <div id="prog-net-bar" class="h-full bg-[#4ade80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.4)] transition-all duration-700" style="width: 100%;"></div>
              </div>
              <p class="font-body-sm text-body-sm text-[#4ade80]/80 mt-1 text-[11px]">Connection re-established. Tunnels secure.</p>
            </div>
          </div>
        </div>

        <!-- Active Tasks (Spans 4 cols) -->
        <div class="col-span-12 lg:col-span-4 card-panel rounded-lg p-lg flex flex-col bg-[#121820] border border-outline-variant">
          <div class="flex justify-between items-center mb-md pb-sm border-b border-outline-variant/50">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-sm">
              <span class="material-symbols-outlined text-error text-[20px]">assignment_late</span>
              Active Recovery Tasks
            </h3>
            <span class="bg-error/10 text-error font-label-md text-[10px] px-2 py-0.5 rounded border border-error/20 font-bold">Action Needed</span>
          </div>

          <div class="space-y-sm overflow-y-auto pr-1 custom-scrollbar flex-1 max-h-[260px]">
            <div class="bg-surface-container-low border border-outline-variant/50 p-sm rounded hover:border-primary/50 transition-colors cursor-pointer group" onclick="alert('Task: Verify DNS routing tables')">
              <div class="flex justify-between items-start">
                <h4 class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-xs font-bold">Verify DNS Propagation</h4>
                <span class="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
              </div>
              <p class="font-body-sm text-[11px] text-on-surface-variant mt-1">Manual verification required for routing table update.</p>
            </div>

            <div class="bg-surface-container-low border border-outline-variant/50 p-sm rounded hover:border-primary/50 transition-colors cursor-pointer group" onclick="alert('Task: Auth key rotation initiated')">
              <div class="flex justify-between items-start">
                <h4 class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-xs font-bold">Auth Key Rotation</h4>
                <span class="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
              </div>
              <p class="font-body-sm text-[11px] text-on-surface-variant mt-1">Rotate legacy API keys for compromised segment C.</p>
            </div>

            <div class="bg-surface-container-low border border-outline-variant/50 p-sm rounded hover:border-primary/50 transition-colors cursor-pointer group" onclick="alert('Task: Admin consoles cleared')">
              <div class="flex justify-between items-start">
                <h4 class="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-xs font-bold">Unlock Admin Consoles</h4>
                <span class="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
              </div>
              <p class="font-body-sm text-[11px] text-on-surface-variant mt-1">Pending 2FA clearance from SOC Lead.</p>
            </div>
          </div>
        </div>

        <!-- Backup Health (Spans 6 cols) -->
        <div class="col-span-12 lg:col-span-6 card-panel rounded-lg p-lg bg-[#121820] border border-outline-variant">
          <div class="flex justify-between items-center mb-md pb-sm border-b border-outline-variant/50">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-sm">
              <span class="material-symbols-outlined text-primary text-[20px]">verified_user</span>
              Immutable Backup Health
            </h3>
            <button class="text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button>
          </div>

          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container border-b border-outline-variant/50">
                <th class="font-label-md text-[10px] text-on-surface-variant uppercase p-2">Target Volume</th>
                <th class="font-label-md text-[10px] text-on-surface-variant uppercase p-2">Last Snapshot</th>
                <th class="font-label-md text-[10px] text-on-surface-variant uppercase p-2 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody class="font-mono-data text-[12px] text-on-surface divide-y divide-outline-variant/30">
              <tr class="hover:bg-surface-container-low transition-colors">
                <td class="p-2 py-3 font-semibold">Core_DB_Cluster</td>
                <td class="p-2 py-3 text-on-surface-variant text-xs">12 mins ago</td>
                <td class="p-2 py-3 text-right">
                  <span class="bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded border border-[#4ade80]/20 text-[10px] uppercase font-bold">Verified</span>
                </td>
              </tr>
              <tr class="hover:bg-surface-container-low transition-colors">
                <td class="p-2 py-3 font-semibold">User_Auth_Logs</td>
                <td class="p-2 py-3 text-on-surface-variant text-xs">1 hr ago</td>
                <td class="p-2 py-3 text-right">
                  <span class="bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded border border-[#4ade80]/20 text-[10px] uppercase font-bold">Verified</span>
                </td>
              </tr>
              <tr class="hover:bg-surface-container-low transition-colors">
                <td class="p-2 py-3 font-semibold">Edge_Configs_US</td>
                <td class="p-2 py-3 text-on-surface-variant text-xs">4 hrs ago</td>
                <td class="p-2 py-3 text-right">
                  <span class="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded border border-tertiary/20 text-[10px] uppercase font-bold">Checking</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recovery Playbooks (Spans 6 cols) -->
        <div class="col-span-12 lg:col-span-6 card-panel rounded-lg p-lg bg-[#121820] border border-outline-variant">
          <div class="flex justify-between items-center mb-md pb-sm border-b border-outline-variant/50">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-sm">
              <span class="material-symbols-outlined text-primary text-[20px]">menu_book</span>
              Recovery SOP Playbooks
            </h3>
            <span class="font-label-md text-[10px] text-on-surface-variant uppercase bg-surface px-2 py-1 border border-outline-variant/50 rounded font-semibold">SOP Library</span>
          </div>

          <div class="grid grid-cols-2 gap-sm">
            <div class="bg-surface border border-outline-variant/50 p-sm rounded hover:border-primary transition-all cursor-pointer flex flex-col justify-between h-[80px]" onclick="alert('Executing SOP-RW-01: Ransomware Isolation Playbook')">
              <div class="flex justify-between">
                <span class="font-label-md text-[11px] text-on-surface uppercase font-bold">Ransomware Isolate</span>
                <span class="material-symbols-outlined text-on-surface-variant text-[14px]">open_in_new</span>
              </div>
              <span class="font-mono-data text-[10px] text-on-surface-variant">SOP-RW-01</span>
            </div>

            <div class="bg-surface border border-outline-variant/50 p-sm rounded hover:border-primary transition-all cursor-pointer flex flex-col justify-between h-[80px]" onclick="alert('Executing SOP-DD-04: DDoS Mitigation Playbook')">
              <div class="flex justify-between">
                <span class="font-label-md text-[11px] text-on-surface uppercase font-bold">DDoS Mitigation</span>
                <span class="material-symbols-outlined text-on-surface-variant text-[14px]">open_in_new</span>
              </div>
              <span class="font-mono-data text-[10px] text-on-surface-variant">SOP-DD-04</span>
            </div>

            <div class="bg-surface border border-outline-variant/50 p-sm rounded hover:border-primary transition-all cursor-pointer flex flex-col justify-between h-[80px]" onclick="alert('Executing SOP-EX-02: Data Exfiltration Halt Playbook')">
              <div class="flex justify-between">
                <span class="font-label-md text-[11px] text-on-surface uppercase font-bold">Data Exfil Halt</span>
                <span class="material-symbols-outlined text-on-surface-variant text-[14px]">open_in_new</span>
              </div>
              <span class="font-mono-data text-[10px] text-on-surface-variant">SOP-EX-02</span>
            </div>

            <div class="bg-surface border border-outline-variant/50 p-sm rounded hover:border-primary transition-all cursor-pointer flex flex-col justify-between h-[80px]">
              <div class="flex justify-between">
                <span class="font-label-md text-[11px] text-on-surface uppercase border-l-2 border-primary pl-1 font-bold">Failover Execution</span>
                <span class="material-symbols-outlined text-primary text-[14px]">play_arrow</span>
              </div>
              <span class="font-mono-data text-[10px] text-primary font-bold">Active Playbook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachRecoveryHandlers(container, state, refreshCallback) {
  const masterBtn = container.querySelector('#btn-master-recovery');
  if (masterBtn) {
    masterBtn.addEventListener('click', async () => {
      masterBtn.textContent = 'Restoring Systems...';
      masterBtn.disabled = true;
      showToast('Master Recovery Initiated', 'Restoring database shards, verifying agent checksums, and clearing firewall blocks...', 'info');

      // Animate progress bars
      const dbBar = container.querySelector('#prog-db-bar');
      const dbVal = container.querySelector('#prog-db-val');
      const epBar = container.querySelector('#prog-ep-bar');
      const epVal = container.querySelector('#prog-ep-val');

      if (dbBar) dbBar.style.width = '100%';
      if (dbVal) dbVal.textContent = '100%';
      if (epBar) epBar.style.width = '100%';
      if (epVal) epVal.textContent = '100%';

      await api.recoverAll();
      await refreshCallback();

      setTimeout(() => {
        showToast('All Systems Recovered', 'Infrastructure returned to Healthy / Nominal state. Security Score: 96/100.', 'success', 6000);
        masterBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span> Systems Restored';
      }, 1000);
    });
  }
}

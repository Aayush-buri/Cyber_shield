// CyberShield AI - Attack Simulation Lab View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderSimulator(state) {
  const history = state.simulationHistory || [
    { timestamp: '2026-08-17 14:32:01', scenario: 'Ransomware (T1486)', target: 'DB-Cluster-04', duration: '04m 12s', outcome: 'Defended' },
    { timestamp: '2026-08-17 10:15:44', scenario: 'Data Exfil (T1048)', target: 'Storage-Vol-B', duration: '11m 05s', outcome: 'Success (Breach)' },
    { timestamp: '2026-08-16 18:45:22', scenario: 'Brute Force (T1110)', target: 'Gateway-Edge-1', duration: '01m 45s', outcome: 'Defended' }
  ];

  const isSimActive = Boolean(state.active_simulation);
  const securityScore = state.security_score || 84;

  return `
    <div class="flex flex-col gap-lg">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-sm mb-xs">
        <div>
          <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">Attack Simulation Lab</h1>
          <p class="text-on-surface-variant font-body-md text-body-md">Proactive stress testing for critical infrastructure.</p>
        </div>
        <div class="flex gap-sm">
          <button id="btn-sim-reset-master" class="bg-surface-container-high border border-outline-variant text-on-surface px-md py-sm rounded text-label-md font-label-md hover:bg-surface-variant transition-colors flex items-center gap-xs font-semibold">
            <span class="material-symbols-outlined text-[16px]">restart_alt</span> Reset Demo
          </button>
          <a href="#logs" class="bg-primary-container text-black px-md py-sm rounded text-label-md font-label-md hover:bg-[#4cd6ff] transition-colors flex items-center gap-xs font-bold shadow-[0_0_15px_rgba(0,209,255,0.4)]">
            <span class="material-symbols-outlined text-[16px]">history</span> View Audit Logs
          </a>
        </div>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-md">
        <!-- Simulator Console (Left, 8 cols) -->
        <div class="col-span-12 lg:col-span-8 card-surface rounded-lg flex flex-col overflow-hidden relative border border-outline-variant bg-[#121820] min-h-[420px]">
          <div class="p-sm px-md border-b border-[#1E293B] bg-surface-container flex justify-between items-center z-10">
            <h2 class="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">Network Grid Console</h2>
            <div class="flex items-center gap-sm">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${isSimActive ? 'bg-error' : 'bg-[#00D1FF]'} opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${isSimActive ? 'bg-error' : 'bg-[#00D1FF]'}"></span>
              </span>
              <span class="text-xs ${isSimActive ? 'text-error font-bold animate-pulse' : 'text-on-surface-variant font-mono-data'}">
                ${isSimActive ? 'SIMULATION IN PROGRESS' : 'STANDBY READY'}
              </span>
            </div>
          </div>

          <div class="flex-1 grid-lines relative flex items-center justify-center p-lg bg-[#0A0E14]">
            <!-- Center Network Topology Grid representation -->
            <div class="relative w-full max-w-xl aspect-[16/10] border border-outline-variant/40 rounded-lg bg-surface/60 backdrop-blur-sm p-md flex flex-col justify-between shadow-2xl">
              <!-- Top Row Nodes -->
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 p-2 bg-surface-container-low border border-[#1E293B] rounded-lg">
                  <div class="w-9 h-9 rounded bg-surface-container flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">dns</span></div>
                  <div>
                    <div class="text-[11px] font-bold text-on-surface">MAIN-SRV</div>
                    <div class="text-[9px] font-mono-data text-on-surface-variant">192.168.1.100</div>
                  </div>
                </div>

                <div class="flex items-center gap-2 p-2 bg-surface-container-low border border-[#1E293B] rounded-lg">
                  <div class="w-9 h-9 rounded bg-surface-container flex items-center justify-center ${isSimActive ? 'text-error animate-pulse' : 'text-primary'}"><span class="material-symbols-outlined text-[20px]">database</span></div>
                  <div>
                    <div class="text-[11px] font-bold text-on-surface">DB-PROD-04</div>
                    <div class="text-[9px] font-mono-data text-on-surface-variant">10.0.5.22</div>
                  </div>
                </div>
              </div>

              <!-- Center Hub -->
              <div class="flex justify-center my-2">
                <div class="w-16 h-16 rounded-full border-2 ${isSimActive ? 'border-error/80 bg-error/10 text-error shadow-[0_0_20px_rgba(255,180,171,0.4)]' : 'border-[#00D1FF]/70 bg-[#00D1FF]/10 text-[#00D1FF] shadow-[0_0_20px_rgba(0,209,255,0.3)]'} flex items-center justify-center transition-all duration-500">
                  <span class="material-symbols-outlined text-[32px]">router</span>
                </div>
              </div>

              <!-- Bottom Row Nodes -->
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 p-2 bg-surface-container-low border border-[#1E293B] rounded-lg">
                  <div class="w-9 h-9 rounded bg-surface-container flex items-center justify-center text-on-surface-variant"><span class="material-symbols-outlined text-[20px]">desktop_windows</span></div>
                  <div>
                    <div class="text-[11px] font-bold text-on-surface">WKST-04</div>
                    <div class="text-[9px] font-mono-data text-on-surface-variant">192.168.1.104</div>
                  </div>
                </div>

                <div class="flex items-center gap-2 p-2 bg-surface-container-low border border-[#1E293B] rounded-lg">
                  <div class="w-9 h-9 rounded bg-surface-container flex items-center justify-center text-tertiary"><span class="material-symbols-outlined text-[20px]">water_drop</span></div>
                  <div>
                    <div class="text-[11px] font-bold text-on-surface">WTR-PLC-42</div>
                    <div class="text-[9px] font-mono-data text-on-surface-variant">10.0.5.42</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Control Panel & Impact (4 cols) -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-md">
          <!-- Control Panel -->
          <div class="card-surface rounded-lg flex flex-col border border-outline-variant bg-[#121820]">
            <div class="p-sm px-md border-b border-[#1E293B] bg-surface-container flex justify-between items-center">
              <h2 class="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">Deploy Simulation Scenario</h2>
            </div>
            <div class="p-md flex flex-col gap-sm">
              <!-- Scenario 1: Ransomware -->
              <button id="btn-sim-ransomware" class="w-full flex items-center justify-between p-sm border border-[#1E293B] bg-surface-container-low hover:bg-surface-container hover:border-error/50 transition-all rounded text-left group">
                <div class="flex items-center gap-md">
                  <div class="w-9 h-9 rounded bg-error/15 text-error flex items-center justify-center group-hover:bg-error/25 group-hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <div>
                    <div class="font-body-md text-on-surface font-bold text-xs">Ransomware Attack</div>
                    <div class="text-[10px] text-on-surface-variant font-mono-data">T1486: Data Encrypted for Impact</div>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-error transition-colors">play_circle</span>
              </button>

              <!-- Scenario 2: Brute Force -->
              <button id="btn-sim-bruteforce" class="w-full flex items-center justify-between p-sm border border-[#1E293B] bg-surface-container-low hover:bg-surface-container hover:border-tertiary/50 transition-all rounded text-left group">
                <div class="flex items-center gap-md">
                  <div class="w-9 h-9 rounded bg-tertiary/15 text-tertiary flex items-center justify-center group-hover:bg-tertiary/25 group-hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-[20px]">login</span>
                  </div>
                  <div>
                    <div class="font-body-md text-on-surface font-bold text-xs">Brute Force Entry</div>
                    <div class="text-[10px] text-on-surface-variant font-mono-data">T1110: Credential Access Storm</div>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">play_circle</span>
              </button>

              <!-- Scenario 3: Data Exfil -->
              <button id="btn-sim-exfiltration" class="w-full flex items-center justify-between p-sm border border-[#1E293B] bg-surface-container-low hover:bg-surface-container hover:border-primary/50 transition-all rounded text-left group">
                <div class="flex items-center gap-md">
                  <div class="w-9 h-9 rounded bg-primary/15 text-primary flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-[20px]">cloud_upload</span>
                  </div>
                  <div>
                    <div class="font-body-md text-on-surface font-bold text-xs">Data Exfiltration</div>
                    <div class="text-[10px] text-on-surface-variant font-mono-data">T1048: Bulk Table Extraction</div>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">play_circle</span>
              </button>

              <!-- Scenario 4: SCADA Intrusion -->
              <button id="btn-sim-intrusion" class="w-full flex items-center justify-between p-sm border border-[#1E293B] bg-surface-container-low hover:bg-surface-container hover:border-error/50 transition-all rounded text-left group">
                <div class="flex items-center gap-md">
                  <div class="w-9 h-9 rounded bg-error/15 text-error flex items-center justify-center group-hover:bg-error/25 group-hover:scale-105 transition-all">
                    <span class="material-symbols-outlined text-[20px]">settings_input_component</span>
                  </div>
                  <div>
                    <div class="font-body-md text-on-surface font-bold text-xs">Network Intrusion / SCADA</div>
                    <div class="text-[10px] text-on-surface-variant font-mono-data">T1498: Protocol Injection Attack</div>
                  </div>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant group-hover:text-error transition-colors">play_circle</span>
              </button>
            </div>
          </div>

          <!-- Impact Analysis -->
          <div class="card-surface rounded-lg flex flex-col border border-outline-variant bg-[#121820] p-md">
            <div class="flex justify-between items-center border-b border-outline-variant pb-sm mb-sm">
              <h2 class="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">Impact Analysis</h2>
              <span class="text-xs text-on-surface-variant font-mono-data">LIVE TELEMETRY</span>
            </div>
            
            <div class="flex justify-between items-end border-b border-outline-variant/30 pb-sm mb-sm">
              <div>
                <div class="text-[11px] text-on-surface-variant uppercase font-label-md">Security Score</div>
                <div class="font-headline-lg text-headline-lg font-bold text-on-surface leading-none mt-1">
                  ${securityScore}<span class="text-sm text-on-surface-variant ml-xs font-normal">/100</span>
                </div>
              </div>
              <div class="font-mono-data text-xs ${isSimActive ? 'bg-error/15 text-error border border-error/30' : 'bg-primary/10 text-primary border border-primary/20'} px-2 py-1 rounded font-bold">
                ${isSimActive ? '-42% (CRITICAL DROP)' : '+0.5% (STABLE)'}
              </div>
            </div>

            <!-- Mini Live Curve -->
            <div class="h-20 w-full relative flex items-end pt-2">
              <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path fill="none" stroke="${isSimActive ? '#ffb4ab' : '#00D1FF'}" stroke-width="2" d="${isSimActive ? 'M0,10 L30,12 L50,15 L70,35 L100,38' : 'M0,15 L20,14 L40,16 L60,13 L80,15 L100,12'}"></path>
              </svg>
            </div>
            <div class="w-full flex justify-between text-[10px] text-on-surface-variant font-mono-data border-t border-outline-variant/30 pt-1">
              <span>T-60s</span>
              <span>T-30s</span>
              <span>NOW</span>
            </div>
          </div>
        </div>

        <!-- Simulation History (Bottom, Full Width) -->
        <div class="col-span-12 card-surface rounded-lg flex flex-col border border-outline-variant bg-[#121820]">
          <div class="p-sm px-md border-b border-[#1E293B] bg-surface-container flex justify-between items-center">
            <h2 class="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">Simulation History & Outcomes</h2>
            <a href="#logs" class="text-xs text-primary hover:underline font-label-md">View Full Audit Log</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-on-surface-variant font-label-md text-xs uppercase tracking-wider border-b border-[#1E293B]">
                  <th class="p-sm px-md font-medium">Timestamp</th>
                  <th class="p-sm px-md font-medium">Scenario</th>
                  <th class="p-sm px-md font-medium">Target Asset</th>
                  <th class="p-sm px-md font-medium">Duration</th>
                  <th class="p-sm px-md font-medium text-right">Outcome</th>
                </tr>
              </thead>
              <tbody class="text-xs font-mono-data text-on-surface divide-y divide-[#1E293B]">
                ${history.map(row => `
                  <tr class="hover:bg-surface-container/50 transition-colors">
                    <td class="p-sm px-md text-on-surface-variant">${row.timestamp}</td>
                    <td class="p-sm px-md font-bold text-on-surface">${row.scenario}</td>
                    <td class="p-sm px-md">${row.target}</td>
                    <td class="p-sm px-md text-on-surface-variant">${row.duration}</td>
                    <td class="p-sm px-md text-right">
                      <span class="inline-flex items-center gap-xs px-2 py-0.5 rounded ${row.outcome.includes('Defended') ? 'bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20' : 'bg-error/10 text-error border border-error/20'} text-xs font-bold">
                        <span class="material-symbols-outlined text-[14px]">${row.outcome.includes('Defended') ? 'shield' : 'warning'}</span> ${row.outcome}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachSimulatorHandlers(container, state, refreshCallback) {
  // Ransomware Trigger
  const rwBtn = container.querySelector('#btn-sim-ransomware');
  if (rwBtn) {
    rwBtn.addEventListener('click', async () => {
      showToast('Deploying Attack...', 'Injecting Ransomware payload telemetry into DB-PROD-04 Cluster.', 'critical');
      await api.simulateAttack('ransomware', 'db-prod-04');
      await refreshCallback();
      showToast('CRITICAL ALERT: Ransomware Detected', 'T1486 LockBit encryption sequence intercepted. Incident created.', 'critical', 6000);
      window.location.hash = '#incidents';
    });
  }

  // Brute Force Trigger
  const bfBtn = container.querySelector('#btn-sim-bruteforce');
  if (bfBtn) {
    bfBtn.addEventListener('click', async () => {
      showToast('Deploying Attack...', 'Initiating 1,850 failed authentications/sec against Gateway.', 'warning');
      await api.simulateAttack('bruteforce', 'comms-relay');
      await refreshCallback();
      showToast('WARNING: Auth Storm Flagged', 'T1110 Credential spraying anomaly detected on Gateway.', 'warning');
      window.location.hash = '#threats';
    });
  }

  // Data Exfiltration Trigger
  const exfilBtn = container.querySelector('#btn-sim-exfiltration');
  if (exfilBtn) {
    exfilBtn.addEventListener('click', async () => {
      showToast('Deploying Attack...', 'Starting 5.4 GB anomalous data export to external C2 drop.', 'critical');
      await api.simulateAttack('exfiltration', 'db-prod-04');
      await refreshCallback();
      showToast('CRITICAL: Data Exfiltration Intercepted', 'DPI flagged unauthorized external transmission. Incident active.', 'critical');
      window.location.hash = '#incidents';
    });
  }

  // SCADA Intrusion Trigger
  const scadaBtn = container.querySelector('#btn-sim-intrusion');
  if (scadaBtn) {
    scadaBtn.addEventListener('click', async () => {
      showToast('Deploying Attack...', 'Injecting Modbus setpoint override packet sequence into Water PLC.', 'critical');
      await api.simulateAttack('intrusion', 'wtr-scada-42');
      await refreshCallback();
      showToast('CRITICAL: SCADA Protocol Deviation', 'Industrial controller anomaly detected. Isolation recommended.', 'critical');
      window.location.hash = '#infrastructure';
    });
  }

  // Master Reset Trigger
  const resetBtn = container.querySelector('#btn-sim-reset-master');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      await api.resetSimulation();
      showToast('Simulation Reset', 'All infrastructure restored to Nominal. Security Score is 84/100.', 'success');
      await refreshCallback();
    });
  }
}

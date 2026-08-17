// CyberShield AI - Incident Details & 4-Stage Lifecycle View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderIncidentDetails(state) {
  const incidents = state.incidents || [];
  const activeId = state.activeIncidentId || (incidents[0] ? incidents[0].id : 'INC-8492');
  const incident = incidents.find(i => i.id === activeId) || incidents[0] || {
    id: 'INC-8492',
    title: 'Anomalous Data Exfiltration',
    description: 'Detected via Deep Packet Inspection on Gateway Alpha. High confidence of data exfiltration to unauthorized external IP.',
    threat_type: 'Data Exfiltration (T1048)',
    mitre_id: 'T1048',
    severity: 'Critical',
    risk_score: 88,
    confidence: 94,
    affected_asset_id: 'db-prod-04',
    affected_asset_name: 'DB-PROD-04',
    affected_asset_ip: '10.0.5.22',
    affected_asset_os: 'Linux Kernel 5.15 / RHEL 9',
    affected_asset_owner: 'Data Eng Team',
    stage: 'contain',
    status: 'Active',
    indicators: [],
    timeline: [],
    response_actions: []
  };

  const stage = incident.stage || 'contain';
  let progressWidth = '25%';
  if (stage === 'detect') progressWidth = '50%';
  if (stage === 'contain') progressWidth = '75%';
  if (stage === 'recover') progressWidth = '100%';

  return `
    <div class="flex flex-col gap-lg">
      <!-- Incident Switcher Bar -->
      ${incidents.length > 1 ? `
        <div class="flex items-center gap-sm p-2 bg-surface-container rounded-lg border border-outline-variant/60 overflow-x-auto custom-scrollbar">
          <span class="text-[11px] font-mono-data text-on-surface-variant uppercase px-2 font-bold whitespace-nowrap">Active Incidents:</span>
          ${incidents.map(inc => {
            const isSel = inc.id === activeId;
            return `
              <button class="btn-switch-inc px-3 py-1 rounded text-xs font-mono-data font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${isSel ? 'bg-primary text-black shadow-[0_0_10px_rgba(0,209,255,0.4)]' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant border border-outline-variant/40'}" data-inc-id="${inc.id}">
                <span class="w-1.5 h-1.5 rounded-full ${inc.severity === 'Critical' ? 'bg-error' : 'bg-tertiary'}"></span>
                <span>${inc.id}</span>
                <span class="text-[10px] opacity-80">(${inc.status})</span>
              </button>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Incident Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
        <div>
          <div class="flex items-center gap-sm mb-xs">
            <span class="font-mono-data text-mono-data text-on-surface-variant font-bold">${incident.id}</span>
            <span class="soc-badge-critical text-xs uppercase px-2 py-0.5 font-bold">${incident.severity} Threat</span>
            <span class="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 rounded font-mono-data font-bold">${incident.status}</span>
            <span class="text-xs text-on-surface-variant font-mono-data">Confidence: ${incident.confidence}%</span>
          </div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">${incident.title}</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1 max-w-4xl">${incident.description}</p>
        </div>
        <div class="flex gap-sm">
          <button id="btn-export-incident" class="soc-button-ghost flex items-center gap-sm text-xs font-semibold">
            <span class="material-symbols-outlined text-[16px]">ios_share</span> Export Report
          </button>
          <button id="btn-assign-analyst" class="soc-button-primary flex items-center gap-sm text-xs font-bold shadow-[0_0_12px_rgba(0,209,255,0.3)]">
            <span class="material-symbols-outlined text-[16px]">shield_person</span> Assign Analyst
          </button>
        </div>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-12 gap-lg">
        <!-- Left 8 Cols: 4-Stage Lifecycle, Tactical Analysis & Timeline -->
        <div class="col-span-12 lg:col-span-8 flex flex-col gap-lg">
          <!-- 4-Stage Lifecycle Stepper -->
          <div class="soc-card p-md bg-surface-container-low border border-outline-variant rounded-lg">
            <div class="flex justify-between items-center mb-lg">
              <div>
                <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Incident Response Lifecycle</h3>
                <p class="text-xs text-on-surface-variant">Deterministic progression: Predict → Detect → Contain → Recover</p>
              </div>
              <span class="font-mono-data text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded border border-primary/20">STAGE: ${stage.toUpperCase()}</span>
            </div>
            
            <div class="relative px-lg py-md mb-sm">
              <div class="timeline-line"></div>
              <div class="timeline-progress" style="width: ${progressWidth};"></div>

              <div class="relative z-10 flex justify-between items-center w-full">
                <!-- Predict -->
                <div class="flex flex-col items-center gap-sm">
                  <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shadow-[0_0_8px_rgba(0,209,255,0.3)]">
                    <span class="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface font-semibold text-xs">Predict</span>
                </div>

                <!-- Detect -->
                <div class="flex flex-col items-center gap-sm">
                  <div class="w-8 h-8 rounded-full ${stage !== 'predict' ? 'bg-primary-container text-on-primary-container shadow-[0_0_8px_rgba(0,209,255,0.3)]' : 'bg-surface border border-outline-variant text-on-surface-variant'} flex items-center justify-center font-bold">
                    <span class="material-symbols-outlined text-[18px]">${stage !== 'predict' ? 'check' : 'radar'}</span>
                  </div>
                  <span class="font-label-md text-label-md text-on-surface font-semibold text-xs">Detect</span>
                </div>

                <!-- Contain (Active / Completed) -->
                <div class="flex flex-col items-center gap-sm">
                  <div class="w-8 h-8 rounded-full ${stage === 'contain' ? 'bg-surface border-2 border-primary-container text-primary-container animate-pulse' : stage === 'recover' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'} flex items-center justify-center font-bold shadow-[0_0_10px_rgba(0,209,255,0.4)]">
                    <span class="material-symbols-outlined text-[18px]">${stage === 'recover' ? 'check' : 'radio_button_checked'}</span>
                  </div>
                  <span class="font-label-md text-label-md ${stage === 'contain' ? 'text-primary-container font-bold' : 'text-on-surface'} text-xs">Contain</span>
                </div>

                <!-- Recover -->
                <div class="flex flex-col items-center gap-sm">
                  <div class="w-8 h-8 rounded-full ${stage === 'recover' ? 'bg-primary text-black font-bold animate-pulse shadow-[0_0_12px_rgba(0,209,255,0.5)]' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'} flex items-center justify-center font-bold">
                    <span class="material-symbols-outlined text-[18px]">healing</span>
                  </div>
                  <span class="font-label-md text-label-md ${stage === 'recover' ? 'text-primary font-bold' : 'text-on-surface-variant'} text-xs">Recover</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tactical Analysis (IoCs Table) -->
          <div class="soc-card bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
            <div class="soc-header-row px-md py-sm flex justify-between items-center bg-surface-container">
              <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Tactical Analysis & Indicators of Compromise</h3>
              <span class="font-label-md text-label-md text-on-surface-variant text-xs">${(incident.indicators || []).length} Verified Indicators</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr class="border-b border-outline-variant text-on-surface-variant bg-surface-container/50 text-xs">
                    <th class="px-md py-sm font-label-md font-medium">Type</th>
                    <th class="px-md py-sm font-label-md font-medium">Indicator Value</th>
                    <th class="px-md py-sm font-label-md font-medium">Confidence</th>
                    <th class="px-md py-sm font-label-md font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-xs">
                  ${(incident.indicators || []).map(ind => `
                    <tr class="border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td class="px-md py-sm flex items-center gap-sm text-on-surface font-semibold">
                        <span class="material-symbols-outlined text-[16px] text-primary">lan</span> ${ind.type}
                      </td>
                      <td class="px-md py-sm font-mono-data text-mono-data text-on-surface">${ind.value}</td>
                      <td class="px-md py-sm">
                        <div class="flex items-center gap-xs text-error font-bold">
                          <span class="material-symbols-outlined text-[16px]">warning</span> ${ind.confidence}
                        </div>
                      </td>
                      <td class="px-md py-sm text-right">
                        <button class="text-primary hover:text-primary-container font-bold uppercase text-[11px] transition-colors" onclick="alert('Analyzing IoC: ${ind.value}')">Analyze</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Incident Timeline Details -->
          <div class="soc-card bg-surface-container-low border border-outline-variant rounded-lg p-md">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface mb-md">Timeline Audit Trail</h3>
            <div class="space-y-sm">
              ${(incident.timeline || []).map(ev => `
                <div class="flex items-start gap-md p-sm bg-surface-container rounded border border-outline-variant/40">
                  <span class="font-mono-data text-xs text-primary font-bold min-w-[70px]">${ev.time}</span>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-on-surface">${ev.title}</span>
                      <span class="text-[10px] font-mono-data px-1.5 py-0.2 bg-surface-variant text-on-surface-variant rounded">${ev.stage}</span>
                    </div>
                    <p class="text-xs text-on-surface-variant mt-0.5">${ev.description}</p>
                  </div>
                  <span class="text-[10px] font-mono-data font-bold ${ev.status === 'Completed' ? 'text-[#4ade80]' : ev.status === 'Active' ? 'text-primary animate-pulse' : 'text-on-surface-variant'}">${ev.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right 4 Cols: Affected Asset, Automated Response, Recovery Controls -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <!-- Affected Asset Overview -->
          <div class="soc-card p-md bg-surface-container-low border border-outline-variant rounded-lg">
            <h3 class="font-title-lg text-title-lg font-bold text-on-surface mb-md">Affected Asset Target</h3>
            <div class="flex items-center gap-md mb-md">
              <div class="w-12 h-12 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary shadow-[0_0_10px_rgba(0,209,255,0.3)]">
                <span class="material-symbols-outlined text-[24px]">dns</span>
              </div>
              <div>
                <div class="font-headline-sm text-headline-sm font-bold text-on-surface">${incident.affected_asset_name}</div>
                <div class="font-mono-data text-mono-data text-on-surface-variant text-xs">${incident.affected_asset_ip}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-sm mb-sm">
              <div class="bg-surface-container p-sm rounded border border-outline-variant/60">
                <div class="font-label-md text-label-md text-on-surface-variant text-[11px]">OS / Platform</div>
                <div class="font-body-sm text-body-sm text-on-surface text-xs font-semibold">${incident.affected_asset_os}</div>
              </div>
              <div class="bg-surface-container p-sm rounded border border-outline-variant/60">
                <div class="font-label-md text-label-md text-on-surface-variant text-[11px]">Custodian / Team</div>
                <div class="font-body-sm text-body-sm text-on-surface text-xs font-semibold">${incident.affected_asset_owner}</div>
              </div>
            </div>
          </div>

          <!-- Automated Response Actions -->
          <div class="soc-card bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
            <div class="soc-header-row px-md py-sm bg-surface-container">
              <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Response & Containment Actions</h3>
            </div>
            <div class="p-md flex flex-col gap-sm">
              <button id="btn-contain-isolate" class="soc-button-destructive flex justify-center items-center gap-sm w-full py-2 text-xs font-bold shadow-[0_0_10px_rgba(255,180,171,0.2)]">
                <span class="material-symbols-outlined text-[18px]">gpp_bad</span> Isolate Asset Immediately
              </button>
              <button id="btn-contain-block-ip" class="soc-button-ghost border-error text-error hover:bg-error-container hover:text-on-error-container transition-colors flex justify-center items-center gap-sm w-full py-2 text-xs font-bold">
                <span class="material-symbols-outlined text-[18px]">block</span> Block Destination IP at Firewall
              </button>
              <button id="btn-contain-reset-creds" class="soc-button-ghost flex justify-center items-center gap-sm w-full py-2 text-xs font-bold">
                <span class="material-symbols-outlined text-[18px]">key</span> Force Credential Invalidation
              </button>
            </div>
          </div>

          <!-- Recovery Plan & Playbook -->
          <div class="soc-card bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
            <div class="soc-header-row px-md py-sm flex justify-between items-center bg-surface-container">
              <h3 class="font-title-lg text-title-lg font-bold text-on-surface">Recovery Execution</h3>
              <span class="material-symbols-outlined text-on-surface-variant">healing</span>
            </div>
            <div class="p-md">
              <p class="font-body-sm text-xs text-on-surface-variant mb-md leading-relaxed">
                Pre-approved automated recovery playbook is ready to restore system baseline once host containment is verified.
              </p>
              <button id="btn-trigger-recovery" class="soc-button-primary w-full flex justify-center items-center gap-sm py-2 text-xs font-bold shadow-[0_0_15px_rgba(0,209,255,0.4)]">
                Initiate Recovery Playbook <span class="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachIncidentDetailsHandlers(container, state, refreshCallback) {
  // Incident Switcher buttons
  container.querySelectorAll('.btn-switch-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const incId = btn.getAttribute('data-inc-id');
      state.activeIncidentId = incId;
      refreshCallback();
    });
  });

  const isolateBtn = container.querySelector('#btn-contain-isolate');
  if (isolateBtn) {
    isolateBtn.addEventListener('click', async () => {
      isolateBtn.textContent = 'Quarantining...';
      isolateBtn.disabled = true;
      const inc = state.incidents.find(i => i.id === state.activeIncidentId) || state.incidents[0];
      if (inc) {
        await api.containDevice(inc.affected_asset_id);
        showToast('Containment Executed', `Asset ${inc.affected_asset_name} is now isolated. Threat quarantined.`, 'critical');
        await refreshCallback();
      }
    });
  }

  const blockIpBtn = container.querySelector('#btn-contain-block-ip');
  if (blockIpBtn) {
    blockIpBtn.addEventListener('click', () => {
      showToast('Firewall Rule Applied', 'Drop rule injected into perimeter firewall tables. Traffic dropped.', 'warning');
    });
  }

  const resetCredsBtn = container.querySelector('#btn-contain-reset-creds');
  if (resetCredsBtn) {
    resetCredsBtn.addEventListener('click', () => {
      showToast('Credentials Invalidated', 'Kerberos and JWT tokens revoked for target service accounts.', 'info');
    });
  }

  const recoveryBtn = container.querySelector('#btn-trigger-recovery');
  if (recoveryBtn) {
    recoveryBtn.addEventListener('click', async () => {
      const inc = state.incidents.find(i => i.id === state.activeIncidentId) || state.incidents[0];
      if (inc) {
        recoveryBtn.textContent = 'Initiating Recovery...';
        recoveryBtn.disabled = true;
        await api.recoverDevice(inc.affected_asset_id);
        showToast('Recovery Playbook Executed', `${inc.affected_asset_name} recovered from immutable backup snapshot.`, 'success');
        window.location.hash = '#recovery';
        await refreshCallback();
      }
    });
  }

  const exportBtn = container.querySelector('#btn-export-incident');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const inc = state.incidents.find(i => i.id === state.activeIncidentId) || state.incidents[0];
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inc, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `incident-${inc.id}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Incident Report Exported', `JSON export generated for ${inc.id}.`, 'success');
    });
  }
}

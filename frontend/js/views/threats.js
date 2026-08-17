// CyberShield AI - Threat Intelligence & Prediction Matrix View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderThreats(state) {
  const threats = state.threats || [];

  return `
    <div class="flex flex-col gap-lg">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-sm mb-sm">
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">Threat Intelligence & Prediction</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-xs">Real-time monitoring and AI-driven forecasting of attack vectors.</p>
        </div>
        <div class="flex gap-sm">
          <button id="btn-export-threats" class="btn-ghost px-md py-sm rounded flex items-center gap-xs font-label-md text-label-md">
            <span class="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
          <a href="#simulator" class="btn-primary px-md py-sm rounded flex items-center gap-xs font-label-md text-label-md font-bold shadow-[0_0_15px_rgba(0,209,255,0.4)]">
            <span class="material-symbols-outlined text-[18px]">model_training</span> Attack Lab
          </a>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-md">
        <!-- Active Threat Cards (Left Col) -->
        <div class="xl:col-span-4 flex flex-col gap-md">
          <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-xs">
            <span class="material-symbols-outlined text-error">warning</span> Active Threat Signals
          </h3>

          ${threats.map(threat => {
            const isCrit = threat.ai_confidence >= 80 || threat.risk_score >= 8;
            const borderCol = isCrit ? 'bg-error' : 'bg-tertiary-container';
            const badgeClass = isCrit ? 'status-critical' : 'status-warning';

            return `
              <div class="card-surface rounded-lg p-md flex flex-col gap-sm relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-1.5 h-full ${borderCol}"></div>
                <div class="flex justify-between items-start pl-1">
                  <span class="${badgeClass} px-2 py-0.5 rounded font-label-md text-label-md inline-block font-bold">
                    ${isCrit ? 'CRITICAL' : 'WARNING'}
                  </span>
                  <span class="font-mono-data text-mono-data text-on-surface-variant text-xs">${threat.detected_at}</span>
                </div>
                <h4 class="font-title-lg text-title-lg font-semibold text-on-surface mt-xs pl-1">${threat.attack_type}</h4>
                <p class="font-body-sm text-body-sm text-on-surface-variant pl-1 leading-relaxed">${threat.description}</p>
                <div class="flex gap-sm mt-sm pl-1">
                  <a href="#incidents" class="btn-ghost px-sm py-1.5 rounded font-label-md text-label-md flex-1 text-center text-xs">
                    Analyze
                  </a>
                  <button data-action="isolate" data-asset-id="${threat.affected_asset_id}" class="btn-isolate-threat ${isCrit ? 'btn-primary bg-error text-on-error hover:bg-[#ffb4ab]/80' : 'btn-ghost border-tertiary-container text-tertiary-container hover:bg-tertiary-container/10'} px-sm py-1.5 rounded font-label-md text-label-md flex-1 text-xs font-bold">
                    ${isCrit ? 'Isolate' : 'Mitigate'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Right Col: AI Threat Prediction Matrix & Flow -->
        <div class="xl:col-span-8 flex flex-col gap-md">
          <!-- Threat Prediction Table -->
          <div class="card-surface rounded-lg flex flex-col">
            <div class="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low rounded-t-lg">
              <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-xs">
                <span class="material-symbols-outlined text-primary">online_prediction</span> AI Threat Prediction Matrix
              </h3>
              <div class="focus-glow flex items-center bg-surface-container px-sm py-1 rounded border border-outline-variant">
                <span class="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
                <input id="filter-predictions" class="bg-transparent border-none text-on-surface font-body-sm text-xs focus:ring-0 w-40 placeholder:text-on-surface-variant" placeholder="Filter predictions..." type="text"/>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant bg-surface-container-lowest font-label-md text-label-md text-on-surface-variant uppercase text-xs">
                    <th class="p-md font-semibold">Attack Type</th>
                    <th class="p-md font-semibold text-center">AI Confidence</th>
                    <th class="p-md font-semibold text-center">Risk Score</th>
                    <th class="p-md font-semibold">Affected Asset</th>
                    <th class="p-md font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="font-mono-data text-mono-data text-xs">
                  ${threats.map(threat => {
                    const isHigh = threat.ai_confidence >= 80;
                    const confColor = isHigh ? 'text-error' : 'text-tertiary-container';
                    const barBg = isHigh ? 'bg-error' : 'bg-tertiary-container';
                    const badgeBg = isHigh ? 'bg-error/20 text-error border-error/30' : 'bg-tertiary-container/20 text-tertiary-container border-tertiary-container/30';
                    let icon = 'lock';
                    if (threat.attack_type.includes('DDoS')) icon = 'router';
                    if (threat.attack_type.includes('Exfil')) icon = 'cloud_upload';
                    if (threat.attack_type.includes('Brute')) icon = 'login';

                    return `
                      <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                        <td class="p-md flex items-center gap-sm">
                          <span class="material-symbols-outlined ${confColor} text-[18px]">${icon}</span>
                          <span class="text-on-surface font-semibold">${threat.attack_type}</span>
                        </td>
                        <td class="p-md text-center">
                          <div class="inline-flex items-center gap-xs">
                            <span class="${confColor} font-bold">${threat.ai_confidence}%</span>
                            <div class="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                              <div class="h-full ${barBg}" style="width: ${threat.ai_confidence}%"></div>
                            </div>
                          </div>
                        </td>
                        <td class="p-md text-center">
                          <span class="inline-block w-6 h-6 rounded ${badgeBg} border leading-6 text-center font-bold">
                            ${threat.risk_score}
                          </span>
                        </td>
                        <td class="p-md text-on-surface-variant">${threat.affected_asset_name}</td>
                        <td class="p-md text-right">
                          <a href="#incidents" class="text-primary hover:text-primary-fixed transition-colors font-bold uppercase text-[11px]">Analyze</a>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Incident Timeline Box (4-Stage Preview) -->
          <div class="card-surface rounded-lg p-md mt-xs flex flex-col gap-md">
            <div class="flex justify-between items-center border-b border-outline-variant pb-sm">
              <h3 class="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-xs">
                <span class="material-symbols-outlined text-primary">timeline</span> Active Threat Progression Lifecycle
              </h3>
              <span class="font-mono-data text-mono-data text-on-surface-variant text-xs">Real-time Stage Sync</span>
            </div>
            
            <div class="relative w-full py-lg px-md">
              <div class="timeline-line"></div>
              <div class="timeline-progress" style="width: 75%;"></div>

              <div class="relative z-10 flex justify-between w-full">
                <!-- Predict -->
                <div class="flex flex-col items-center gap-xs">
                  <div class="w-10 h-10 rounded-full bg-surface border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_10px_rgba(0,209,255,0.4)]">
                    <span class="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <div class="text-center">
                    <span class="font-label-md text-label-md text-on-surface font-semibold block text-xs">Predict</span>
                    <span class="font-mono-data text-on-surface-variant text-[10px]">T-15m</span>
                  </div>
                </div>

                <!-- Detect -->
                <div class="flex flex-col items-center gap-xs">
                  <div class="w-10 h-10 rounded-full bg-surface border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_10px_rgba(0,209,255,0.4)]">
                    <span class="material-symbols-outlined text-[20px]">radar</span>
                  </div>
                  <div class="text-center">
                    <span class="font-label-md text-label-md text-on-surface font-semibold block text-xs">Detect</span>
                    <span class="font-mono-data text-on-surface-variant text-[10px]">T-05m</span>
                  </div>
                </div>

                <!-- Contain -->
                <div class="flex flex-col items-center gap-xs">
                  <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(0,209,255,0.6)] animate-pulse">
                    <span class="material-symbols-outlined text-[20px]">gpp_bad</span>
                  </div>
                  <div class="text-center">
                    <span class="font-label-md text-label-md text-primary font-bold block text-xs">Contain</span>
                    <span class="font-mono-data text-primary text-[10px] font-bold">Active</span>
                  </div>
                </div>

                <!-- Recover -->
                <div class="flex flex-col items-center gap-xs opacity-60">
                  <div class="w-10 h-10 rounded-full bg-surface border-2 border-outline-variant flex items-center justify-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-[20px]">healing</span>
                  </div>
                  <div class="text-center">
                    <span class="font-label-md text-label-md text-on-surface-variant block text-xs">Recover</span>
                    <span class="font-mono-data text-on-surface-variant text-[10px]">Playbook Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachThreatsHandlers(container, state, refreshCallback) {
  container.querySelectorAll('.btn-isolate-threat').forEach(btn => {
    btn.addEventListener('click', async () => {
      const assetId = btn.getAttribute('data-asset-id');
      btn.textContent = 'Isolating...';
      btn.disabled = true;
      await api.containDevice(assetId);
      showToast('Threat Contained', `Asset ${assetId} isolated and quarantine playbook initiated.`, 'critical');
      await refreshCallback();
    });
  });
}

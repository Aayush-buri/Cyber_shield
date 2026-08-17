// CyberShield AI - Logs & Audit Trail View
import * as api from '../api.js';
import { showToast } from '../components/toast.js';

export function renderLogs(state) {
  const logs = state.logs || [];

  return `
    <div class="flex flex-col gap-lg">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">SOC Audit Trail & Event Logs</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1">Real-time immutable telemetry logs, authentication events, and firewall drops.</p>
        </div>
        <div class="flex gap-sm">
          <button id="btn-export-logs-csv" class="btn-ghost px-md py-sm rounded flex items-center gap-xs font-label-md text-label-md">
            <span class="material-symbols-outlined text-[18px]">download</span> Export CSV
          </button>
          <button id="btn-export-logs-json" class="btn-primary px-md py-sm rounded flex items-center gap-xs font-label-md text-label-md font-bold shadow-[0_0_12px_rgba(0,209,255,0.3)]">
            <span class="material-symbols-outlined text-[18px]">data_object</span> Export JSON
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="card-surface p-md rounded-lg flex flex-col sm:flex-row justify-between items-center gap-md bg-[#121820] border border-outline-variant">
        <div class="flex flex-wrap items-center gap-xs w-full sm:w-auto">
          <button class="log-filter-btn px-3 py-1 rounded text-xs font-bold bg-primary text-black" data-level="">All Logs</button>
          <button class="log-filter-btn px-3 py-1 rounded text-xs font-medium bg-surface-container hover:bg-surface-container-high text-error border border-error/30" data-level="CRITICAL">Critical Only</button>
          <button class="log-filter-btn px-3 py-1 rounded text-xs font-medium bg-surface-container hover:bg-surface-container-high text-tertiary-container border border-tertiary-container/30" data-level="WARNING">Warnings</button>
          <button class="log-filter-btn px-3 py-1 rounded text-xs font-medium bg-surface-container hover:bg-surface-container-high text-on-surface-variant" data-level="INFO">Info</button>
        </div>

        <div class="focus-glow flex items-center bg-surface-container px-sm py-1.5 rounded border border-outline-variant w-full sm:w-72">
          <span class="material-symbols-outlined text-on-surface-variant text-[16px] mr-1">search</span>
          <input id="logs-search-input" class="bg-transparent border-none text-on-surface font-body-sm text-xs focus:ring-0 w-full placeholder:text-on-surface-variant" placeholder="Search IP, host, or action..." type="text"/>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="card-surface rounded-lg flex flex-col overflow-hidden bg-[#121820] border border-outline-variant">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest font-label-md text-label-md text-on-surface-variant uppercase text-xs">
                <th class="p-md font-semibold">Timestamp</th>
                <th class="p-md font-semibold">Source IP</th>
                <th class="p-md font-semibold">Host / Entity</th>
                <th class="p-md font-semibold">Activity Type</th>
                <th class="p-md font-semibold">Status</th>
                <th class="p-md font-semibold">Details</th>
                <th class="p-md font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="logs-table-body" class="font-mono-data text-xs text-on-surface divide-y divide-outline-variant/30">
              ${logs.map(log => {
                let badge = 'bg-surface-variant text-on-surface border-outline-variant';
                if (log.status === 'CRITICAL') {
                  badge = 'bg-error/15 text-error border-error/30 font-bold';
                } else if (log.status === 'WARNING') {
                  badge = 'bg-tertiary-container/15 text-tertiary-fixed-dim border-tertiary-container/30 font-bold';
                } else if (log.status === 'CONTAINED') {
                  badge = 'bg-[#00D1FF]/15 text-[#00D1FF] border-[#00D1FF]/30 font-bold';
                }

                return `
                  <tr class="hover:bg-surface-container/50 transition-colors">
                    <td class="p-md text-on-surface-variant whitespace-nowrap">${log.timestamp}</td>
                    <td class="p-md font-bold text-on-surface whitespace-nowrap">${log.source_ip}</td>
                    <td class="p-md text-primary font-semibold whitespace-nowrap">${log.host_name}</td>
                    <td class="p-md font-bold text-on-surface">${log.activity_type}</td>
                    <td class="p-md">
                      <span class="px-2 py-0.5 rounded border text-[11px] ${badge}">
                        ${log.status}
                      </span>
                    </td>
                    <td class="p-md text-on-surface-variant font-sans text-xs">${log.details}</td>
                    <td class="p-md text-right">
                      ${log.action_available === 'Isolate' ? `
                        <button class="btn-isolate-log bg-error text-on-error px-2.5 py-1 rounded text-[11px] font-bold hover:bg-error/80 transition-colors" data-ip="${log.source_ip}">
                          Isolate
                        </button>
                      ` : `
                        <a href="#incidents" class="text-primary hover:underline text-[11px] font-bold uppercase">Inspect</a>
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

export function attachLogsHandlers(container, state, refreshCallback) {
  const searchInput = container.querySelector('#logs-search-input');
  const filterBtns = container.querySelectorAll('.log-filter-btn');

  let currentLevel = '';
  let currentSearch = '';

  const applyFilters = async () => {
    const logs = await api.fetchLogs(currentLevel || null, currentSearch || null);
    state.logs = logs;
    const tbody = container.querySelector('#logs-table-body');
    if (tbody) {
      tbody.innerHTML = logs.map(log => {
        let badge = 'bg-surface-variant text-on-surface border-outline-variant';
        if (log.status === 'CRITICAL') {
          badge = 'bg-error/15 text-error border-error/30 font-bold';
        } else if (log.status === 'WARNING') {
          badge = 'bg-tertiary-container/15 text-tertiary-fixed-dim border-tertiary-container/30 font-bold';
        } else if (log.status === 'CONTAINED') {
          badge = 'bg-[#00D1FF]/15 text-[#00D1FF] border-[#00D1FF]/30 font-bold';
        }

        return `
          <tr class="hover:bg-surface-container/50 transition-colors">
            <td class="p-md text-on-surface-variant whitespace-nowrap">${log.timestamp}</td>
            <td class="p-md font-bold text-on-surface whitespace-nowrap">${log.source_ip}</td>
            <td class="p-md text-primary font-semibold whitespace-nowrap">${log.host_name}</td>
            <td class="p-md font-bold text-on-surface">${log.activity_type}</td>
            <td class="p-md">
              <span class="px-2 py-0.5 rounded border text-[11px] ${badge}">
                ${log.status}
              </span>
            </td>
            <td class="p-md text-on-surface-variant font-sans text-xs">${log.details}</td>
            <td class="p-md text-right">
              ${log.action_available === 'Isolate' ? `
                <button class="btn-isolate-log bg-error text-on-error px-2.5 py-1 rounded text-[11px] font-bold hover:bg-error/80 transition-colors" data-ip="${log.source_ip}">
                  Isolate
                </button>
              ` : `
                <a href="#incidents" class="text-primary hover:underline text-[11px] font-bold uppercase">Inspect</a>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      applyFilters();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.className = 'log-filter-btn px-3 py-1 rounded text-xs font-medium bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant';
      });
      btn.className = 'log-filter-btn px-3 py-1 rounded text-xs font-bold bg-primary text-black';
      currentLevel = btn.getAttribute('data-level');
      applyFilters();
    });
  });

  const exportCsv = container.querySelector('#btn-export-logs-csv');
  if (exportCsv) {
    exportCsv.addEventListener('click', () => {
      let csv = 'Timestamp,Source IP,Host,Activity Type,Status,Details\n';
      (state.logs || []).forEach(l => {
        csv += `"${l.timestamp}","${l.source_ip}","${l.host_name}","${l.activity_type}","${l.status}","${l.details}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cybershield-soc-logs-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('CSV Export Ready', 'Event logs exported to CSV file.', 'success');
    });
  }

  const exportJson = container.querySelector('#btn-export-logs-json');
  if (exportJson) {
    exportJson.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.logs || [], null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `cybershield-soc-logs-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('JSON Export Ready', 'Event logs exported to JSON file.', 'success');
    });
  }
}

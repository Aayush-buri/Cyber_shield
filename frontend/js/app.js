// CyberShield AI - Main Single-Page Application (SPA) Controller
import { store } from './store.js';
import * as api from './api.js';
import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { showToast } from './components/toast.js';

import { renderOverview, attachOverviewHandlers } from './views/overview.js';
import { renderMonitoring, attachMonitoringHandlers } from './views/monitoring.js';
import { renderInfrastructure, attachInfrastructureHandlers } from './views/infrastructure.js';
import { renderThreats, attachThreatsHandlers } from './views/threats.js';
import { renderIncidentDetails, attachIncidentDetailsHandlers } from './views/incidentDetails.js';
import { renderSimulator, attachSimulatorHandlers } from './views/simulator.js';
import { renderRecovery, attachRecoveryHandlers } from './views/recovery.js';
import { renderLogs, attachLogsHandlers } from './views/logs.js';

class App {
  constructor() {
    this.sidebarContainer = document.getElementById('sidebar-container');
    this.topbarContainer = document.getElementById('topbar-container');
    this.mainContent = document.getElementById('main-content');
    this.currentRoute = this.getRouteFromHash();
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validRoutes = ['overview', 'monitoring', 'infrastructure', 'threats', 'incidents', 'simulator', 'recovery', 'logs'];
    return validRoutes.includes(hash) ? hash : 'overview';
  }

  async init() {
    // Initial store hydration
    await store.init();

    // Listen for hash routing
    window.addEventListener('hashchange', () => {
      this.currentRoute = this.getRouteFromHash();
      store.setActiveTab(this.currentRoute);
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Subscribe to store updates
    store.subscribe((state) => {
      this.render(false);
    });

    // Global Key Shortcuts (⌘K / Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    this.render(true);
    showToast('CyberShield AI SOC Active', 'Proactive Threat Prediction & Containment Engine Online.', 'success', 4000);
  }

  render(fullRender = false) {
    const state = store.state;
    const route = this.currentRoute;

    // Render Shell (Sidebar + Topbar)
    if (this.sidebarContainer) {
      this.sidebarContainer.innerHTML = renderSidebar(route, state);
    }
    if (this.topbarContainer) {
      this.topbarContainer.innerHTML = renderTopbar(route, state);
      this.attachTopbarInteractions(state);
    }

    // Render Active View
    if (this.mainContent) {
      let viewHtml = '';
      switch (route) {
        case 'overview':
          viewHtml = renderOverview(state);
          this.mainContent.innerHTML = viewHtml;
          attachOverviewHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'monitoring':
          viewHtml = renderMonitoring(state);
          this.mainContent.innerHTML = viewHtml;
          attachMonitoringHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'infrastructure':
          viewHtml = renderInfrastructure(state);
          this.mainContent.innerHTML = viewHtml;
          attachInfrastructureHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'threats':
          viewHtml = renderThreats(state);
          this.mainContent.innerHTML = viewHtml;
          attachThreatsHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'incidents':
          viewHtml = renderIncidentDetails(state);
          this.mainContent.innerHTML = viewHtml;
          attachIncidentDetailsHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'simulator':
          viewHtml = renderSimulator(state);
          this.mainContent.innerHTML = viewHtml;
          attachSimulatorHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'recovery':
          viewHtml = renderRecovery(state);
          this.mainContent.innerHTML = viewHtml;
          attachRecoveryHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        case 'logs':
          viewHtml = renderLogs(state);
          this.mainContent.innerHTML = viewHtml;
          attachLogsHandlers(this.mainContent, state, () => store.refreshAll());
          break;
        default:
          viewHtml = renderOverview(state);
          this.mainContent.innerHTML = viewHtml;
          attachOverviewHandlers(this.mainContent, state, () => store.refreshAll());
          break;
      }
    }
  }

  attachTopbarInteractions(state) {
    const quickResetBtn = document.getElementById('quick-reset-btn');
    if (quickResetBtn) {
      quickResetBtn.onclick = async () => {
        await api.resetSimulation();
        await store.refreshAll();
        showToast('System Reset', 'All infrastructure returned to clean baseline.', 'success');
      };
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.onclick = () => {
        const sidebar = this.sidebarContainer.querySelector('nav');
        if (sidebar) {
          sidebar.classList.toggle('hidden');
          sidebar.classList.toggle('flex');
        }
      };
    }

    // Notifications Dropdown
    const notifBtn = document.getElementById('btn-topbar-notifications');
    const notifDropdown = document.getElementById('notifications-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.onclick = (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
      };
      document.addEventListener('click', () => {
        notifDropdown.classList.add('hidden');
      });
    }

    // Global Search Auto-Complete & Filter
    const searchInput = document.getElementById('global-search-input');
    const searchDropdown = document.getElementById('search-results-dropdown');
    const searchContent = document.getElementById('search-results-content');

    if (searchInput && searchDropdown && searchContent) {
      searchInput.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          searchDropdown.classList.add('hidden');
          return;
        }

        const matchingDevices = (state.devices || []).filter(d => 
          d.name.toLowerCase().includes(query) || d.ip.includes(query) || d.type.toLowerCase().includes(query)
        );
        const matchingIncidents = (state.incidents || []).filter(i => 
          i.title.toLowerCase().includes(query) || i.id.toLowerCase().includes(query) || i.threat_type.toLowerCase().includes(query)
        );
        const matchingThreats = (state.threats || []).filter(t => 
          t.name.toLowerCase().includes(query) || t.mitre_id.toLowerCase().includes(query)
        );

        const totalMatches = matchingDevices.length + matchingIncidents.length + matchingThreats.length;
        if (totalMatches === 0) {
          searchContent.innerHTML = `<div class="p-2 text-on-surface-variant text-center">No matching entities for "${query}"</div>`;
        } else {
          let html = '';
          if (matchingDevices.length > 0) {
            html += `<div class="font-bold text-[10px] uppercase text-primary px-2 py-1">Matching Assets (${matchingDevices.length})</div>`;
            matchingDevices.forEach(d => {
              html += `
                <a href="#infrastructure" class="p-2 bg-surface-container rounded hover:bg-surface-container-high transition-colors flex items-center justify-between">
                  <span class="font-bold text-on-surface">${d.name} <span class="font-mono-data text-xs text-on-surface-variant">(${d.ip})</span></span>
                  <span class="text-[10px] font-mono-data text-primary">${d.status}</span>
                </a>
              `;
            });
          }
          if (matchingIncidents.length > 0) {
            html += `<div class="font-bold text-[10px] uppercase text-error px-2 py-1 mt-1">Matching Incidents (${matchingIncidents.length})</div>`;
            matchingIncidents.forEach(i => {
              html += `
                <a href="#incidents" class="p-2 bg-surface-container rounded hover:bg-surface-container-high transition-colors flex items-center justify-between">
                  <span class="font-bold text-on-surface">${i.id}: ${i.title}</span>
                  <span class="text-[10px] font-mono-data text-error font-bold">${i.severity}</span>
                </a>
              `;
            });
          }
          if (matchingThreats.length > 0) {
            html += `<div class="font-bold text-[10px] uppercase text-tertiary px-2 py-1 mt-1">Matching Threat Signatures (${matchingThreats.length})</div>`;
            matchingThreats.forEach(t => {
              html += `
                <a href="#threats" class="p-2 bg-surface-container rounded hover:bg-surface-container-high transition-colors flex items-center justify-between">
                  <span class="font-bold text-on-surface">${t.name} (${t.mitre_id})</span>
                  <span class="text-[10px] font-mono-data text-tertiary font-bold">${t.ai_confidence}% Conf</span>
                </a>
              `;
            });
          }
          searchContent.innerHTML = html;
        }

        searchDropdown.classList.remove('hidden');
      };

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.add('hidden');
        }
      });
    }
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

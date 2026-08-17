import * as api from './api.js';

class StateStore {
  constructor() {
    this.state = {
      devices: [],
      telemetry: {
        system_risk_score: 24,
        risk_level: 'LOW RISK',
        active_threats_count: 3,
        monitored_devices_count: 1240,
        contained_threats_count: 450,
        online_percentage: 99.8,
        failed_logins_count: 1492,
        failed_logins_delta_percent: 12.0,
        egress_traffic_tbs: 4.2,
        ingress_traffic_tbs: 1.8,
        file_creations_count: 8432,
        file_modifications_count: 12104,
        cpu_cluster_load_percent: 68.0,
        memory_allocation_percent: 84.0,
        traffic_history: [150, 120, 160, 90, 110, 50, 130, 80, 100, 40, 120, 60, 140, 70, 110, 75, 90, 85, 120, 60, 100],
        failed_logins_history: [25, 22, 28, 15, 20, 5, 18, 10, 25, 12, 20],
        risk_history: [20, 22, 24, 25, 23, 24, 28, 30, 24, 24],
        last_updated: ''
      },
      threats: [],
      incidents: [],
      logs: [],
      recoveryStatus: null,
      activeIncidentId: 'INC-8492',
      selectedDeviceId: 'db-prod-04',
      activeTab: 'overview',
      loading: false,
      lastThreatCount: 0
    };

    this.listeners = new Set();
    this.pollInterval = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  async init() {
    await this.refreshAll();
    this.startPolling();
  }

  startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.refreshQuietly();
    }, 2000);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async refreshAll() {
    try {
      this.state.loading = true;
      const [devices, telemetry, threats, incidents, logs] = await Promise.all([
        api.fetchDevices().catch(() => this.state.devices),
        api.fetchMonitoring().catch(() => this.state.telemetry),
        api.fetchThreats().catch(() => this.state.threats),
        api.fetchIncidents().catch(() => this.state.incidents),
        api.fetchLogs().catch(() => this.state.logs)
      ]);

      this.state.devices = devices || [];
      this.state.telemetry = telemetry || this.state.telemetry;
      this.state.threats = threats || [];
      this.state.incidents = incidents || [];
      this.state.logs = logs || [];
      
      if (this.state.incidents.length > 0 && !this.state.incidents.find(i => i.id === this.state.activeIncidentId)) {
        this.state.activeIncidentId = this.state.incidents[0].id;
      }
      
      this.state.loading = false;
      this.notify();
    } catch (err) {
      console.error('Store refreshAll error:', err);
      this.state.loading = false;
      this.notify();
    }
  }

  async refreshQuietly() {
    try {
      const [devices, telemetry, threats, incidents, logs] = await Promise.all([
        api.fetchDevices().catch(() => this.state.devices),
        api.fetchMonitoring().catch(() => this.state.telemetry),
        api.fetchThreats().catch(() => this.state.threats),
        api.fetchIncidents().catch(() => this.state.incidents),
        api.fetchLogs(null, null, 15).catch(() => this.state.logs)
      ]);

      this.state.devices = devices || this.state.devices;
      this.state.telemetry = telemetry || this.state.telemetry;
      this.state.threats = threats || this.state.threats;
      this.state.incidents = incidents || this.state.incidents;
      this.state.logs = logs || this.state.logs;

      this.notify();
    } catch (err) {
      // Quiet background refresh failure
    }
  }

  setActiveIncident(id) {
    this.state.activeIncidentId = id;
    this.notify();
  }

  setSelectedDevice(id) {
    this.state.selectedDeviceId = id;
    this.notify();
  }

  setActiveTab(tab) {
    this.state.activeTab = tab;
    this.notify();
  }
}

export const store = new StateStore();

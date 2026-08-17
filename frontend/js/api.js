// CyberShield AI API Client

const API_BASE = window.location.origin.includes(':8000') || window.location.origin.includes(':5173') || window.location.origin.includes('localhost') 
  ? '' 
  : '';

export async function fetchDevices() {
  const res = await fetch(`${API_BASE}/api/devices`);
  if (!res.ok) throw new Error('Failed to fetch devices');
  return res.json();
}

export async function fetchDevice(id) {
  const res = await fetch(`${API_BASE}/api/devices/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch device ${id}`);
  return res.json();
}

export async function fetchMonitoring() {
  const res = await fetch(`${API_BASE}/api/monitoring`);
  if (!res.ok) throw new Error('Failed to fetch monitoring telemetry');
  return res.json();
}

export async function fetchThreats() {
  const res = await fetch(`${API_BASE}/api/threats`);
  if (!res.ok) throw new Error('Failed to fetch threats');
  return res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/api/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchIncident(id) {
  const res = await fetch(`${API_BASE}/api/incidents/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch incident ${id}`);
  return res.json();
}

export async function updateIncident(id, data) {
  const res = await fetch(`${API_BASE}/api/incidents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update incident ${id}`);
  return res.json();
}

export async function simulateAttack(scenario, targetAssetId = null) {
  const res = await fetch(`${API_BASE}/api/simulate/${scenario}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario, target_asset_id: targetAssetId })
  });
  if (!res.ok) throw new Error(`Simulation ${scenario} failed`);
  return res.json();
}

export async function resetSimulation() {
  const res = await fetch(`${API_BASE}/api/simulate/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Reset failed');
  return res.json();
}

export async function getSimulationHistory() {
  const res = await fetch(`${API_BASE}/api/simulate/history`);
  if (!res.ok) throw new Error('Failed to fetch simulation history');
  return res.json();
}

export async function containDevice(deviceId) {
  const res = await fetch(`${API_BASE}/api/contain/${deviceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Containment failed for ${deviceId}`);
  return res.json();
}

export async function recoverDevice(deviceId) {
  const res = await fetch(`${API_BASE}/api/recover/${deviceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Recovery failed for ${deviceId}`);
  return res.json();
}

export async function recoverAll() {
  const res = await fetch(`${API_BASE}/api/recover/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Master recovery failed');
  return res.json();
}

export async function fetchRecoveryStatus() {
  const res = await fetch(`${API_BASE}/api/recover/status`);
  if (!res.ok) throw new Error('Failed to fetch recovery status');
  return res.json();
}

export async function fetchLogs(level = null, search = null, limit = 50) {
  const params = new URLSearchParams();
  if (level) params.append('level', level);
  if (search) params.append('search', search);
  params.append('limit', limit);
  
  const res = await fetch(`${API_BASE}/api/logs?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

/**
 * Formatting utilities for SolarSense UI
 */

export function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

export function formatCostRange(low, high) {
  if (!low || !high) return '₹0 - ₹0';
  return `${formatINR(low)} – ${formatINR(high)}`;
}

export function formatKW(val) {
  if (val === undefined || val === null || isNaN(val)) return '0 kW';
  return `${Number(val).toFixed(2)} kW`;
}

export function formatKWh(val) {
  if (val === undefined || val === null || isNaN(val)) return '0 kWh';
  return `${Math.round(val).toLocaleString('en-IN')} kWh`;
}

export function formatArea(val) {
  if (val === undefined || val === null || isNaN(val)) return '0 m²';
  return `${Number(val).toFixed(1)} m²`;
}

export function formatPercent(val) {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Number(val).toFixed(0)}%`;
}

export function formatPaybackRange(low, high) {
  if (!low || !high) return '3 - 5 yrs';
  return `${Number(low).toFixed(1)} – ${Number(high).toFixed(1)} years`;
}

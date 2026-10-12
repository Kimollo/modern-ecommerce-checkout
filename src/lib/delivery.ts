import type { DeliveryMethod } from '../types';

function addBusinessDays(start: Date, days: number) {
  const date = new Date(start);
  date.setHours(12, 0, 0, 0);
  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return date;
}

const WINDOWS: Record<DeliveryMethod, [number, number]> = {
  standard: [3, 5],
  express: [1, 2],
  locker: [2, 4],
};

export function estimateDelivery(method: DeliveryMethod, from = new Date()) {
  const [minDays, maxDays] = WINDOWS[method];
  const start = addBusinessDays(from, minDays);
  const end = addBusinessDays(from, maxDays);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat('en-ZA', { month: 'short' }).format(start);
    return `${month} ${start.getDate()}–${end.getDate()}`;
  }
  const monthDay = new Intl.DateTimeFormat('en-ZA', { month: 'short', day: 'numeric' });
  return `${monthDay.format(start)} – ${monthDay.format(end)}`;
}

export function deliveryLabel(method: DeliveryMethod) {
  if (method === 'express') return 'Express courier';
  if (method === 'locker') return 'Pargo locker pick-up';
  return 'Standard door-to-door';
}

export function deliveryWindow(method: DeliveryMethod) {
  if (method === 'express') return '1–2 working days';
  if (method === 'locker') return '2–4 working days';
  return '3–5 working days';
}

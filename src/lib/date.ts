/**
 * Date formatting and heuristic helpers for Jobloom
 */

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return dateStr;
  }
}

export function daysSince(dateStr: string): number {
  try {
    const past = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = Math.floor((now - past) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  } catch {
    return 0;
  }
}

export function isPastDate(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    return new Date(dateStr).getTime() < Date.now();
  } catch {
    return false;
  }
}

export const WORK_TYPES = [
  'Plumbing', 'Electrical', 'AC Repair', 'Appliance Repair',
  'Health/Medical', 'Carpentry', 'Painting', 'Cleaning',
  'Pest Control', 'Welding', 'Masonry', 'Flooring',
  'Roofing', 'CCTV/Security', 'Internet/Networking', 'Other'
];

export const STATUSES = ['New', 'Pending', 'InProcess', 'Completed'];
export const PRIORITIES = ['No Priority', 'Low', 'Medium', 'High', 'Urgent'];

export const STATUS_STYLES = {
  New: 'badge-new',
  Pending: 'badge-pending',
  InProcess: 'badge-inprocess',
  Completed: 'badge-completed',
};

export const STATUS_DOT = {
  New: 'bg-blue-500',
  Pending: 'bg-amber-500',
  InProcess: 'bg-orange-500',
  Completed: 'bg-green-500',
};

export const PRIORITY_STYLES = {
  'No Priority': 'priority-none',
  Low: 'priority-low',
  Medium: 'priority-medium',
  High: 'priority-high',
  Urgent: 'priority-urgent',
};

export const PRIORITY_DOT = {
  'No Priority': 'bg-gray-400',
  Low: 'bg-slate-500',
  Medium: 'bg-yellow-500',
  High: 'bg-orange-500',
  Urgent: 'bg-red-500',
};

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const STAT_CARD_STYLES = {
  total: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-900',
    label: 'text-blue-600',
  },
  pending: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-900',
    label: 'text-amber-600',
  },
  inprocess: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    value: 'text-orange-900',
    label: 'text-orange-600',
  },
  completed: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-900',
    label: 'text-green-600',
  },
};


export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function getCurrentMonthYear() {
  const now = new Date();

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

export function getMonthDateRange(month, year) {

  const pad = (n) => String(n).padStart(2, "0");

  const lastDay = new Date(year, month, 0).getDate();

  return {

    startDate: `${year}-${pad(month)}-01`,

    endDate: `${year}-${pad(month)}-${pad(lastDay)}`

  };

}

export const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - 5 + i
);
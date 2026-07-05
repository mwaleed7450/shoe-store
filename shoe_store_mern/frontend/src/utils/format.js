export function formatPrice(price) {
  const n = Math.round(Number(price) || 0);
  return 'Rs. ' + n.toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

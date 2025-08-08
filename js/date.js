// Handles displaying current date/time on the top-right corner
export function initDate() {
  console.log('initDate invoked');
  const dateEl = document.createElement('div');
  dateEl.className = 'hud-date';
  document.body.appendChild(dateEl);

  function pad(n) { return n.toString().padStart(2, '0'); }
  function updateDate() {
    const now = new Date();
    const dd = pad(now.getDate());
    const mm = pad(now.getMonth() + 1);
    const yy = now.getFullYear().toString().slice(-2);
    const hh = now.getHours();
    const minute = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const hour12 = pad(hh % 12 === 0 ? 12 : hh % 12);
    // Date and time on separate lines
    const dateLine = `Star Date:${dd}.${mm}.${yy}`;
    const timeLine = `${hour12}.${minute}.${ss} ${ampm}`;
    dateEl.innerHTML = `${dateLine}<br>${timeLine}`;
  }

  updateDate();
  setInterval(updateDate, 1000); // Update every second for running time
}

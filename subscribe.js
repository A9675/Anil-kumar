async function subscribeUser() {
  // अगर पहले ही subscribe कर चुका है, तो दोबारा मत करो
  if (localStorage.getItem("isSubscribed") === "true") {
    console.log("🟡 Already Subscribed. Data not sent again.");
    return; // Exit function
  }

  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.register('sw.js');

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(CONFIG.publicKey)
  });

  // ✅ Send to Google Sheet only once
  await fetch(CONFIG.sheetUrl, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' }
  });

  // ✅ LocalStorage flag set कर दो
  localStorage.setItem("isSubscribed", "true");

  // ✅ UI update
  document.getElementById("subscribeCard").style.display = "none";
  document.getElementById("successCard").style.display = "block";
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

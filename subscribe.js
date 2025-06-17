async function subscribeUser() {
  if (!('serviceWorker' in navigator)) return alert("❌ Service Worker not supported.");
  const registration = await navigator.serviceWorker.register('sw.js');

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(CONFIG.publicKey)
  });

  await fetch(CONFIG.sheetUrl, {
    method: 'POST',
    body: JSON.stringify(subscription)
  });

  alert("✅ Subscribed 👍");
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

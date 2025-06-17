async function subscribeUser() {
  if (!('serviceWorker' in navigator)) return alert("Service Worker supported नहीं है।");
  if (!('PushManager' in window)) return alert("Push Notification supported नहीं है।");

  const registration = await navigator.serviceWorker.register('sw.js');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return alert("Permission denied.");

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) alert("Subscribed successfully!");
  else alert("Subscription failed!");
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}


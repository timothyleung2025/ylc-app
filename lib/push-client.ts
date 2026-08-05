"use client";

export type AnnouncementNotificationStatus =
  | "unsupported"
  | "permission_default"
  | "permission_denied"
  | "permission_granted_no_subscription"
  | "subscribed"
  | "subscription_not_saved"
  | "error";

export function pushSupported() {
  return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
}
export function isIOSBrowser() {
  if (typeof navigator === "undefined") return false;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const standalone = matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return ios && !standalone;
}
function applicationKey(value:string){const padding="=".repeat((4-value.length%4)%4);return Uint8Array.from(atob((value+padding).replace(/-/g,"+").replace(/_/g,"/")),char=>char.charCodeAt(0))}
async function saveSubscription(subscription: PushSubscription) {
  const response = await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()) });
  return response.ok;
}

export async function getAnnouncementNotificationStatus():Promise<AnnouncementNotificationStatus> {
  try {
    if (!pushSupported()) return "unsupported";
    if (Notification.permission === "default") return "permission_default";
    if (Notification.permission === "denied") return "permission_denied";

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) return "error";
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return "permission_granted_no_subscription";

    const response = await fetch(`/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`, { cache: "no-store" });
    if (response.ok && (await response.json()).active) return "subscribed";

    // Permission and a real browser subscription already exist. Repair the
    // server record silently instead of asking the participant again.
    return (await saveSubscription(subscription)) ? "subscribed" : "subscription_not_saved";
  } catch {
    return "error";
  }
}

export async function enablePush():Promise<AnnouncementNotificationStatus> {
  if (!pushSupported()) return "unsupported";
  if (isIOSBrowser()) throw new Error("Add YLC 2026 to your Home Screen first.");
  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  if (permission === "denied") return "permission_denied";
  if (permission !== "granted") return "permission_default";
  const publicKey=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;if(!publicKey)throw new Error("The public VAPID key is missing.");
  const registration=await navigator.serviceWorker.ready;
  const subscription=(await registration.pushManager.getSubscription())||(await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:applicationKey(publicKey)}));
  if (!(await saveSubscription(subscription))) return "subscription_not_saved";
  window.dispatchEvent(new Event("ylc-push-status-changed"));
  return "subscribed";
}
export async function disablePush(){if(!pushSupported())return;const registration=await navigator.serviceWorker.ready;const subscription=await registration.pushManager.getSubscription();if(subscription){const response=await fetch("/api/push/unsubscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({endpoint:subscription.endpoint})});if(!response.ok)throw new Error((await response.json()).error);await subscription.unsubscribe()}window.dispatchEvent(new Event("ylc-push-status-changed"))}
export async function sendDeviceTest(){const registration=await navigator.serviceWorker.ready;const subscription=await registration.pushManager.getSubscription();if(!subscription)throw new Error("Enable notifications first.");const response=await fetch("/api/push/test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({endpoint:subscription.endpoint})});const result=await response.json();if(!response.ok)throw new Error(result.error)}

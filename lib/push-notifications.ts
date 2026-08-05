import "server-only";
import webpush from "web-push";
import { getSupabaseAdminClient } from "./supabase/admin";
import type { Announcement } from "./announcement-types";

type Subscription = { id: string; endpoint: string; p256dh: string; auth: string };
function configure() {
  const publicKey=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; const privateKey=process.env.VAPID_PRIVATE_KEY; const subject=process.env.VAPID_SUBJECT;
  if(!publicKey||!privateKey||!subject)return false;
  webpush.setVapidDetails(subject,publicKey,privateKey); return true;
}
async function deliver(subscription: Subscription, payload: object) {
  await webpush.sendNotification({endpoint:subscription.endpoint,keys:{p256dh:subscription.p256dh,auth:subscription.auth}},JSON.stringify(payload));
}

export async function sendAnnouncementPush(announcement: Announcement) {
  const supabase=getSupabaseAdminClient();
  if(!supabase||!configure())return {configured:false,sent:0,failed:0};
  const {data}=await supabase.from("push_subscriptions").select("id,endpoint,p256dh,auth").eq("is_active",true);
  let sent=0,failed=0;
  await Promise.all((data||[]).map(async(subscription:Subscription)=>{try{await deliver(subscription,{title:announcement.title,body:announcement.category==="link"?"Tap to open the shared link.":(announcement.message||"").slice(0,180),url:`/announcements?announcement=${announcement.id}`,id:announcement.id});sent++}catch(issue){failed++;const status=(issue as {statusCode?:number}).statusCode;if(status===404||status===410)await supabase.from("push_subscriptions").update({is_active:false,updated_at:new Date().toISOString()}).eq("id",subscription.id)}}));
  return {configured:true,sent,failed};
}

export async function sendTestPush(endpoint:string) {
  const supabase=getSupabaseAdminClient();
  if(!supabase||!configure())throw new Error("Push is not configured.");
  const {data,error}=await supabase.from("push_subscriptions").select("id,endpoint,p256dh,auth").eq("endpoint",endpoint).eq("is_active",true).single();
  if(error||!data)throw new Error("No active subscription was found for this device.");
  await deliver(data,{title:"YLC notification test",body:"Announcement notifications are working on this device.",url:"/announcements",id:"test"});
}

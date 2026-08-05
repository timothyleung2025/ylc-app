import { NextResponse } from "next/server";
import { sendTestPush } from "@/lib/push-notifications";

export async function POST(request:Request){try{const {endpoint}=await request.json();if(!endpoint)return NextResponse.json({error:"Missing endpoint."},{status:400});await sendTestPush(endpoint);return NextResponse.json({ok:true})}catch(issue){return NextResponse.json({error:issue instanceof Error?issue.message:"Could not send test notification."},{status:500})}}

// /app/api/stripe/create-account-link/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { accountId } = await request.json();

    // Creează un link de onboarding pentru contul conectat
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.NEXT_PUBLIC_SITE_URL + "/reauth", // URL pentru reîncărcare, în cazul în care onboarding-ul nu se finalizează
      return_url: process.env.NEXT_PUBLIC_SITE_URL + "/success",  // URL la finalizarea onboarding-ului
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating account link:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

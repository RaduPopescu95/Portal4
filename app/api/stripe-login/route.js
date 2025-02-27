// /app/api/stripe/login-link/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { accountId } = await request.json();

    const loginLink = await stripe.accounts.createLoginLink(accountId);

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error creating login link:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

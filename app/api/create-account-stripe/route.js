// /app/api/stripe/create-account/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Creează un cont conectat de tip Express pentru specialist
    const account = await stripe.accounts.create({
      type: "express",
      email, // folosim email-ul specialistului
      // Opțional: poți seta și alte detalii (de ex: country, business_type etc.)
    });

    return NextResponse.json({ accountId: account.id });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

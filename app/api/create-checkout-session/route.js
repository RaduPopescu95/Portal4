// /app/api/stripe/create-checkout-session/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { priceId, connectedAccountId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // ID-ul prețului din Stripe pentru rezervare
          quantity: 1,
        },
      ],
      mode: 'payment', // Pentru plăți unice; pentru abonamente se folosește 'subscription'
      payment_intent_data: {
        application_fee_amount: 500, // (opțional) comisionul platformei, în cenți (ex: 500 = 5 USD)
        transfer_data: {
          destination: connectedAccountId, // ID-ul contului conectat al specialistului
        },
      },
      success_url: process.env.NEXT_PUBLIC_SITE_URL + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL + '/cancel',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

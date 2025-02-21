"use client"

import axios from "axios";

const Pricing = () => {
  const pricingData = [
    {
      id: "price_1Qqwo5ClBW08h64jlj48WXZ5",
      unit_amount: 100 * 100, // Valoarea în cenți; pentru afișare o împărțim la 100
      nickname: "Basic",
      offers: [
        "1 User",
        "All UI components",
        "Lifetime access",
        "Free updates",
        "Use on 1 (one) project",
        "3 Months support",
      ],
    },
    {
      id: "price_1Qqwo5ClBW08h64jlj48WXZ5",
      unit_amount: 200 * 100,
      nickname: "Premium",
      offers: [
        "5 Users",
        "All UI components",
        "Lifetime access",
        "Free updates",
        "Use on 1 (one) project",
        "3 Months support",
      ],
    },
    {
      id: "price_1Qqwo5ClBW08h64jlj48WXZ5",
      unit_amount: 300 * 100,
      nickname: "Business",
      offers: [
        "10 Users",
        "All UI components",
        "Lifetime access",
        "Free updates",
        "Use on 1 (one) project",
        "3 Months support",
      ],
    },
  ];

    // POST request
    const handleSubscription = async (e , priceId) => {
      e.preventDefault();
      const { data } = await axios.post(
        "/api/payment",
        {
          priceId
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      window.location.assign(data);
    };
  

  return (
    <>
      {pricingData.map((plan) => (
        <div className="col-sm-6 col-md-6 col-lg-4" key={plan.id}>
          <div className="pricing_table">
            <div className="pricing_header">
              {/* Împărțim unit_amount la 100 pentru a afișa prețul în dolari */}
              <div className="price">${plan.unit_amount / 100}</div>
              <h4>{plan.nickname}</h4>
            </div>
            <div className="pricing_content">
              <ul className="mb0">
                {plan.offers.map((offer, index) => (
                  <li key={index}>{offer}</li>
                ))}
              </ul>
            </div>
            <div className="pricing_footer">
              {/* Butonul poate fi configurat ulterior pentru a iniția plata prin Stripe, folosind plan.id */}
              <a className="btn pricing_btn btn-block" href="#"   onClick={(e) => handleSubscription(e, plan.id)}>
                Select Package
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Pricing;

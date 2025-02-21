"use client";

import PricingBox from "./PricingBox";
import SectionTitle from "./SectionTtitle";


const pricingData = [
  {
    id: "price_1NQk5TLtGdPVhGLecVfQ7mn0",
    unit_amount: 100 * 100,
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
    id: "price_1NQk55LtGdPVhGLefU8AHqHr",
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
    id: "price_1NQk4eLtGdPVhGLeZsZDsCNz",
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


const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Pricing Table"
            title="Our Pricing Plan"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {pricingData.map((product, i) => (
            <PricingBox key={i} product={product} />
          ))}     
        </div>
      </div>
    </section>
  );
};

export default Pricing;

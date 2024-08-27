import dynamic from "next/dynamic";
import AboutUs from "@/components/about-us";

export const metadata = {
  title: "Despre JobsMD - Portalul de Oferte Exclusive pentru cadre medicale",
  description:
    "Află cum JobsMD conectează cadrele medicale cu ofertele speciale ale partenerilor economici. Misiunea noastră este să oferim avantaje unice pentru profesioniștii din domeniul medical.",
};

const index = () => {
  return (
    <>
      <AboutUs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

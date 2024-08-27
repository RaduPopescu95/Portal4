import Wrapper from "@/components/layout/Wrapper";
import HomeMain from "./(homes)/home-4/page";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "JobsMD - Oferte Exclusive pentru cadre medicale",
  description:
    "Descoperă cele mai bune oferte și beneficii de la hoteluri, restaurante și alți parteneri economici dedicate exclusiv cadrelor medicale. Accesează acum portalul JobsMD pentru avantaje unice!",
};

export default function Home() {
  return (
    <Wrapper>
      <HomeMain />
    </Wrapper>
  );
}

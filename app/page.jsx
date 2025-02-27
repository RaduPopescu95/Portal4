import Wrapper from "@/components/layout/Wrapper";
import HomeMain from "./(homes)/home-4/page";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Connectify",
  description:
    "Connectify",
};

export default function Home() {
  return (
    <Wrapper>
      <HomeMain />
    </Wrapper>
  );
}

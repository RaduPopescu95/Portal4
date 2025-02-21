import dynamic from "next/dynamic";
import MyProperties from "@/components/dashboard-utilizator/my-properties";

export const metadata = {
  title: "My Properties || Connectify",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <MyProperties />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

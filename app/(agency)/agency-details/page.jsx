import dynamic from "next/dynamic";
import AgencyDetails from "@/components/agency-details";

export const metadata = {
  title: "Agency Details || JobsMD",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <AgencyDetails />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

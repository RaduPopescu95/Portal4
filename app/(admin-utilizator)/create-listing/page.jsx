import dynamic from "next/dynamic";
import CreateListing from "@/components/dashboard/creaza-oferta";

export const metadata = {
  title: "Create Listing || JobsMD",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <CreateListing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

import dynamic from "next/dynamic";
import ListingDetailsV1 from "@/components/listing-details-v1";

export const metadata = {
  title: "Partener || UberMD",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <ListingDetailsV1 />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

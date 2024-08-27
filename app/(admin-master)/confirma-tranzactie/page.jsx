import dynamic from "next/dynamic";
import CreateListing from "@/components/dashboard-master/confirma-tranzactie";

export const metadata = {
  title: "Creaza discount || JobsMD",
  description: "nume portal",
};

const index = () => {
  return (
    <>
      <CreateListing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

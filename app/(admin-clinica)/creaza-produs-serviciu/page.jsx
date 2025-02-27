import dynamic from "next/dynamic";
import CreateListing from "@/components/dashboard/creaza-produs-serviciu";

export const metadata = {
  title: 'Creaza discount || nume portal',
  description:
    'nume portal',
}

const index = () => {
  return (
    <>
      <CreateListing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

import dynamic from "next/dynamic";
import MySavedSearch from "@/components/dashboard/my-saved-search";

export const metadata = {
  title: "Lista anunturi angajare || JobsMD",
  description: "Porta",
};

const index = () => {
  return (
    <>
      <MySavedSearch />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

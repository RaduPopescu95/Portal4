import dynamic from "next/dynamic";
import MySavedSearch from "@/components/dashboard-master/lista-tranzactii";
import { handleGetSubcollections } from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";
import oferte from "@/data/oferte";

export const metadata = {
  title: "Lista anunturi angajare || JobsMD",
  description: "Porta",
};

const index = async () => {
  noStore();
  let oferteInregistrate = await handleGetSubcollections(
    "Cereri",
    "firstUploadDate"
  );
  console.log("here....", oferte);
  return (
    <>
      <MySavedSearch oferteInregistrate={oferteInregistrate} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

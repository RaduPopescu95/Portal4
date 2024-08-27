import dynamic from "next/dynamic";
import MySavedSearch from "@/components/dashboard-master/plangeri";
import {
  handleGetFirestore,
  handleGetSubcollections,
} from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";

export const metadata = {
  title: "Lista anunturi angajare || JobsMD",
  description: "Porta",
};

const index = async () => {
  noStore();
  let plangeriInregistrate = await handleGetFirestore("PlângeriJobs");
  return (
    <>
      <MySavedSearch plangeriInregistrate={plangeriInregistrate} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

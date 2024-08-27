import dynamic from "next/dynamic";
import CreateListing from "@/components/dashboard/verifica-tranzactie";
import {
  handleQueryFirestore,
  handleQueryFirestoreSubcollection,
} from "@/utils/firestoreUtils";

export const metadata = {
  title: "Creaza discount || JobsMD",
  description: "JobsMD",
};

const index = async () => {
  return (
    <>
      <CreateListing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

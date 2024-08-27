"use client";

import dynamic from "next/dynamic";
import MySavedSearch from "@/components/dashboard-utilizator/lista-tranzactii";
import {
  handleGetSubcollections,
  handleQueryFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import oferte from "@/data/oferte";

// export const metadata = {
//   title: "Lista anunturi angajare || Porta",
//   description: "Porta",
// };

const index = async () => {
  const { userData } = useAuth();
  let oferteInregistrate = [];
  if (userData?.user_uid) {
    oferteInregistrate = await handleQueryFirestoreSubcollection(
      "Cereri",
      "idUtilizator",
      userData?.user_uid
    );
  }

  console.log("oferteInregistrate...", oferte);

  return (
    <>
      <MySavedSearch oferteInregistrate={oferteInregistrate} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

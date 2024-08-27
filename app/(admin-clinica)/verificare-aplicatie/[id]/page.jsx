import dynamic from "next/dynamic";
import {
  handleQueryFirestore,
  handleQueryFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import Tranzactie from "@/components/dashboard/verifica-tranzactie/Tranzactie";

// export const metadata = {
//   title: "Verifica tranzactie || JobsMD",
//   description: "JobsMD",
// };

const index = async ({ params }) => {
  const { id } = params;
  if (id === "favicon.ico") {
    return null; // Returnează null sau orice alt component care indică că pagina nu trebuie să proceseze acest id.
  }
  console.log("parms...", id);

  const idCerere = id;
  let cerereData = [];
  let utilizatorData = [];

  cerereData = await handleQueryFirestoreSubcollection(
    "Cereri",
    "documentId",
    idCerere
  );

  // console.log("parms...ofertaData", ofertaData);
  // console.log("parms...utilizatorData", utilizatorData);
  return (
    <>
      <Tranzactie idCerere={idCerere} cerere={cerereData[0]} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

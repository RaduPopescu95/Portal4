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
  const parts = id.split("-");
  const userId = parseFloat(parts[0]);
  const cod = parts[1];
  const codParts = cod.split("UIDD");
  const offerId = codParts[0];
  const partenerId = codParts[1];
  let ofertaData = [];
  let utilizatorData = [];
  if (userId) {
    utilizatorData = await handleQueryFirestore("UsersUber", "id", userId);
    ofertaData = await handleQueryFirestoreSubcollection(
      "Oferte",
      "documentId",
      offerId
    );
  }
  // console.log("parms...ofertaData", ofertaData);
  // console.log("parms...utilizatorData", utilizatorData);
  return (
    <>
      <Tranzactie
        partenerId={partenerId}
        utilizator={utilizatorData[0]}
        oferta={ofertaData[0]}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

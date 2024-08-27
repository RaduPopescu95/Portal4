import dynamic from "next/dynamic";
import ListaParteneri from "../../../components/dashboard-master/lista-parteneri";
import { handleQueryFirestore } from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";

export const metadata = {
  title: "Portal || JobsMD",
  description: "Portal",
};

const index = async () => {
  noStore();
  const parteneri = await handleQueryFirestore(
    "UsersUber",
    "userType",
    "Partener"
  );
  return (
    <>
      <ListaParteneri parteneri={parteneri} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

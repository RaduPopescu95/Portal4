import dynamic from "next/dynamic";
import ListaDoctori from "../../../components/dashboard-master/lista-doctori";
import { handleQueryFirestore } from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";

export const metadata = {
  title: "Portal || JobsMD",
  description: "Portal",
};

const index = async () => {
  noStore();
  const doctori = await handleQueryFirestore("UsersUber", "userType", "Doctor");
  return (
    <>
      <ListaDoctori doctori={doctori} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

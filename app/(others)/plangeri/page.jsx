import dynamic from "next/dynamic";
import Plangeri from "@/components/plangeri";

export const metadata = {
  title: "Plangeri || UberMD",
  description:
    "Ai întâmpinat o problemă sau dorești să oferi feedback? Informează-ne prin pagina de plângeri a portalului UberMD și vom rezolva rapid orice situație.",
};

const index = () => {
  return (
    <>
      <Plangeri />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

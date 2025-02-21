import dynamic from "next/dynamic";
import AboutUs from "@/components/about-us";
import { PLATFORM_NAME } from "@/utils/constants";


export const metadata = {
  title: `Despre ${PLATFORM_NAME} – Platforma de Conectare cu Specialiștii și Programări Online`,
  description: `${PLATFORM_NAME} îți permite să găsești specialiști din diverse domenii, să faci programări online și să participi la consultații prin video call. Descoperă experți locali și gestionează ușor întâlnirile tale online.`,
};


const index = () => {
  return (
    <>
      <AboutUs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

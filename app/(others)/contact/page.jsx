import dynamic from "next/dynamic";
import Contact from "@/components/contact";

export const metadata = {
  title: "Contactează-ne - JobsMD",
  description:
    "Ai întrebări sau dorești mai multe informații? Contactează echipa JobsMD și vom fi bucuroși să te asistăm cu orice solicitare sau întrebare.",
};

const index = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

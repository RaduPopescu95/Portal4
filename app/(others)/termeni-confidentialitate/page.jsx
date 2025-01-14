import dynamic from "next/dynamic";
import Terms from "@/components/terms-conditions";

export const metadata = {
  title: "Termeni și Condiții - UberMD",
  description:
    "UberMD conectează cadrele medicale cu ofertele speciale ale partenerilor economici",
};

const index = () => {
  return (
    <>
      <Terms />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

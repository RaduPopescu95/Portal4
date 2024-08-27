import dynamic from "next/dynamic";
import Compare from "@/components/compare";

export const metadata = {
  title: 'Compare || Portal',
  description:
    'Portal',
}

const index = () => {
  return (
    <>
      <Compare />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

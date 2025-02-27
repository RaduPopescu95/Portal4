import dynamic from "next/dynamic";
import Service from "@/components/service";

export const metadata = {
  title: 'Service || Portal',
  description:
    'Portal',
}

const index = () => {
  return (
    <>
      <Service />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

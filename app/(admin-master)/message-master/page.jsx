import dynamic from "next/dynamic";
import MyMessage from "@/components/dashboard/my-message";

export const metadata = {
  title: "My Message || JobsMD",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <MyMessage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

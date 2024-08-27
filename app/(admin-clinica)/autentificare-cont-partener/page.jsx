import dynamic from "next/dynamic";
import Signin from "@/components/signin";

export const metadata = {
  title: "Login",
  description: "Login",
};

const index = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

import dynamic from "next/dynamic";
import SignUp from "@/components/register";

export const metadata = {
  title: 'SignUp || Portal',
  description:
    'Portal',
}

const index = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

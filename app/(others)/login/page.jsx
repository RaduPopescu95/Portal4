import dynamic from "next/dynamic";
import Login from "@/components/login";

export const metadata = {
  title: 'Login || Portal',
  description:
    'Portal',
}

const index = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

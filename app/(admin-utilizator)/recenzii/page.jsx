import dynamic from "next/dynamic";
import MyReview from "@/components/dashboard/my-review";

export const metadata = {
  title: "My Review || JobsMD",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <MyReview />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

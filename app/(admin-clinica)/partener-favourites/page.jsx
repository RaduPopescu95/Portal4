import dynamic from "next/dynamic";
import MyFavourites from "@/components/dashboard/my-favourites";

export const metadata = {
  title: "Favorite || Connectify",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <MyFavourites />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

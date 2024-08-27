import dynamic from "next/dynamic";
import MyProfile from "@/components/dashboard-utilizator/my-profile";

export const metadata = {
  title: "My Profile || JobsMD",
  description: "Profil",
};

const index = () => {
  return (
    <>
      <MyProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

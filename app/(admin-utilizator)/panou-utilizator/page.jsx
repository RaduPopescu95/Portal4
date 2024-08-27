"use client";

import dynamic from "next/dynamic";
import MyDashboard from "@/components/dashboard-utilizator/my-dashboard";
import { handleQueryFirestoreSubcollection } from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";

// export const metadata = {
//   title: "Dashboard || Dashboard",
//   description: "Dashboard",
// };

const index = async () => {
  const { userData } = useAuth();
  let oferteInregistrate = [];
  // if (userData?.user_uid) {
  //   oferteInregistrate = await handleQueryFirestoreSubcollection(
  //     "OferteInregistrate",
  //     "idUtilizator",
  //     userData?.user_uid
  //   );
  // }

  return (
    <>
      <MyDashboard oferteInregistrate={oferteInregistrate} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

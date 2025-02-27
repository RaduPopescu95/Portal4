"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { handleQueryFirestoreSubcollection } from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import MyDashboard from "@/components/dashboard-utilizator/my-dashboard";

const index = () => {
  const { userData } = useAuth();
  const [rezervari, setRezervari] = useState([]);

  useEffect(() => {
    const fetchRezervari = async () => {
      if (userData?.user_uid) {
        const data = await handleQueryFirestoreSubcollection(
          "RezervariConsultatii", // subcolecția pentru rezervări
          "specialistId",         // filtrare după specialistId
          userData.user_uid
        );
        setRezervari(data);
      }
    };
    fetchRezervari();
  }, [userData]);

  return (
    <>
      <MyDashboard rezervari={rezervari} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });

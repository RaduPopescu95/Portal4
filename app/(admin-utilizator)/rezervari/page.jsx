"use client";

import React, { useEffect, useState } from "react";
import MySavedSearch from "@/components/dashboard-utilizator/lista-rezervari";
import { handleQueryFirestoreSubcollection } from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { userData } = useAuth();
  const [rezervari, setRezervari] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (userData?.user_uid) {
        const data = await handleQueryFirestoreSubcollection(
          "RezervariConsultatii", // folosește subcolecția corectă pentru rezervări
          "specialistId",         // filtrare după câmpul care conține UID-ul specialistului
          userData.user_uid
        );
        setRezervari(data);
      }
    };
    fetchReservations();
  }, [userData]);

  console.log("rezervari...", rezervari);

  return (
    <>
      <MySavedSearch rezervari={rezervari} />
    </>
  );
};

export default Index;

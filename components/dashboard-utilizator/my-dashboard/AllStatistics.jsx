"use client";

import { useAuth } from "@/context/AuthContext";
import {
  getFirestoreQueryLength,
  getFirestoreSubcollectionLength,
} from "@/utils/firestoreUtils";
import { useEffect, useState } from "react";

const AllStatistics = () => {
  const { userData } = useAuth();
  const [candidaturi, setCandidaturi] = useState(0);
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-invoice",
      timer: "SILVER",
      name: "Aplicații Recente",
    },
    // {
    //   id: 2,
    //   blockStyle: "style2",
    //   icon: "flaticon-money-bag",
    //   timer: "9.987",
    //   name: "RON",
    // },
    // {
    //   id: 3,
    //   blockStyle: "style3",
    //   icon: "flaticon-chat",
    //   timer: "12",
    //   name: "Total Visitor Reviews",
    // },
    // {
    //   id: 4,
    //   blockStyle: "style4",
    //   icon: "flaticon-heart",
    //   timer: "18",
    //   name: "Total Favorites",
    // },
  ];
  const handleGetNumarCandidaturi = async () => {
    const nrCand = await getFirestoreSubcollectionLength(
      `Cereri`,
      "idUtilizator",
      userData.user_uid
    );
    setCandidaturi(nrCand);
  };
  useEffect(() => {
    handleGetNumarCandidaturi();
  }, []);

  return (
    <>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
        <div className={`ff_one`}>
          <div className="detais">
            <div className="timer">{candidaturi}</div>
            <p>Cereri</p>
          </div>
          <div className="icon">
            <span className="flaticon-invoice"></span>
          </div>
        </div>
      </div>
      {/* <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
        <div className={`ff_one style2`}>
          <div className="detais">
            <div className="timer">{userData?.rulajCont}</div>
            <p>Rulaj Cont</p>
          </div>
          <div className="icon">
            <span className="flaticon-money-bag"></span>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default AllStatistics;

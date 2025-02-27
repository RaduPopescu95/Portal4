"use client";

import { useAuth } from "@/context/AuthContext";
import { getFirestoreCollectionLength } from "@/utils/firestoreUtils";

const AllStatistics = async () => {
  const { userData } = useAuth();
  const numarOferte = await getFirestoreCollectionLength(
    `UsersUber/${userData?.user_uid}/Oferte`
  );
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-invoice",
      timer: "121",
    },
    // {
    //   id: 2,
    //   blockStyle: "style2",
    //   icon: "flaticon-high-five",
    //   timer: "24",
    //   name: "Parteneri",
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

  return (
    <>
      {allStatistics.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{numarOferte}</div>
              <p>{numarOferte === 1 ? "Anunt" : "Anunturi"}</p>
            </div>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllStatistics;

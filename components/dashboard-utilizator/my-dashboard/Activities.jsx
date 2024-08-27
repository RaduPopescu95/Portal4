"use client";

import LogoUpload from "@/components/dashboard/my-profile/LogoUpload";
import { useState } from "react";

const Activities = ({ oferteInregistrate }) => {
  const [logo, setLogo] = useState([]);
  const [deletedLogo, setDeletedLogo] = useState(null);
  const [isNewLogo, setIsNewLogo] = useState(false);

  // Handle single image selection
  const singleImage = (e, idOfertaInregistrata) => {
    const file = e.target.files[0]; // Get the selected file
    console.log("test..here...", file.name);
    console.log("idOfertaInregistrata", idOfertaInregistrata);
    if (file) {
      // Check if the file is already selected
      const isExist = logo.some(
        (existingFile) => existingFile.name === file.name
      );

      if (!isExist) {
        setLogo([file]); // Replace the current file
        setIsNewLogo(true);
      } else {
        alert("This image is already selected!");
      }
    }
  };

  // delete logo
  const deleteLogo = (name) => {
    if (logo[0].fileName) {
      setLogo([]); // Clear the selection when deleting
      setDeletedLogo(logo[0].fileName);
    } else {
      setLogo([]); // Clear the selection when deleting
    }
  };

  const activities = [
    {
      id: 1,
      numePartener: "Nume partener",
      message: "Primiti 20% discount la produsul xyz.",
    },
    {
      id: 2,
      numePartener: "Nume partener",
      message: " Meniu special de seară la doar 50€ pentru doi.",
    },
    {
      id: 3,
      numePartener: "Nume partener",
      message: "Pachet weekend la munte pentru doi la prețul fix de 200€",
    },
  ];

  return (
    <>
      {oferteInregistrate.map((activity, index) => (
        <div
          key={activity.id}
          className={`grid ${
            index === activities.length - 1 ? "mb0" : ""
          } d-flex justify-content-between`}
        >
          <ul
            className={`list-unstyled ${
              index === activities.length - 1 ? "pb0 mb0 bb_none" : ""
            }`}
          >
            <li className="list-inline-item">
              <div className="icon">
                <span className="flaticon-profit"></span>
              </div>
            </li>
            <li className="list-inline-item">
              <h3>{activity.numePartener}</h3>
              <p>{activity.oferta.titluOferta}</p>
            </li>
          </ul>
          {/* Butonul adăugat aici */}
          <LogoUpload
            singleImage={(e) => singleImage(e, activity.id)}
            deleteLogo={deleteLogo}
            logoImg={logo}
            isEdit={true}
            isNewImage={isNewLogo}
            text="Adauga bon/factura"
          />
        </div>
      ))}
    </>
  );
};

export default Activities;

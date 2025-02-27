"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";

// CSS in JS pentru simbolurile tick și close
const styles = {
  tick: {
    color: "green", // Verde pentru tick
  },
  close: {
    color: "red", // Roșu pentru close
  },
};

const SearchData = ({ mesajeInregistrare }) => {
  const { currentUser } = useAuth();

  // const handleToggle = async (oferta) => {
  //   console.log(oferta);
  //   // Mapați și transformați fiecare item asincron
  //   const updatedOffers = await Promise.all(
  //     offers.map(async (item) => {
  //       if (item.id === oferta.id) {
  //         // Verifică statusul curent și îl schimbă
  //         const newStatus =
  //           item.status === "Confirmata" ? "Neconfirmata" : "Confirmata";
  //         let data = {
  //           status: newStatus,
  //         };
  //         await handleUpdateFirestoreSubcollection(
  //           data,
  //           `UsersUber/${oferta?.collectionId}/OferteInregistrate/${oferta?.documentId}`
  //         );
  //         const doctor = await handleQueryFirestore(
  //           "UsersUber",
  //           "user_uid",
  //           oferta?.idUtilizator
  //         );
  //         console.log("test....doctor[0]....", doctor[0]);
  //         if (newStatus === "Confirmata") {
  //           doctor[0].rulajCont =
  //             Number(doctor[0].rulajCont) + Number(oferta.pretFinal);
  //         } else if (newStatus === "Neconfirmata") {
  //           doctor[0].rulajCont =
  //             Number(doctor[0].rulajCont) - Number(oferta.pretFinal);
  //         }

  //         console.log("test....doctor[0]....", doctor[0]);
  //         await handleUpdateFirestore(
  //           `UsersUber/${oferta.idUtilizator}`,
  //           doctor[0]
  //         );
  //         return { ...item, status: newStatus }; // Returnează obiectul actualizat
  //       }
  //       return item; // Returnează obiectul neschimbat
  //     })
  //   );

  //   // Actualizează starea offers cu noul array modificat
  //   setOffers(updatedOffers);
  // };
  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Nume</th>
          <th scope="col">Subiect</th>
          <th scope="col">E-mail</th>
          <th scope="col">Data si Ora</th>
          <th scope="col">Actiuni</th>
        </tr>
      </thead>
      <tbody>
        {mesajeInregistrare.map((row, index) => (
          <tr key={index} className={"title"}>
            <td className="para">{row.form_name}</td>
            <td className="para">{row.form_subject}</td>
            <td className="para">{row.form_email}</td>
            <td className="para">
              {row.firstUploadDate} - {row.firstUploadTime}
            </td>
            <td>
              <ul className="view_edit_delete_list mb0">
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="View"
                >
                  <Link href={`/confirma-tranzactie/${row.id}`}>
                    <span className="flaticon-view"></span>
                  </Link>
                </li>

                {/* End li */}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchData;

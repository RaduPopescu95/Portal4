"use client";

import { useAuth } from "@/context/AuthContext";
import {
  handleQueryFirestore,
  handleUpdateFirestore,
  handleUpdateFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const SearchData = ({ oferteInregistrate }) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleToggle = async (oferta) => {
    console.log(oferta);
    // Mapați și transformați fiecare item asincron
    const updatedOffers = await Promise.all(
      oferteInregistrate.map(async (item) => {
        if (item.documentId === oferta.documentId) {
          // Verifică statusul curent și îl schimbă
          const newStatus =
            item.status === "Confirmata" ? "Neconfirmata" : "Confirmata";
          let data = {
            status: newStatus,
          };
          await handleUpdateFirestoreSubcollection(
            data,
            `UsersUber/${oferta?.collectionId}/OferteInregistrate/${oferta?.documentId}`
          );
          const doctor = await handleQueryFirestore(
            "UsersUber",
            "user_uid",
            oferta?.idUtilizator
          );
          const partener = await handleQueryFirestore(
            "UsersUber",
            "user_uid",
            oferta?.collectionId
          );

          if (newStatus === "Confirmata") {
            doctor[0].rulajCont =
              Number(doctor[0].rulajCont) + Number(oferta.pretFinal);
          } else if (newStatus === "Neconfirmata") {
            doctor[0].rulajCont =
              Number(doctor[0].rulajCont) - Number(oferta.pretFinal);
          }

          console.log("test....doctor[0]....email", doctor[0].email);
          console.log("test....partener[0]....email", partener[0].email);
          await handleUpdateFirestore(
            `UsersUber/${oferta.idUtilizator}`,
            doctor[0]
          );
          return { ...item, status: newStatus }; // Returnează obiectul actualizat
        }
        return item; // Returnează obiectul neschimbat
      })
    );
    router.refresh();
  };
  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Titlu Anunt</th>
          <th scope="col">Nume clinica</th>
          <th scope="col">Nume cadru medical</th>
          <th scope="col">Data aplicare</th>
          <th scope="col">Actiune</th>
        </tr>
      </thead>
      <tbody>
        {oferteInregistrate.map((row, index) => (
          <tr key={index} className={row.active ? "title active" : "title"}>
            <td className="para">{row.titluOferta}</td>
            <td className="para">{row.partener?.denumireBrand}</td>
            <td className="para">{row.utilizator?.numeUtilizator}</td>
            <td className="para">{row.firstUploadDate}</td>

            <td>
              <ul className="view_edit_delete_list mb0">
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="View"
                >
                  <Link href={`/confirma-tranzactie/${row.documentId}`}>
                    <span className="flaticon-view"></span>
                  </Link>
                </li>
                {/* <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Delete"
                >
                  <a href="#">
                    <span className="flaticon-garbage"></span>
                  </a>
                </li>
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Toggle"
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle(row);
                    }}
                  >
                    {row.status === "Confirmata" ? (
                      <span
                        className="flaticon-tick"
                        style={styles.tick}
                      ></span>
                    ) : (
                      <span
                        className="flaticon-close"
                        style={styles.close}
                      ></span>
                    )}
                  </a>
                </li> */}
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

"use client";

import Image from "next/image";
import properties from "../../../data/properties";
import { useState } from "react";
import oferte from "@/data/oferte";
import listaUtilizatori from "@/data/listaUtilizatori";
import Link from "next/link";
import {
  handleDeleteFirestoreData,
  handleUpdateFirestore,
  handleUpdateFirestoreSubcollection,
  handleUploadFirestore,
} from "@/utils/firestoreUtils";
import { update } from "firebase/database";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/common/dialogs/DeleteDialog";

// CSS in JS pentru simbolurile tick și close
const styles = {
  tick: {
    color: "green", // Verde pentru tick
  },
  close: {
    color: "red", // Roșu pentru close
  },
};

const TableData = ({ doctori: docs }) => {
  // const [doctori, setDoctori] = useState([...docs]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  // const { currentUser } = useAuth();

  const handleToggle = async (doctor) => {
    console.log(doctor);
    // Mapați și transformați fiecare item asincron
    const updateDoctors = await Promise.all(
      docs.map(async (item) => {
        if (item.id === doctor.id) {
          // Verifică statusul curent și îl schimbă
          const newStatus = item.statusCont === "Activ" ? "Inactiv" : "Activ";
          let data = {
            statusCont: newStatus,
          };
          await handleUpdateFirestore(`UsersUber/${doctor.user_uid}`, data);
          return { ...item, statusCont: newStatus }; // Returnează obiectul actualizat
        }
        return item; // Returnează obiectul neschimbat
      })
    );
    console.log(updateDoctors);
    // Actualizează starea offers cu noul array modificat

    router.refresh();
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteClick = (itemId) => {
    console.log(itemId);
    setSelectedItemId(itemId); // Salvează ID-ul elementului selectat
    setShowModal(true); // Afișează modalul
  };

  // Logica de ștergere a elementului
  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting item with ID:", selectedItemId);
      console.log("location.....:", location);

      await handleDeleteFirestoreData(
        `${"UsersUber"}/${selectedItemId}`,
        true,
        "UsersUber",
        "Doctor"
      );

      await handleUploadFirestore(
        { uidToDelete: selectedItemId },
        "DeletedUsersUber"
      );

      router.refresh();

      // Aici adaugi logica pentru a șterge elementul din sursa ta de date

      setShowModal(false); // Închide modalul după ștergere
    } catch (error) {
      console.error("Error deleting item:", error);
      // Optionally handle the error (e.g., show a notification to the user)
    }
  };

  let theadConent = ["Doctor", "Data Inregistrare", "Status Cont", "Actiune"];
  let tbodyContent = docs?.map((item) => (
    <tr key={item.id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          {/* <div className="thumb">
            <Image
              width={90}
              height={90}
              className="cover"
              src={"/assets/images/team/utilizator-test-lg.png"}
              alt="fp1.jpg"
            />
            <div className="thmb_cntnt">
              <ul className="tag mb0">
                <li className="list-inline-item">
                  <a href="#">For Rent</a>
                </li>
              </ul>
            </div>
          </div> */}
          <div className="details">
            <div className="tc_content">
              <h4>{item.numeUtilizator}</h4>
              {/* <p>
                <span className="flaticon-placeholder"></span>
                {item.location}
              </p> */}
              {/* <a className="fp_price text-thm" href="#">
                ${item.price}
                <small>/mo</small>
              </a> */}
            </div>
          </div>
        </div>
      </td>
      {/* End td */}

      <td>{item?.firstUploadDate ? item?.firstUploadDate : item?.editDate}</td>
      {/* End td */}

      <td>
        {item.statusCont === "Activ" ? (
          <span className="status_tag badge">Cont activ</span>
        ) : (
          <span className="status_tag redbadge">Cont inactiv</span>
        )}
      </td>

      {/* End td */}

      <td>
        <ul className="view_edit_delete_list mb0">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <Link href={`/verificare-doctor/${item.id}`}>
              <span className="flaticon-view"></span>
            </Link>
          </li>
          {/* End li */}

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteClick(item.user_uid);
            }}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                handleDeleteClick(item.user_uid);
              }}
            >
              <span className="flaticon-garbage"></span>
            </a>
          </li>
          {/* End li */}
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
                handleToggle(item);
              }}
            >
              {item.statusCont === "Activ" ? (
                <span className="flaticon-tick" style={styles.tick}></span>
              ) : (
                <span className="flaticon-close" style={styles.close}></span>
              )}
            </a>
          </li>
          {/* End li */}
        </ul>
      </td>
      {/* End td */}
    </tr>
  ));

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}

        <tbody>{tbodyContent}</tbody>
      </table>

      {showModal && (
        <DeleteDialog
          handleConfirmDelete={handleConfirmDelete}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default TableData;

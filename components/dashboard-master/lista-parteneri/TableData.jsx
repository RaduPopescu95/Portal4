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
import { deleteImage, deleteMultipleImages } from "@/utils/storageUtils";

// CSS in JS pentru simbolurile tick și close
const styles = {
  tick: {
    color: "green", // Verde pentru tick
  },
  close: {
    color: "red", // Roșu pentru close
  },
};

const TableData = ({ parteneri: parts }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [logoToDelete, setLogoToDelete] = useState(null);
  // const { currentUser } = useAuth();

  const handleToggle = async (doctor) => {
    console.log(doctor);
    // Mapați și transformați fiecare item asincron
    const updateParteners = await Promise.all(
      parts.map(async (item) => {
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
    console.log(updateParteners);
    router.refresh();
    // Actualizează starea offers cu noul array modificat
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteClick = (partener) => {
    console.log(partener);
    if (partener?.images) {
      setImagesToDelete([...partener?.images?.imgs]);
    } else {
      setImagesToDelete([]);
    }
    if (partener?.logo) {
      setLogoToDelete(partener?.logo?.fileName);
    } else {
      setLogoToDelete("");
    }
    setSelectedItemId(partener.user_uid); // Salvează ID-ul elementului selectat
    setShowModal(true); // Afișează modalul
  };

  // Logica de ștergere a elementului
  const handleConfirmDelete = async () => {
    setIsLoading(true);

    try {
      console.log("Deleting item with ID:", selectedItemId);
      console.log("location.....:", location);
      const fileNames = imagesToDelete.map((image) => image.fileName);

      if (fileNames.length > 0) {
        await deleteMultipleImages("ImaginiProfil", fileNames);
      }
      if (logoToDelete.length > 0) {
        await deleteImage("ProfileLogo", logoToDelete);
      }
      await handleDeleteFirestoreData(
        `${"UsersUber"}/${selectedItemId}`,
        true,
        "UsersUber",
        "Partener"
      );
      await handleUploadFirestore(
        { uidToDelete: selectedItemId },
        "DeletedUsersUber"
      );

      // Aici adaugi logica pentru a șterge elementul din sursa ta de date
      setShowModal(false); // Închide modalul după ștergere

      // Dacă dorești să aștepți până când router-ul se reîmprospătează înainte de a seta loading-ul la false
      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      // Aici poți adăuga logica de afișare a unui mesaj de eroare pentru utilizator, dacă este cazul
    } finally {
      setIsLoading(false); // Setează isLoading la false indiferent dacă ștergerea a reușit sau a eșuat
    }
  };

  let theadConent = ["Partener", "Data Inregistrare", "Status Cont", "Actiune"];
  let tbodyContent = parts?.map((item) => (
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
              <h4>{item.denumireBrand}</h4>
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
            <Link href={`/verificare-partener/${item.id}`}>
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
              handleDeleteClick(item);
            }}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                handleDeleteClick(item);
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
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default TableData;

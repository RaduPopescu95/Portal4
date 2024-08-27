import Image from "next/image";
import properties from "../../../data/properties";
import { useState } from "react";
import oferte from "@/data/oferte";
import GradeFidelitate from "./GradeFidelitate";
import Link from "next/link";
import {
  handleDeleteFirestoreSubcollectionData,
  handleUpdateFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import DeleteDialog from "@/components/common/dialogs/DeleteDialog";
import { deleteImage } from "@/utils/storageUtils";
import { useCollectionPagination } from "@/hooks/useCollectionPagination";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatTitulatura } from "@/utils/strintText";

// CSS in JS pentru simbolurile tick și close
const styles = {
  tick: {
    color: "green", // Verde pentru tick
  },
  close: {
    color: "red", // Roșu pentru close
  },
};

const TableData = ({ oferte }) => {
  console.log("TableData oferte:", oferte); // Check what is received exactly

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isMobile = useIsMobile();

  const handleDeleteClick = (item) => {
    setSelectedItem(item); // Salvează ID-ul elementului selectat
    setShowModal(true); // Afișează modalul
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logica de ștergere a elementului

  const handleConfirmDelete = async () => {
    setIsLoading(true);

    try {
      console.log("Deleting item with ID:", selectedItem);

      await handleDeleteFirestoreSubcollectionData(
        `UsersUber/${selectedItem.collectionId}/Anunturi/${selectedItem.documentId}`,
        true,
        `UsersUber/${selectedItem.collectionId}/Anunturi`,
        selectedItem
      );

      if (selectedItem.imagineOferta) {
        await deleteImage("PozeOferte", selectedItem.imagineOferta.fileName);
      }

      // Aici adaugi logica pentru a șterge elementul din sursa ta de date
      setShowModal(false); // Închide modalul după ștergere

      // Dacă dorești să aștepți până când router-ul se reîmprospătează înainte de a seta loading-ul la false
    } catch (error) {
      console.error("Error deleting item:", error);
      // Aici poți adăuga logica de afișare a unui mesaj de eroare pentru utilizator, dacă este cazul
    } finally {
      window.location.reload();
      setIsLoading(false); // Setează isLoading la false indiferent dacă ștergerea a reușit sau a eșuat
    }
  };

  const isSameOrAfter = (date1, date2) => {
    return date1.setHours(0, 0, 0, 0) >= date2.setHours(0, 0, 0, 0);
  };

  const isSameOrBefore = (date1, date2) => {
    return date1.setHours(0, 0, 0, 0) <= date2.setHours(0, 0, 0, 0);
  };

  if (!oferte || oferte.length === 0) {
    return <p>Nu exista anunturi adăugate.</p>; // Show a message if no data
  }

  let theadConent = [];

  if (isMobile) {
    theadConent = ["Anunt", "Actiune"];
  } else {
    theadConent = ["Anunt", "Data", "Status", "Data dezactivare", "Actiune"];
  }

  let tbodyContent = oferte?.map((item) => (
    <tr key={item.id}>
      <td scope="row">
        {/* <div className="feat_property list favorite_page style2"> */}
        {/* {item?.tipOferta === "Oferta specifică" && !isMobile && (
            <div className="thumb">
              <Image
                width={150}
                height={220}
                className="cover"
                src={item?.imagineOferta?.finalUri}
                alt="fp1.jpg"
              />
            </div>
          )} */}
        <div className="details d-flex justify-content-center">
          <div className="tc_content d-flex align-items-center justify-content-center">
            <h4>
              {formatTitulatura(item.titulatura)} - {item.specialitate}
            </h4>
          </div>
        </div>
        {/* </div> */}
      </td>
      {/* End td */}

      {!isMobile && <td>{item.firstUploadDate}</td>}
      {/* End td */}

      {!isMobile && (
        <td>
          {(() => {
            const today = new Date();
            const endDate = new Date(item.dataDezactivare);
            console.log("today...", today);
            console.log("today...", endDate);
            const isActive = isSameOrBefore(today, endDate);

            if (isActive) {
              return <span className="status_tag badge">Activa</span>;
            } else {
              return <span className="status_tag redbadge">Inactiva</span>;
            }
          })()}
        </td>
      )}

      {/* End td */}

      {!isMobile && (
        <td>
          {new Date(item.dataDezactivare).toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </td>
      )}

      {/* End td */}

      <td>
        <ul className="view_edit_delete_list mb0">
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
          >
            <Link
              href={`creaza-anunt-cadru-medical/${item.id}-${item.collectionId}`}
            >
              <span className="flaticon-edit"></span>
            </Link>
          </li>
          {/* End li */}

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteClick(item);
            }}
            title="Delete"
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
          {/* <li
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
              {item.status === "Activa" ? (
                <span className="flaticon-tick" style={styles.tick}></span>
              ) : item.status === "Inactiva" ? (
                <span className="flaticon-close" style={styles.close}></span>
              ) : (
                // Afișează ambele opțiuni când nu este niciuna selectată inițial
                <>
                  <span className="flaticon-tick" style={styles.tick}></span>
                  <span className="flaticon-close" style={styles.close}></span>
                </>
              )}
            </a>
          </li> */}
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

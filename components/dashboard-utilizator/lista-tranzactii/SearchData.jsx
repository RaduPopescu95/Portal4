import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleUpdateFirestoreSubcollection } from "@/utils/firestoreUtils";
import { uploadImage } from "@/utils/storageUtils";
import { AlertModal } from "@/components/common/AlertModal";
import CommonLoader from "@/components/common/CommonLoader";

const SearchData = ({ oferteInregistrate }) => {
  const [offers, setOffers] = useState([...oferteInregistrate]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const { currentUser } = useAuth();

  const updateOffers = (index, newOffer) => {
    const updatedOffers = [...offers];
    updatedOffers[index] = newOffer;
    setOffers(updatedOffers);
  };

  const handleFileSelect = (index) => async (event) => {
    setIsLoading(true);
    const file = event.target.files;
    if (file) {
      // Check if we need to update or upload a new image
      if (offers[index].imagineBonFactura?.fileName) {
        console.log("else is YES offers[index].imagineBonFactura?.fileName...");
        // Replace the existing file
        const imagineBonFactura = await uploadImage(
          file,
          true,
          "BonuriFacturi",
          offers[index].imagineBonFactura.fileName
        );
        const newOffer = { ...offers[index], imagineBonFactura };
        updateOffers(index, newOffer);
        handleUpdateFirestoreSubcollection(
          newOffer,
          `UsersUber/${offers[index].collectionId}/OferteInregistrate/${offers[index].documentId}`
        )
          .then(() => {
            showAlert("Modificare cu success!", "success");
            setIsLoading(false);
          })
          .catch((error) => {
            showAlert(`A apărut o eroare: ${error.message}`, "danger");
            setIsLoading(false);
          });
      } else {
        console.log(
          "else is not offers[index].imagineBonFactura?.fileName...",
          file
        );
        // Upload a new image
        const imagineBonFactura = await uploadImage(
          file,
          false,
          "BonuriFacturi"
        );
        console.log(
          "else is not offers[index].imagineBonFactura?.fileName...",
          imagineBonFactura
        );
        const newOffer = { ...offers[index], imagineBonFactura };
        updateOffers(index, newOffer);
        handleUpdateFirestoreSubcollection(
          newOffer,
          `UsersUber/${offers[index].collectionId}/OferteInregistrate/${offers[index].documentId}`
        )
          .then(() => {
            showAlert("Adaugare cu succes!", "success");
            setIsLoading(false);
          })
          .catch((error) => {
            showAlert(`A apărut o eroare: ${error.message}`, "danger");
            setIsLoading(false);
          });
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Titlu Anunt</th>
            <th scope="col">Nume partener</th>
            <th scope="col">Data</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((row, index) => (
            <tr key={index} className={row?.active ? "title active" : "title"}>
              <td className="para">{row?.titluOferta}</td>
              {/* <td className="para">{row.oferta?.tipOferta}</td> */}
              <td className="para">{row?.partener?.denumireBrand}</td>
              <td className="para">{row.firstUploadDate}</td>
              {/* <td className="para">
                <input
                  type="file"
                  onChange={handleFileSelect(index)}
                  style={{ display: "none" }}
                  id={`file-input-${index}`}
                />
                
                <label
                  htmlFor={`file-input-${index}`}
                  className="btn admore_btn mb30"
                >
                  {row.imagineBonFactura?.fileName
                    ? "Modifica bon/factura"
                    : "Adauga bon/factura"}
                </label>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </>
  );
};

export default SearchData;

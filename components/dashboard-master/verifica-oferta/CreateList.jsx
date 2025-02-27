"use client";

import { useAuth } from "@/context/AuthContext";
import {
  handleUpdateFirestoreSubcollection,
  handleUploadFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import { uploadImage } from "@/utils/storageUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CommonLoader from "@/components/common/CommonLoader";
import LogoUpload from "@/components/dashboard/my-profile/LogoUpload";

const CreateList = ({ oferta }) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pretIntreg, setPretIntreg] = useState(oferta?.pretIntreg || "");
  const [pretRedus, setPretRedus] = useState(oferta?.pretRedus || "");
  const [procentReducere, setProcentReducere] = useState(
    oferta?.procentReducere || ""
  );
  const [titluOferta, setTitluOferta] = useState(oferta?.titluOferta || "");
  const [descriereOferta, setDescriereOferta] = useState(
    oferta?.descriereOferta || ""
  );
  const [cerintePost, setCerintePost] = useState(oferta?.cerintePost || "");
  const [gradeFidelitate, setGradeFidelitate] = useState(
    oferta?.gradeFidelitate || []
  );
  const [fidelitySilver, setFidelitySilver] = useState(
    oferta?.gradeFidelitate?.includes("Silver") ? true : false
  );
  const [fidelityGold, setFidelityGold] = useState(
    oferta?.gradeFidelitate?.includes("Gold") ? true : false
  );
  const [fidelityPlatinum, setFidelityPlatinum] = useState(
    oferta?.gradeFidelitate?.includes("Platinum") ? true : false
  );

  const [tipOferta, setTipOferta] = useState(oferta?.tipOferta || "");
  const [dataActivare, setDataActivare] = useState(oferta?.dataActivare || "");
  const [dataDezactivare, setDataDezactivare] = useState(
    oferta?.dataDezactivare || ""
  );

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [logo, setLogo] = useState(
    oferta?.imagineOferta ? [oferta?.imagineOferta] : []
  );
  const [deletedLogo, setDeletedLogo] = useState(null);
  const [isNewLogo, setIsNewLogo] = useState(false);

  const [initialData, setInitialData] = useState({});

  let isEdit = oferta?.imagineOferta?.finalUri ? true : false;

  useEffect(() => {
    if (oferta) {
      setInitialData({
        pretIntreg: oferta.pretIntreg || "",
        pretRedus: oferta.pretRedus || "",
        procentReducere: oferta.procentReducere || "",
        titluOferta: oferta.titluOferta || "",
        descriereOferta: oferta.descriereOferta || "",
        gradeFidelitate: oferta.gradeFidelitate || [],
        tipOferta: oferta.tipOferta || "",
        dataActivare: oferta.dataActivare || "",
        dataDezactivare: oferta.dataDezactivare || "",
        logo: oferta.imagineOferta ? [oferta.imagineOferta] : [],
      });
    }
  }, [oferta]);

  const describeChanges = () => {
    let changes = [];
    Object.entries(initialData).forEach(([key, value]) => {
      let currentValue = eval(key); // Utilizează eval cu precauție sau consideră o alternativă mai sigură
      if (JSON.stringify(value) !== JSON.stringify(currentValue)) {
        changes.push(
          `${key} de la '${JSON.stringify(value)}' la '${JSON.stringify(
            currentValue
          )}'`
        );
      }
    });
    if (changes.length > 0) {
      return `${userData?.denumireBrand} a actualizat oferta ${
        oferta?.titluOferta
      }: ${changes.join(", ")}`;
    }
    return null;
  };

  // Funcție pentru a afișa alerta
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
      router.push("/lista-anunturi");
    }, 3000); // Alerta va dispărea după 3 secunde
  };

  const handleFidelityChange = (event) => {
    const { id, checked } = event.target;
    switch (id) {
      case "Silver":
        setFidelitySilver(checked);
        break;
      case "Gold":
        setFidelityGold(checked);
        break;
      case "Platinum":
        setFidelityPlatinum(checked);
        break;
    }
    setGradeFidelitate((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((gradeId) => gradeId !== id);
      }
    });
  };

  useEffect(() => {
    if (pretIntreg && pretRedus) {
      const discount = ((pretIntreg - pretRedus) / pretIntreg) * 100;
      setProcentReducere(discount.toFixed(2)); // Afișează procentul cu două zecimale
    }
  }, [pretIntreg, pretRedus]); // Recalculează la schimbarea prețului întreg sau a celui redus

  const resetState = () => {
    setImage(null);
    setPretIntreg("");
    setPretRedus("");
    setProcentReducere("");
    setTitluOferta("");
    setDescriereOferta("");
    setGradeFidelitate([]);
    setTipOferta("");
    setDataActivare("");
    setDataDezactivare("");
    setFidelitySilver(false);
    setFidelityGold(false);
    setFidelityPlatinum(false);
  };

  const handleUpdateOffer = async () => {
    setIsLoading(true);
    console.log("currentUser...", currentUser.uid);
    console.log("userData...", userData);
    let lg = {};
    if (tipOferta === "Oferta specifică") {
      if (isNewLogo) {
        lg = await uploadImage(logo, true, "PozeOferte", deletedLogo);
      } else {
        lg = oferta.imagineOferta;
      }
    }
    let data = {
      dataDezactivare,
      dataActivare,
      tipOferta,
      gradeFidelitate,
      descriereOferta,
      titluOferta,
      procentReducere,
      pretRedus,
      pretIntreg,
      status: "Activa",
      imagineOferta: lg,
    };
    try {
      const actionText = describeChanges();
      await handleUpdateFirestoreSubcollection(
        data,
        `UsersUber/${currentUser.uid}/Oferte/${oferta.documentId}`,
        actionText
      );
      setIsLoading(false);
      showAlert("Anunt actualizat cu succes!", "success");
    } catch (error) {
      setIsLoading(false);
      console.error("Eroare la actualizarea anuntului: ", error);
      showAlert("Eroare la actualizarea anuntului.", "danger");
    }
  };

  const handleAddOffer = async () => {
    setIsLoading(true);
    console.log("currentUser...", currentUser.uid);
    console.log("userData...", userData);
    let lg = {};
    try {
      if (tipOferta === "Oferta specifică") {
        if (!logo[0].fileName) {
          lg = await uploadImage(logo, false, "PozeOferte");
        } else {
          lg = logo[0];
        }
      }

      let data = {
        dataDezactivare,
        dataActivare,
        tipOferta,
        gradeFidelitate,
        descriereOferta,
        titluOferta,
        procentReducere,
        pretRedus,
        pretIntreg,
        status: "Activa",
        imagineOferta: lg,
      };

      const actionText = `${userData.denumireBrand} a creat oferta ${titluOferta}`;

      await handleUploadFirestoreSubcollection(
        data,
        `UsersUber/${currentUser.uid}/Oferte`,
        currentUser.uid,
        actionText
      );
      resetState();
      setIsLoading(false);
      showAlert("Oferta adaugata cu succes!", "success");
    } catch (error) {
      setIsLoading(false);
      console.error("Eroare la adaugarea ofertei: ", error);
      showAlert("Eroare la adaugarea ofertei.", "danger");
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

  // upload Logo
  // Handle single image selection
  const singleImage = (e) => {
    const file = e.target.files[0]; // Get the selected file
    console.log("test..here...", file.name);
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

  return (
    <>
      <LogoUpload
        singleImage={singleImage}
        deleteLogo={deleteLogo}
        logoImg={logo}
        isVerifica={true}
        isNewImage={isNewLogo}
        text={"Adauga imagine"}
      />

      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Titlu oferta</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={titluOferta}
            onChange={(e) => setTitluOferta(e.target.value)}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Descriere Post</label>
          <textarea
            className="form-control"
            id="propertyDescription"
            rows="7"
            value={descriereOferta}
            // onChange={(e) => setDescriereOferta(e.target.value)}
            readOnly
          ></textarea>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Cerinte Post</label>
          <textarea
            className="form-control"
            id="propertyDescription"
            rows="7"
            value={cerintePost}
            // onChange={(e) => setCerereOferta(e.target.value)}
            readOnly
          ></textarea>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Type</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="type1">Type1</option>
            <option data-tokens="Type2">Type2</option>
            <option data-tokens="Type3">Type3</option>
            <option data-tokens="Type4">Type4</option>
            <option data-tokens="Type5">Type5</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExamplePrice">Procent</label>
          <input
            type="number"
            className="form-control"
            id="formGroupExamplePrice"
          />
        </div>
      </div> */}

      {/* {tipOferta === "Oferta specifică" && ( */}
      <>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="activationDate">Data de activare</label>
            <input
              type="date"
              className="form-control"
              id="activationDate"
              value={dataActivare}
              onChange={(e) => setDataActivare(e.target.value)}
              readOnly
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="deactivationDate">Data de dezactivare</label>
            <input
              type="date"
              className="form-control"
              id="deactivationDate"
              value={dataDezactivare}
              onChange={(e) => setDataDezactivare(e.target.value)}
              readOnly
            />
          </div>
        </div>
        {/* End .col */}
      </>
      {/* )} */}

      {/* End .col */}
      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleArea">Area</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleArea"
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Rooms</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="Status1">1</option>
            <option data-tokens="Status2">2</option>
            <option data-tokens="Status3">3</option>
            <option data-tokens="Status4">4</option>
            <option data-tokens="Status5">5</option>
            <option data-tokens="Status6">Other</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-xl-12">
        <div className="my_profile_setting_input">
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-0`}>
              {alert.message}
            </div>
          )}
          {oferta?.titluOferta?.length > 0 ? (
            <button onClick={handleUpdateOffer} className="btn btn2 float-end">
              {isLoading ? <CommonLoader /> : "Actualizeaza"}
            </button>
          ) : (
            <button onClick={handleAddOffer} className="btn btn2 float-end">
              {isLoading ? <CommonLoader /> : "Adauga"}
            </button>
          )}
        </div>
      </div> */}
    </>
  );
};

export default CreateList;

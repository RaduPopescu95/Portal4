"use client";

import { handleUpdateFirestore } from "@/utils/firestoreUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfileInfo = ({ doctor: doc }) => {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  const handleToggle = async () => {
    console.log(doc);

    const newStatus = doc.statusCont === "Activ" ? "Inactiv" : "Activ";
    let data = {
      statusCont: newStatus,
    };
    await handleUpdateFirestore(`UsersUber/${doc.user_uid}`, data).then(() => {
      router.refresh();
    });
  };

  return (
    <div className="row">
      {/* <div className="col-lg-12">
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image1"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={uploadProfile}
                    />
                    <label
                        style={
                            profile !== null
                                ? {
                                      backgroundImage: `url(${URL.createObjectURL(
                                          profile
                                      )})`,
                                  }
                                : undefined
                        }
                        htmlFor="image1"
                    >
                        <span>
                            <i className="flaticon-download"></i> Upload Photo{" "}
                        </span>
                    </label>
                </div>
                <p>*minimum 260px x 260px</p>
            </div> */}
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput1">Nume Doctor</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput1"
            placeholder="Popescu Adrian"
            readOnly
            value={doc?.numeUtilizator}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Email</label>
          <input
            type="email"
            className="form-control"
            id="formGroupExampleEmail"
            placeholder="test@email.com"
            readOnly
            value={doc?.email}
          />
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput3">Nume</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput3"
            placeholder="Popescu Adrian"
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Titulatura</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={doc?.titulatura}
            readOnly
          >
            <option data-tokens="SelectRole">Titulatura</option>
            <option data-tokens="Agent/Agency">Medic Rezident</option>
            <option data-tokens="Agent/Agency">Medic Generalist</option>
            <option data-tokens="Agent/Agency">Medic</option>
            <option data-tokens="Agent/Agency">Medic Specialist</option>
            <option data-tokens="Agent/Agency">Medic Primar</option>
            <option data-tokens="Agent/Agency">Farmacist</option>
            <option data-tokens="Agent/Agency">Asistent Medical</option>
            <option data-tokens="SingleUser">Altele</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}
      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Titulatura</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleEmail"
            readOnly
            value={doc?.titulatura}
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Judet</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={doc?.judet}
            readOnly
          >
            <option data-tokens="SelectRole">Judet</option>
            <option data-tokens="Agent/Agency">Dambovita</option>
            <option data-tokens="SingleUser">Prahova</option>
            <option data-tokens="SingleUser">Timisoara</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Judet</label>
          <input
            type="email"
            className="form-control"
            id="formGroupExampleEmail"
            readOnly
            value={doc?.judet}
          />
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Localitate</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={doc?.localitate}
            readOnly
          >
            <option data-tokens="SelectRole">Localitate</option>
            <option data-tokens="Agent/Agency">Targoviste</option>
            <option data-tokens="SingleUser">Brasov</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Localitate</label>
          <input
            type="email"
            className="form-control"
            id="formGroupExampleEmail"
            readOnly
            value={doc?.localitate}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput7">Data nașterii</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput7"
            placeholder="02/03/1995"
            value={doc?.dataNasterii}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Specializare</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={doc?.specializare}
            readOnly
          >
            <option data-tokens="SelectRole">Specializare</option>
            <option data-tokens="Agent/Agency">
              Alergologie si imunologie
            </option>
            <option data-tokens="SingleUser">Anatomie Patologica</option>
            <option data-tokens="SingleUser">
              Anestezie si terapie intensiva (ATI)
            </option>
            <option data-tokens="SingleUser">Boli Infectioase</option>
            <option data-tokens="SingleUser">Cardiologie</option>
            <option data-tokens="SingleUser">Cardiologie pediatrica</option>
            <option data-tokens="SingleUser">Chirurgie cardiovasculara</option>
            <option data-tokens="SingleUser">Chirurgie generala</option>
            <option data-tokens="SingleUser">
              Chirurgie orala si maxilofaciala
            </option>
            <option data-tokens="SingleUser">Chirurgie pediatrica</option>
            <option data-tokens="SingleUser">
              Chirurgie plastica, reconstructiva si microchirurgie
            </option>
            <option data-tokens="SingleUser">Chirurgie toracica</option>
            <option data-tokens="SingleUser">Chirurgie vasculara</option>
            <option data-tokens="SingleUser">Dermatovenerologie</option>
            <option data-tokens="SingleUser">
              Diabet zaharat, nutritie si boli metabolice
            </option>
            <option data-tokens="SingleUser">Endocrinologie</option>
            <option data-tokens="SingleUser">Epidemiologie</option>
            <option data-tokens="SingleUser">Expertiza medicala</option>
            <option data-tokens="SingleUser">Farmacist</option>
            <option data-tokens="SingleUser">Farmacologie clinica</option>
            <option data-tokens="SingleUser">Gastroenterologie</option>
            <option data-tokens="SingleUser">
              Gastroenterologie Pediatrica
            </option>
            <option data-tokens="SingleUser">Genetica medicala</option>
            <option data-tokens="SingleUser">Geriatrie si gerontologie</option>
            <option data-tokens="SingleUser">Hematologie</option>
            <option data-tokens="SingleUser">Igiena</option>
            <option data-tokens="SingleUser">Medicina muncii</option>
            <option data-tokens="SingleUser">Medicina de familie</option>
            <option data-tokens="SingleUser">Medicina de laborator</option>
            <option data-tokens="SingleUser">Medicina de urgenta</option>
            <option data-tokens="SingleUser">
              Medicina fizica si balneologie
            </option>
            <option data-tokens="SingleUser">Medicina interna</option>
            <option data-tokens="SingleUser">Medicina legala</option>
            <option data-tokens="SingleUser">Medicina nucleara</option>
            <option data-tokens="SingleUser">Medicina sportiva</option>
            <option data-tokens="SingleUser">Microbiologie medicala</option>
            <option data-tokens="SingleUser">Nefrologie</option>
            <option data-tokens="SingleUser">Nefrologie pediatrica</option>
            <option data-tokens="SingleUser">Neonatologie</option>
            <option data-tokens="SingleUser">Neurochirurgie</option>
            <option data-tokens="SingleUser">Neurologie</option>
            <option data-tokens="SingleUser">Neurologie pediatrica</option>
            <option data-tokens="SingleUser">Obstetrica ginecologie</option>
            <option data-tokens="SingleUser">Oftalmologie</option>
            <option data-tokens="SingleUser">Oncologie medicala</option>
            <option data-tokens="SingleUser">Oncologie si hematologie</option>
            <option data-tokens="SingleUser">Oncologie pediatrica</option>
            <option data-tokens="SingleUser">Oncologie si traumatologie</option>
            <option data-tokens="SingleUser">Otorinolaringologie ORL</option>
            <option data-tokens="SingleUser">Pediatrie</option>
            <option data-tokens="SingleUser">Pneumologie</option>
            <option data-tokens="SingleUser">Pneumologie pediatrica</option>
            <option data-tokens="SingleUser">Psihiatrie</option>
            <option data-tokens="SingleUser">Psihiatrie pediatrica</option>
            <option data-tokens="SingleUser">
              Radiologie si Imagistica medicala
            </option>
            <option data-tokens="SingleUser">Radioterapie</option>
            <option data-tokens="SingleUser">Reumatologie</option>
            <option data-tokens="SingleUser">
              Sanatate publica si management
            </option>
            <option data-tokens="SingleUser">Urologie</option>
            <option data-tokens="SingleUser">Medicina generala</option>
            <option data-tokens="SingleUser">Altele</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}
      {/* {doc?.titulatura === "Asistent Medical" ? null : (
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleEmail">Specializare</label>
            <input
              type="text"
              className="form-control"
              id="formGroupExampleEmail"
              readOnly
              value={doc?.specializare}
            />
          </div>
        </div>
      )} */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">Tip Entitate</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput9"
            placeholder="Tip Enitate"
            readOnly
            value={doc?.tipEnitate}
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">CIF</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput9"
            placeholder="CIF"
            readOnly
            value={doc?.cif}
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">Cod Parafa</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput9"
            placeholder="Cod Parafa"
            readOnly
            value={doc?.codParafa}
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">CUIM</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput9"
            placeholder="CUIM"
            readOnly
            value={doc?.cuim}
          />
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-xl-12 text-right mt-4">
        <div className="my_profile_setting_input">
          {/* <button className="btn btn1">Actualizeaza Profil</button> */}
          <button className="btn btn2" onClick={handleToggle}>
            {doc.statusCont === "Activ"
              ? "Dezactiveaza Cont"
              : "Activeaza Cont"}
          </button>
        </div>
      </div>

      {/* End .col */}

      {/* <div className="col-xl-12">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput13">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput13"
                    />
                </div>
            </div> */}
      {/* End .col */}

      {/* <div className="col-xl-12">
                <div className="my_profile_setting_textarea">
                    <label htmlFor="exampleFormControlTextarea1">
                        About me
                    </label>
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="7"
                    ></textarea>
                </div>
            </div> */}
      {/* End .col */}

      {/* <div className="col-xl-12 text-right">
        <div className="my_profile_setting_input">
          <button className="btn btn1">View Public Profile</button>
          <button className="btn btn2">Activeaza</button>
        </div>
      </div> */}
      {/* End .col */}
    </div>
  );
};

export default ProfileInfo;

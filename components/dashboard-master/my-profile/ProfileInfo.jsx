'use client'

import { generateRandomGradient } from "@/utils/commonUtils";
import { useState } from "react";
import GradientSelect from "./GradientSelect";

const ProfileInfo = () => {
    const [profile, setProfile] = useState(null);
    const options = ['Opțiunea 1', 'Opțiunea 2', 'Opțiunea 3'];
    // upload profile
    const uploadProfile = (e) => {
        setProfile(e.target.files[0]);
    };

    return (
        <div className="row">
            <div className="col-lg-12">
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
                            <i className="flaticon-download"></i> încarcă Logo{" "}
                        </span>
                    </label>
                </div>
                <p>*minimum 260px x 260px</p>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput1">Denumire Brand</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput1"
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
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput3">Nume si prenume persoana de contact</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput3"
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput4">Numar de telefon persoana de contact</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput4"
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput5">Judet</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput5"
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput6">Localitate</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput6"
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput7">CUI</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput7"
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput8">Categorie</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput8"
                    />
                </div>
            </div>
            {/* End .col */}

            <div className="col-lg-12 col-xl-12">
                <div className="my_profile_setting_input ui_kit_select_search form-group">
                    <GradientSelect options={options} />
                </div>
            </div>
            {/* End .col */}

            {/* <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput11">Language</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput11"
                    />
                </div>
            </div> */}
            {/* End .col */}

            {/* <div className="col-lg-6 col-xl-6">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput12">
                        Company Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput12"
                    />
                </div>
            </div> */}
            {/* End .col */}

            <div className="col-xl-12">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput13">Adresa sediu</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput13"
                    />
                </div>
            </div>
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
                    <button className="btn btn2">Update Profile</button>
                </div>
            </div> */}
            {/* End .col */}
        </div>
    );
};

export default ProfileInfo;

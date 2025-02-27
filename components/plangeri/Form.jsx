"use client";

import { handleUploadFirestore } from "@/utils/firestoreUtils";
import React, { useState } from "react";
import { AlertModal } from "../common/AlertModal";

const Form = () => {
  const [formData, setFormData] = useState({
    form_name: "",
    form_email: "",
    form_phone: "",
    form_subject: "",
    form_message: "",
  });
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(closeAlert, 2000); // Închide alerta după 2 secunde
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formElements = Array.from(form.elements);

    formElements.forEach((element) => {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (!element.value.trim()) {
          element.classList.add("border-danger");
        } else {
          element.classList.remove("border-danger");
        }
      }
    });

    const isFormValid = formElements.every((element) => {
      return (
        !(element.tagName === "INPUT" || element.tagName === "TEXTAREA") ||
        element.value.trim()
      );
    });

    if (isFormValid) {
      try {
        await handleUploadFirestore(formData, "Plângeri");
        showAlert("Plângere trimisă cu succes!", "success");
        console.log("Formularul este valid și poate fi trimis:", formData);
        handleReset(); // Resetează formularul după trimiterea cu succes
      } catch (error) {
        console.error("Eroare transmitere plângere:", error);
        showAlert(`Eroare transmitere plângere ${error.message}`, "danger");
      }
    } else {
      console.log(
        "Formularul conține erori. Te rog completează toate câmpurile obligatorii."
      );
    }
  };

  const handleReset = () => {
    setFormData({
      form_name: "",
      form_email: "",
      form_phone: "",
      form_subject: "",
      form_message: "",
    });
  };

  return (
    <>
      <form className="contact_form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input
                id="form_name"
                name="form_name"
                className="form-control"
                required
                type="text"
                placeholder="Nume"
                value={formData.form_name}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-md-6">
            <div className="form-group">
              <input
                id="form_email"
                name="form_email"
                className="form-control required email"
                required
                type="email"
                placeholder="Email"
                value={formData.form_email}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-md-6">
            <div className="form-group">
              <input
                id="form_phone"
                name="form_phone"
                className="form-control required phone"
                required
                type="tel"
                placeholder="Numar de telefon"
                value={formData.form_phone}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-md-6">
            <div className="form-group">
              <input
                id="form_subject"
                name="form_subject"
                className="form-control required"
                required
                type="text"
                placeholder="Subiect"
                value={formData.form_subject}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-sm-12">
            <div className="form-group">
              <textarea
                id="form_message"
                name="form_message"
                className="form-control required"
                rows="8"
                required
                placeholder="Mesaj"
                value={formData.form_message}
                onChange={handleChange}
              ></textarea>
            </div>
            {/* End .col */}

            <div className="form-group mb0">
              <button type="submit" className="btn btn-lg btn-thm">
                Trimite mesaj
              </button>
            </div>
            {/* End button submit */}
          </div>
        </div>
      </form>
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </>
  );
};

export default Form;

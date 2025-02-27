import React, { useEffect, useState } from "react";
import CreateList from "@/components/dashboard/verificare-tranzactie/CreateList";
import Form from "@/components/autentificare-partener/Form";
import { useAuth } from "@/context/AuthContext";
import { authentication } from "@/firebase";

const TransactionVerification = ({ idCerere, cerere }) => {
  return (
    <div className="col-lg-12 mb10">
      <div className="breadcrumb_content style2">
        <h2 className="breadcrumb_title">Verificare cerere</h2>
      </div>

      <div className="col-lg-12">
        <div className="my_dashboard_review">
          <div className="row">
            <CreateList idCerere={idCerere} cerere={cerere} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionVerification;

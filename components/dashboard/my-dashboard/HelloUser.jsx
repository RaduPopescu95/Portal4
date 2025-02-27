"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function HelloUser() {
  const { userData } = useAuth();
  return (
    <div className="col-lg-12 mb10">
      <div className="breadcrumb_content style2">
        <h2 className="breadcrumb_title">Salut, {userData?.numeContact}</h2>
      </div>
    </div>
  );
}

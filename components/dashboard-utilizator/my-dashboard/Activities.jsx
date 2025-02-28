"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReservationDetailsModal from "./ReservationDetailsModal"; // Calea potrivită la fișierul tău

const Activities = ({ rezervari }) => {
  const now = new Date();
  // Filtrăm rezervările viitoare
  const upcomingRezervari = rezervari
    .filter((r) => r.slot && new Date(r.slot.start) > now)
    .sort((a, b) => new Date(a.slot.start) - new Date(b.slot.start));

  // Luăm prima rezervare viitoare
  const nextReservation = upcomingRezervari[0];

  // Stare pentru afișarea modalului
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Funcție de închidere a modalului
  const closeModal = () => {
    setSelectedReservation(null);
  };

  if (!nextReservation) {
    return (
      <div>
        <p>Nu există rezervări viitoare.</p>
      </div>
    );
  }

  return (
    <>
      <div className="next-reservation-card">
        <h3>Următoarea rezervare</h3>
        <p>
          <strong>Client:</strong> {nextReservation.client?.nume}{" "}
          {nextReservation.client?.prenume}
        </p>
        <p>
          <strong>Interval:</strong> {nextReservation.slot?.start} -{" "}
          {nextReservation.slot?.end}
        </p>
        <p>
          <strong>Data rezervării:</strong>{" "}
          {nextReservation.createdAt &&
            new Date(nextReservation.createdAt.seconds * 1000).toLocaleString()}
        </p>

        {/* Butonul normal de accesare a call-ului */}
        {nextReservation.linkConectareSpecialist ? (
          <Link legacyBehavior href={nextReservation.linkConectareSpecialist}>
            <a className="btn btn-primary" style={{ marginRight: "10px" }}>
              Accesează Video Call
            </a>
          </Link>
        ) : (
          <p className="text-danger">Link de video call nu este disponibil</p>
        )}

        {/* Buton nou pentru afișarea modalului cu detalii */}
        <button
          className="btn btn-info"
          onClick={() => setSelectedReservation(nextReservation)}
        >
          Detalii Rezervare
        </button>
      </div>

      {/* Dacă avem selectedReservation, afișăm modalul */}
      {selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Activities;

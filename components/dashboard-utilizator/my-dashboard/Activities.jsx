"use client";

import React from "react";
import Link from "next/link";

const Activities = ({ rezervari }) => {
  const now = new Date();
  // Filtrăm rezervările viitoare (unde data slotului este mai mare decât momentul curent)
  const upcomingRezervari = rezervari
    .filter((r) => r.slot && new Date(r.slot.start) > now)
    .sort((a, b) => new Date(a.slot.start) - new Date(b.slot.start));

  const nextReservation = upcomingRezervari[0];

  if (!nextReservation) {
    return (
      <div>
        <p>Nu există rezervări viitoare.</p>
      </div>
    );
  }

  return (
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
      {nextReservation.linkConectareSpecialist ? (
        <Link legacyBehavior href={nextReservation.linkConectareSpecialist}>
          <a className="btn btn-primary">Accesează Video Call</a>
        </Link>
      ) : (
        <p className="text-danger">
          Link de video call nu este disponibil
        </p>
      )}
    </div>
  );
};

export default Activities;

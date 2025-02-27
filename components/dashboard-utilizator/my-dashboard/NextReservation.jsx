"use client";

import React from "react";
import Link from "next/link";

const NextReservation = ({ rezervari }) => {
  const now = new Date();
  const upcomingRezervari = rezervari
    .filter((r) => r.slot && new Date(r.slot.start) > now)
    .sort((a, b) => new Date(a.slot.start) - new Date(b.slot.start));

  const nextRes = upcomingRezervari[0];

  if (!nextRes) {
    return (
      <div className="col-lg-12">
        <div className="next-reservation-card">
          <h4>Nu există rezervări viitoare</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-12">
      <div className="next-reservation-card card p-3">
        <h4>Următoarea rezervare</h4>
        <p>
          <strong>Client:</strong> {nextRes.client?.nume} {nextRes.client?.prenume}
        </p>
        <p>
          <strong>Interval:</strong> {nextRes.slot?.start} - {nextRes.slot?.end}
        </p>
        <p>
          <strong>Data rezervării:</strong>{" "}
          {nextRes.createdAt &&
            new Date(nextRes.createdAt.seconds * 1000).toLocaleString()}
        </p>
        {nextRes.linkConectareSpecialist ? (
          <Link legacyBehavior href={nextRes.linkConectareSpecialist}>
            <a className="btn btn-primary">Accesează Video Call</a>
          </Link>
        ) : (
          <span className="text-danger">Link de video call nu este disponibil</span>
        )}
      </div>
    </div>
  );
};

export default NextReservation;

// ReservationsData.jsx
import React, { useState } from "react";
import Link from "next/link";
import ReservationDetailsModal from "../my-dashboard/ReservationDetailsModal";

const ReservationsData = ({ rezervari, searchQuery }) => {
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Dacă rezervările nu există, punem un array gol
  const allRezervari = rezervari || [];

  // 1. Filtrăm după searchQuery (ex. în numele/prenumele clientului)
  //    Convertim la litere mici pentru match "case-insensitive"
  const filteredRezervari = allRezervari.filter((res) => {
    const clientName = `${res.client?.nume ?? ""} ${res.client?.prenume ?? ""}`.toLowerCase();
    const query = searchQuery.toLowerCase();

    // Poți filtra și după alte câmpuri: email, telefon etc.
    return clientName.includes(query);
  });

  // 2. Sortăm după start-ul slotului
  const sortedRezervari = filteredRezervari.sort((a, b) =>
    a.slot.start.localeCompare(b.slot.start)
  );

  // Funcție pentru formatarea intervalului
  const formatSlotInterval = (start, end) => {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const dateString = startDate.toLocaleDateString("ro-RO", dateOptions);
    const startTime = startDate.toLocaleTimeString("ro-RO", timeOptions);
    const endTime = endDate.toLocaleTimeString("ro-RO", timeOptions);
    return `${dateString} ${startTime} - ${endTime}`;
  };

  const closeModal = () => {
    setSelectedReservation(null);
  };

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Data rezervare</th>
            <th scope="col">Data Realizării rezervării</th>
            <th scope="col">Video Call Specialist</th>
            <th scope="col">Detalii</th>
          </tr>
        </thead>
        <tbody>
          {sortedRezervari.map((reservation, index) => {
            const createdAt = reservation.createdAt
              ? new Date(reservation.createdAt.seconds * 1000).toLocaleString()
              : "";

            return (
              <tr key={index} className={reservation?.active ? "title active" : "title"}>
                <td className="para">
                  {reservation.client?.nume} {reservation.client?.prenume}
                </td>
                <td className="para">
                  {formatSlotInterval(reservation.slot?.start, reservation.slot?.end)}
                </td>
                <td className="para">{createdAt}</td>
                <td className="para">
                  {reservation.linkConectareSpecialist ? (
                    <Link href={reservation.linkConectareSpecialist} className="btn btn-primary">
                      Accesează Video Call
                    </Link>
                  ) : (
                    "Link indisponibil"
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => setSelectedReservation(reservation)}
                  >
                    Detalii
                  </button>
                </td>
              </tr>
            );
          })}
          {sortedRezervari.length === 0 && (
            <tr>
              <td colSpan="5">Nu există rezervări care să corespundă căutării.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedReservation && (
        <ReservationDetailsModal reservation={selectedReservation} onClose={closeModal} />
      )}
    </>
  );
};

export default ReservationsData;

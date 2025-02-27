import React from "react";
import Link from "next/link";

const ReservationsData = ({ rezervari }) => {
  // Sortează rezervările după data de început a slotului
  const sortedRezervari = (rezervari || []).sort((a, b) =>
    a.slot.start.localeCompare(b.slot.start)
  );

  // Funcția helper pentru formatarea intervalului slot (definită mai sus)
  const formatSlotInterval = (start, end) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateString = startDate.toLocaleDateString('ro-RO', dateOptions);
    const startTime = startDate.toLocaleTimeString('ro-RO', timeOptions);
    const endTime = endDate.toLocaleTimeString('ro-RO', timeOptions);
    return `${dateString} ${startTime} - ${endTime}`;
  };

  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Client</th>
          <th scope="col">Data rezervare</th>
          <th scope="col">Data Realizarii rezervarii</th>
          <th scope="col">Video Call Specialist</th>
        </tr>
      </thead>
      <tbody>
        {sortedRezervari.map((reservation, index) => (
          <tr key={index} className={reservation?.active ? "title active" : "title"}>
            <td className="para">
              {reservation.client?.nume} {reservation.client?.prenume}
            </td>
            <td className="para">
              {formatSlotInterval(reservation.slot?.start, reservation.slot?.end)}
            </td>
            <td className="para">
              {reservation.createdAt &&
                new Date(reservation.createdAt.seconds * 1000).toLocaleString()}
            </td>
            <td className="para">
              {reservation.linkConectareSpecialist ? (
                <Link href={reservation.linkConectareSpecialist} className="btn btn-primary">
                  Accesează Video Call
                </Link>
              ) : (
                "Link indisponibil"
              )}
            </td>
          </tr>
        ))}
        {sortedRezervari.length === 0 && (
          <tr>
            <td colSpan="4">Nu există rezervări.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ReservationsData;

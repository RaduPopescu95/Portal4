import React from "react";
import Link from "next/link";

const ReservationsData = ({ rezervari }) => {
  // Asigurăm că rezervari este un array (fallback la [])
  const sortedRezervari = (rezervari || []).sort((a, b) =>
    a.slot.start.localeCompare(b.slot.start)
  );

  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Client</th>
          <th scope="col">Interval Slot</th>
          <th scope="col">Data Rezervării</th>
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
              {reservation.slot?.start} - {reservation.slot?.end}
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

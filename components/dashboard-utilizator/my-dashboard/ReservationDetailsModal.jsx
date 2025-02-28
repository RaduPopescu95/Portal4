import React from "react";

const ReservationDetailsModal = ({ reservation, onClose }) => {
  if (!reservation) return null; // Dacă nu există date, nu afișăm nimic

  const clientData = reservation.client || {};
  const slotData = reservation.slot || {};
  const createdAt = reservation.createdAt
    ? new Date(reservation.createdAt.seconds * 1000).toLocaleString()
    : null;

  // Funcție de formatare interval
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

  // Buton pentru copierea link-ului clientului în clipboard
  const copyClientLink = () => {
    if (reservation.linkConectareUtilizator) {
      navigator.clipboard.writeText(reservation.linkConectareUtilizator);
      window.alert("Linkul de conectare pentru client a fost copiat!");
    }
  };

  // Buton pentru accesarea link-ului specialistului (într-o nouă filă)
  const openSpecialistLink = () => {
    if (reservation.linkConectareSpecialist) {
      window.open(reservation.linkConectareSpecialist, "_blank");
    }
  };

  // Buton "Apelează client"
  const callClient = () => {
    if (clientData.telefon) {
      window.open(`tel:${clientData.telefon}`);
      // Alternativ: <a href={`tel:${clientData.telefon}`} />
    }
  };

  // Buton "Trimite Email client"
  const emailClient = () => {
    if (clientData.email) {
      window.open(`mailto:${clientData.email}?subject=Salutare&body=Mesaj...`);
      // Poți personaliza subiectul și conținutul mail-ului în query string
    }
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      {/* Overlay transparent */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={onClose}
      ></div>

      {/* Conținut modal */}
      <div
        className="modal-dialog modal-lg"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalii Rezervare</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <p>
              <strong>Client:</strong> {clientData.nume} {clientData.prenume}
            </p>

            <p style={{ display: "flex", alignItems: "center" }}>
              <strong>Email client:</strong>&nbsp;{clientData.email || "—"}
              {clientData.email && (
                <button
                  className="btn btn-sm btn-primary"
                  style={{ marginLeft: "10px" }}
                  onClick={emailClient}
                >
                  Trimite Email
                </button>
              )}
            </p>

            <p style={{ display: "flex", alignItems: "center" }}>
              <strong>Telefon client:</strong>&nbsp;{clientData.telefon || "—"}
              {clientData.telefon && (
                <button
                  className="btn btn-sm btn-primary"
                  style={{ marginLeft: "10px" }}
                  onClick={callClient}
                >
                  Apelează
                </button>
              )}
            </p>

            <hr />

            <p>
              <strong>Interval:</strong>{" "}
              {formatSlotInterval(slotData.start, slotData.end)}
            </p>
            <p>
              <strong>Creat la:</strong> {createdAt || "N/A"}
            </p>
            <hr />

            <div style={{ marginBottom: "1rem" }}>
              <strong>Link conexiune Specialist: </strong>
              {reservation.linkConectareSpecialist ? (
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "10px" }}
                  onClick={openSpecialistLink}
                >
                  Accesează Video Call
                </button>
              ) : (
                "Nu există"
              )}
            </div>

            <div>
              <strong>Link conexiune Client: </strong>
              {reservation.linkConectareUtilizator ? (
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "10px" }}
                  onClick={copyClientLink}
                >
                  Copiază link Conectare Client
                </button>
              ) : (
                "Nu există"
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;

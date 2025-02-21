import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { FaTimes } from "react-icons/fa";
import ReservationForm from "./ReservationForm";
import { AlertModal } from "../AlertModal";

const CalendarRezervari = ({ specialistUid }) => {
  // Sloturile disponibile (din availableSlots)
  const [events, setEvents] = useState([]);
  // Rezervările existente (din RezervariConsultatii)
  const [bookedEvents, setBookedEvents] = useState([]);
  // Sloturile libere pentru ziua selectată (calculat la click)
  const [daySlots, setDaySlots] = useState([]);
  // Slotul selectat pentru rezervare
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Controlul afișării formularului de rezervare
  const [showReservationForm, setShowReservationForm] = useState(false);
  // Starea pentru alert (poate redenumi "alert" în "alertData" dacă se dorește)
  const [alertData, setAlertData] = useState({ message: "", type: "" });

  // Preluăm sloturile disponibile
  const fetchSlots = async () => {
    try {
      const slotsRef = collection(db, "UsersUber", specialistUid, "availableSlots");
      const snapshot = await getDocs(slotsRef);
      const fetchedSlots = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        documentId: docSnap.id,
      }));

      // Mapăm pentru FullCalendar (fără booked slots)
      const mappedEvents = fetchedSlots.map((slot) => ({
        title: `Slot: ${slot.start} - ${slot.end}`,
        start: `${slot.date}T${slot.start}`,
        end: `${slot.date}T${slot.end}`,
        documentId: slot.documentId,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Eroare la fetch-ul sloturilor:", error);
    }
  };

  // Preluăm rezervările existente
  const fetchBookedSlots = async () => {
    try {
      const rezervariRef = collection(db, "UsersUber", specialistUid, "RezervariConsultatii");
      const snapshot = await getDocs(rezervariRef);
      const booked = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        // Presupunem că în rezervare data.slot.documentId este setat
        return {
          documentId: data.slot.documentId,
          // Pentru a putea compara, nu mai este nevoie de alte câmpuri aici
        };
      });
      setBookedEvents(booked);
    } catch (error) {
      console.error("Eroare la fetch-ul rezervărilor:", error);
    }
  };

  useEffect(() => {
    if (specialistUid) {
      fetchSlots();
      fetchBookedSlots();
    }
  }, [specialistUid]);

  // Calculăm evenimentele libere din calendar
  const freeEvents = events.filter(
    (event) => !bookedEvents.some((booked) => booked.documentId === event.documentId)
  );

  // Când se face click pe o zi, filtrăm sloturile libere din acea zi
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr; // format: "YYYY-MM-DD"
    const slotsForDay = freeEvents.filter(
      (event) => event.start.split("T")[0] === clickedDate
    );
    if (slotsForDay.length > 0) {
      setDaySlots(slotsForDay);
    } else {
      window.alert("Nu sunt sloturi disponibile pentru această dată.");
    }
    setSelectedSlot(null);
    setShowReservationForm(false);
  };

  // Finalizarea rezervării
  const handleReservationSubmit = async (reservationData) => {
    try {
      const rezervareStructura = {
        slot: selectedSlot, // datele slotului rezervat
        client: reservationData, // datele clientului (inclusiv email)
        createdAt: new Date(),
        specialistId: specialistUid,
      };

      const rezervariRef = collection(db, "UsersUber", specialistUid, "RezervariConsultatii");
      const rezervareDocRef = await addDoc(rezervariRef, rezervareStructura);
      const rezervareDocId = rezervareDocRef.id;

      const domain = "https://www.workspace.com";
      const linkConectareUtilizator = `${domain}/video-call?idConnect=${rezervareDocId}-${specialistUid}`;

      await updateDoc(
        doc(db, "UsersUber", specialistUid, "RezervariConsultatii", rezervareDocId),
        {
          channel: rezervareDocId,
          linkConectareUtilizator,
        }
      );

      console.log("Rezervare finalizată cu succes:", {
        ...rezervareStructura,
        channel: rezervareDocId,
        linkConectareUtilizator,
      });

      setAlertData({
        message: (
          <>
            Rezervare finalizată!<br />
            Linkul de conectare a fost trimis pe email:{" "}
            <strong>{reservationData.email}</strong>
            <br />
            <button
              onClick={() => {
                navigator.clipboard.writeText(linkConectareUtilizator);
                window.alert("Linkul de conectare a fost copiat în clipboard!");
              }}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#4caf50",
                color: "white",
                cursor: "pointer",
              }}
            >
              Copiază linkul de conectare
            </button>
          </>
        ),
        type: "success",
      });

      setDaySlots([]);
      setSelectedSlot(null);
      setShowReservationForm(false);
      // Reîmprospătăm rezervările pentru a actualiza freeEvents
      fetchBookedSlots();
    } catch (error) {
      console.error("Eroare la finalizarea rezervării:", error);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        events={freeEvents} // afișăm doar sloturile libere
        dateClick={handleDateClick}
        dayCellDidMount={(info) => {
          const dateStr = info.date.toISOString().split("T")[0];
          // Verificăm toate sloturile disponibile (indiferent de status)
          const totalForDay = events.filter((event) => event.start.startsWith(dateStr));
          // Din acestea, selectăm doar cele libere
          const freeForDay = freeEvents.filter((event) => event.start.startsWith(dateStr));
          info.el.style.backgroundColor = "";
          // if (totalForDay.length > 0) {
          //   // Dacă există sloturi în acea zi:
          //   if (freeForDay.length > 0) {
          //     // Există cel puțin un slot liber: culoare verde
          //     info.el.style.backgroundColor = "#c8e6c9";
          //   } else {
          //     // Există sloturi, dar toate sunt rezervate: culoare roșie
          //     info.el.style.backgroundColor = "#ffcdd2";
          //   }
          // } else {
          //   // Dacă nu există niciun slot (nici liber, nici rezervat): lasă stilul default
          //   info.el.style.backgroundColor = "";
          // }
        }}
        
      />

      {/* Dialogul pentru selectarea sloturilor libere */}
      {!showReservationForm && daySlots.length > 0 && (
        <div className="reservation-dialog-overlay">
          <div className="reservation-dialog">
            <h2>
              Selectează un slot pentru data {daySlots[0].start.split("T")[0]}
            </h2>
            <ul className="slot-list" style={{ listStyle: "none", padding: 0 }}>
              {daySlots.map((slot) => (
                <li
                  key={slot.documentId}
                  onClick={() => setSelectedSlot(slot)}
                  className={`slot-item ${
                    selectedSlot && selectedSlot.documentId === slot.documentId ? "active" : ""
                  }`}
                  style={{
                    padding: "10px",
                    marginBottom: "5px",
                    backgroundColor:
                      selectedSlot && selectedSlot.documentId === slot.documentId ? "#e0f7fa" : "#f1f1f1",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <strong>Interval orar:</strong> {slot.title.replace("Slot: ", "")}
                </li>
              ))}
            </ul>
            <button
              className="btn btn-thm"
              disabled={!selectedSlot}
              onClick={() => setShowReservationForm(true)}
            >
              Rezervă Consultație
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setDaySlots([]);
                setSelectedSlot(null);
              }}
              style={{ marginLeft: "10px" }}
            >
              <FaTimes /> Anulează
            </button>
          </div>
        </div>
      )}

      {/* Formularul de rezervare */}
      {showReservationForm && selectedSlot && (
        <ReservationForm
          slot={selectedSlot}
          onSubmit={handleReservationSubmit}
          onCancel={() => setShowReservationForm(false)}
        />
      )}

      {/* AlertModal pentru mesaje */}
      {alertData.message && (
        <AlertModal
          message={alertData.message}
          type={alertData.type}
          onClose={() => setAlertData({ message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default CalendarRezervari;

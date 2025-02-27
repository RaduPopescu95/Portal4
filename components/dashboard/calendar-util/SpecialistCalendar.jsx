"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Header from "../../common/header/dashboard-utilizator/Header";
import SidebarMenu from "../../common/header/dashboard-utilizator/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import TimePicker from "react-time-picker";
import ContactCTA from "@/components/dashboard-utilizator/my-dashboard/ContactCTA";

const SpecialistCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotsForDate, setSlotsForDate] = useState([]);
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const [error, setError] = useState("");
    const { userData } = useAuth();

  // Mock data fetching pentru sloturi
  // const fetchSlots = async () => {
  //   const mockSlots = [
  //     { id: "1", date: "2025-02-10", start: "09:00", end: "10:00" },
  //     { id: "2", date: "2025-02-10", start: "11:00", end: "12:00" },
  //     { id: "3", date: "2025-02-11", start: "14:00", end: "15:00" },
  //   ];
  //   setEvents(
  //     mockSlots.map((slot) => ({
  //       title: `Slot: ${slot.start} - ${slot.end}`,
  //       start: `${slot.date}T${slot.start}`,
  //       end: `${slot.date}T${slot.end}`,
  //       id: slot.documentId,
  //     }))
  //   );
  // };

    // Adaugă un nou slot cu validare
    // const handleAddSlot = () => {
    //   if (newStartTime >= newEndTime) {
    //     setError("Ora de început trebuie să fie mai mică decât ora de sfârșit.");
    //     return;
    //   }
    //   const newSlot = {
    //     title: `Slot: ${newStartTime} - ${newEndTime}`,
    //     start: `${selectedDate}T${newStartTime}`,
    //     end: `${selectedDate}T${newEndTime}`,
    //     id: Math.random().toString(), // Generăm un ID unic temporar
    //   };
    //   setEvents([...events, newSlot]);
    //   setSlotsForDate([...slotsForDate, newSlot]);
    //   // Resetăm formularul după adăugare
    //   setNewStartTime("09:00");
    //   setNewEndTime("10:00");
    //   setError("");
    // };
  
    // Șterge un slot
    // const handleDeleteSlot = (slotId) => {
    //   setEvents(events.filter((event) => event.id !== slotId));
    //   setSlotsForDate(slotsForDate.filter((slot) => slot.documentId !== slotId));
    // };

// Fetch slots din subcolecție pentru utilizatorul curent
const fetchSlots = async () => {
  try {
    const slotsRef = collection(db, "UsersUber", userData?.user_uid, "availableSlots");
    const snapshot = await getDocs(slotsRef);
    const fetchedSlots = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setEvents(
      fetchedSlots.map((slot) => ({
        title: `Slot: ${slot.start} - ${slot.end}`,
        start: `${slot.date}T${slot.start}`,
        end: `${slot.date}T${slot.end}`,
        documentId: slot.documentId, // Utilizăm documentId ca identificator
      }))
    );
  } catch (error) {
    console.error("Eroare la fetch-ul sloturilor:", error);
  }
};

// Verifică dacă există deja un slot suprapus
const isSlotOverlapping = (newSlot) => {
  return events.some((slot) => {
    return (
      slot.start.split("T")[0] === newSlot.date &&
      ((newSlot.start >= slot.start.split("T")[1] && newSlot.start < slot.end.split("T")[1]) ||
        (newSlot.end > slot.start.split("T")[1] && newSlot.end <= slot.end.split("T")[1]) ||
        (newSlot.start <= slot.start.split("T")[1] && newSlot.end >= slot.end.split("T")[1]))
    );
  });
};

// / Adaugă un nou slot în subcolecția Firestore

const handleAddSlot = async () => {
  if (newStartTime >= newEndTime) {
    setError("Ora de început trebuie să fie mai mică decât ora de sfârșit.");
    return;
  }

  if (isSlotOverlapping({ date: selectedDate, start: newStartTime, end: newEndTime })) {
    setError("Slotul se suprapune cu un alt slot existent.");
    return;
  }

  const slotsToAdd = [];
  const initialDate = new Date(selectedDate);

  // Generăm sloturi pentru următoarele 4 săptămâni doar dacă repeatWeekly este true
  for (let i = 0; i < (repeatWeekly ? 4 : 1); i++) {
    const currentDate = new Date(initialDate);
    currentDate.setDate(initialDate.getDate() + i * 7);
    const formattedDate = currentDate.toISOString().split("T")[0];

    slotsToAdd.push({
      date: formattedDate,
      start: newStartTime,
      end: newEndTime,
      createdAt: serverTimestamp(),
    });
  }

  try {
    const slotsRef = collection(db, "UsersUber", userData?.user_uid, "availableSlots");
    const batchPromises = slotsToAdd.map(async (slot) => {
      const docRef = await addDoc(slotsRef, slot);
      await updateDoc(doc(slotsRef, docRef.id), { documentId: docRef.id });
      return { ...slot, documentId: docRef.id };
    });

    const addedSlots = await Promise.all(batchPromises);

    setEvents((prevEvents) => [
      ...prevEvents,
      ...addedSlots.map((slot) => ({
        ...slot,
        title: `Slot: ${slot.start} - ${slot.end}`,
        start: `${slot.date}T${slot.start}`,
        end: `${slot.date}T${slot.end}`,
      })),
    ]);

    setSlotsForDate((prevSlots) => [
      ...prevSlots,
      ...addedSlots.map((slot) => ({
        ...slot,
        title: `Slot: ${slot.start} - ${slot.end}`,
        start: `${slot.date}T${slot.start}`,
        end: `${slot.date}T${slot.end}`,
      })),
    ]);

    setNewStartTime("09:00");
    setNewEndTime("10:00");
    setRepeatWeekly(false);  // Resetăm checkbox-ul
    setError("");
  } catch (error) {
    console.error("Eroare la adăugarea sloturilor:", error);
  }
};





// Șterge un slot din Firestore folosind documentId
const handleDeleteSlot = async (slotId) => {
  if (!slotId) {
    console.error("ID-ul slotului este invalid.", slotId);
    return;
  }

  try {
    const slotDocRef = doc(db, "UsersUber", userData?.user_uid, "availableSlots", slotId);
    await deleteDoc(slotDocRef);

    // Actualizăm state-ul după ce documentul a fost șters
    setEvents((prevEvents) => prevEvents.filter((event) => event.documentId !== slotId));
    setSlotsForDate((prevSlots) => prevSlots.filter((slot) => slot.documentId !== slotId));

    console.log("Slotul a fost șters și state-ul actualizat.");
  } catch (error) {
    console.error("Eroare la ștergerea slotului:", error);
  }
};


  useEffect(() => {
    if (userData?.user_uid) {
      fetchSlots();
    }
  }, [userData]);

  // Când se face click pe o dată, se afișează sloturile din acea zi
  const handleDateClick = (info) => {
    const slots = events.filter((event) => event.start.startsWith(info.dateStr));
    setSlotsForDate(slots);
    setSelectedDate(info.dateStr);
    // Resetăm formularul și eventualele erori
    setNewStartTime("09:00");
    setNewEndTime("10:00");
    setError("");
  };



  return (
    <>
      <Header />
      <MobileMenu />
      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
        >
          <SidebarMenu />
        </div>
      </div>
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div style={styles.container}>
          <h1 style={styles.title}>Calendar Disponibilitate</h1>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            events={events}
            dateClick={handleDateClick}
          />
          {selectedDate && (
            <div style={styles.dialogOverlay}>
              <div style={styles.dialog}>
                <h2>Sloturi pentru {selectedDate}</h2>
                {slotsForDate.length > 0 ? (
                  slotsForDate.map((slot) => (
                    <div key={slot.documentId} style={styles.slot}>
                      <span>{slot.title}</span>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDeleteSlot(slot.documentId)}
                      >
                        <FaTrash style={{ marginRight: "5px" }} /> Șterge
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Nu există sloturi pentru această dată.</p>
                )}
                <div style={styles.formGroup}>
                <h2 style={styles.adaugaSloturi}>Adaugă sloturi</h2>
                <label htmlFor="startTime">Ora de început</label>
<TimePicker
  onChange={setNewStartTime}
  value={newStartTime}
  format="HH:mm"
  disableClock={true}
  clearIcon={null}
  id="startTime"
  style={{ width: '200px', fontSize: '16px', padding: '8px' }}
/>

                </div>
                <div style={styles.formGroup}>
                <label htmlFor="endTime">Ora de sfârșit</label>
<TimePicker
  onChange={setNewEndTime}
  value={newEndTime}
  format="HH:mm"
  disableClock={true}
  clearIcon={null}
  id="endTime"
  style={{ width: '200px !important', fontSize: '16px', padding: '8px' }}
/>

                </div>
                <div style={styles.formGroup}>
  <label htmlFor="repeatWeekly">Repetare săptămânală (4 săptămâni)</label>
  <input
    type="checkbox"
    id="repeatWeekly"
    checked={repeatWeekly}
    onChange={(e) => setRepeatWeekly(e.target.checked)}
    style={{ marginLeft: "10px" }}
  />
</div>


{error && <p style={styles.error}>{error}</p>}
<div style={styles.buttonContainer}>
  <button style={styles.button} onClick={handleAddSlot}>
    <FaPlus style={{ marginRight: "5px" }} /> Adaugă Slot
  </button>
  <button
    style={styles.closeButton}
    onClick={() => setSelectedDate(null)}
  >
    <FaTimes style={{ marginRight: "5px" }} /> Închide
  </button>
</div>

              </div>
            </div>
          )}
        </div>
        <ContactCTA /> 
      </section>
     
    </>
  );
};

// Stiluri CSS in-line
const styles = {
  buttonContainer: {
    display: "flex",
    gap: "10px", // spațiere între butoane
    marginTop: "15px",
  },
  adaugaSloturi:{
    marginTop:"2%"
  },
  container: {
    width: "90%",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  dialogOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "600px",
    zIndex: 1060,
  },
  slot: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ccc",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
    display: "flex",       // Asigură alinierea în linie
    alignItems: "center",  // Centrează vertical iconul și textul
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  error: {
    color: "#f44336",
    marginBottom: "10px",
  },
};

export default SpecialistCalendar;

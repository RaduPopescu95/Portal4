"use client";

import React from "react";

const AllStatistics = ({ rezervari }) => {
  // Data de azi în format ISO "YYYY-MM-DD"
  const today = new Date().toISOString().split("T")[0];

  const rezervariAstazi = rezervari.filter(
    (r) => r.slot && r.slot.start.split("T")[0] === today
  ).length;

  // Calculăm începutul și sfârșitul săptămânii curente (presupunem că săptămâna începe luni)
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay(); // Sunday=0, Monday=1, etc.
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - adjustedDay + 1);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  const rezervariSaptamana = rezervari.filter((r) => {
    if (r.slot && r.slot.start) {
      const slotDate = new Date(r.slot.start);
      return slotDate >= firstDayOfWeek && slotDate <= lastDayOfWeek;
    }
    return false;
  }).length;

  return (
    <>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4">
        <div className="ff_one">
          <div className="detais">
            <div className="timer">{rezervariAstazi}</div>
            <p>Rezervări astăzi</p>
          </div>
          <div className="icon">
            <span className="flaticon-calendar"></span>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4">
        <div className="ff_one style2">
          <div className="detais">
            <div className="timer">{rezervariSaptamana}</div>
            <p>Rezervări săptămâna aceasta</p>
          </div>
          <div className="icon">
            <span className="flaticon-calendar-1"></span>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4">
        <div className="ff_one style3">
          <div className="detais">
            <div className="timer">{rezervari.length}</div>
            <p>Rezervări totale</p>
          </div>
          <div className="icon">
            <span className="flaticon-checklist"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllStatistics;

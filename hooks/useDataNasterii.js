import { useState } from "react";

function useDataNasterii(initialDate) {
  const [dataNasterii, setDataNasterii] = useState(initialDate);

  const handleDayChange = (e) => {
    const newDate = new Date(dataNasterii || new Date());
    newDate.setDate(e.target.value);
    updateDateState(newDate);
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(dataNasterii || new Date());
    newDate.setMonth(e.target.value);
    updateDateState(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(dataNasterii || new Date());
    newDate.setFullYear(e.target.value);
    updateDateState(newDate);
  };

  const updateDateState = (newDate) => {
    console.log("new data...", newDate);
    setDataNasterii(newDate.toISOString().substr(0, 10));
  };

  return {
    dataNasterii,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    setDataNasterii,
  };
}

export default useDataNasterii;

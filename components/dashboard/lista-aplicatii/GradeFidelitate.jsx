import React from "react";

export default function GradeFidelitate({ grades }) {
  const gradesDisplay =
    grades && grades.length > 0 ? grades.join(", ") : "Niciun grad specificat";
  return <td>{gradesDisplay}</td>;
}

import React from "react";

export default function FormularContact({ docCV }) {
  return (
    <a
      className="details custom-alignment"
      href={docCV.docUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="tc_content">
        <button className="btn btn-thm btn-lg">Descarca CV</button>
      </div>
    </a>
  );
}

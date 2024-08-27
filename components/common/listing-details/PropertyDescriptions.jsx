"use client";

import { useState } from "react";

const PropertyDescriptions = ({ oferta }) => {
  const [click, setClick] = useState(true);
  const handleClick = () => setClick(!click);

  return (
    <>
      <p className="mt10 mb10">{oferta?.descriereOferta}</p>
    </>
  );
};

export default PropertyDescriptions;

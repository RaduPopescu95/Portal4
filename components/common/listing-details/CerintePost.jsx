"use client";

import { useState } from "react";

const CerintePost = ({ oferta }) => {
  const [click, setClick] = useState(true);
  const handleClick = () => setClick(!click);

  return (
    <>
      <p className="mt10 mb10">{oferta?.cerintePost}</p>
    </>
  );
};

export default CerintePost;

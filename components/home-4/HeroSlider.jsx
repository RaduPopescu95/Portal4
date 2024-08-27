"use client";

import Slider from "react-slick";
import React, { useState, useEffect } from "react";

const HeroSlider = () => {
  // Stabilirea unei stări pentru a verifica dacă este un dispozitiv mobil
  const [isMobile, setIsMobile] = useState(false);

  // Verificarea dimensiunii ferestrei pentru a determina dacă este un dispozitiv mobil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px este în general considerat un prag pentru dispozitive mobile
    };

    // Verifica imediat și la redimensionarea ferestrei
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    arrows: false, // Ascunde săgețile pentru dispozitive mobile
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  return (
    <Slider {...settings}>
      <div className="slide slide-one image-1"></div>
      {/* <div className="slide slide-one image-2"></div>
      <div className="slide slide-one image-1"></div> */}
    </Slider>
  );
};

export default HeroSlider;

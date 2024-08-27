import Link from "next/link";
import Slider from "react-slick";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateRandomGradient } from "@/utils/commonUtils";
import properties from "@/data/properties";

const GradientSelect = () => {
  const [selectedId, setSelectedId] = useState(null); // Acum stocăm un singur ID
  const [pops, setProperties] = useState([]); // Stocăm proprietățile cu gradientul generat

  useEffect(() => {
    // Adaugă un gradient fiecărei proprietăți la încărcarea componentei
    const propertiesWithGradient = properties.slice(0, 12).map((item) => ({
      ...item,
      gradient: generateRandomGradient(),
    }));
    setProperties(propertiesWithGradient);
  }, []); // Dependența goală indică faptul că efectul se rulează o singură dată la montarea componentei


  const toggleSelect = (id) => {
    setSelectedId((prevSelectedId) =>
      prevSelectedId === id ? null : id // Deselectează dacă este același ID sau selectează noul ID
    );
  };

  const settings = {
    dots: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: false,
    speed: 1200,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...settings} arrows={false}>
        {pops.map((item) => (
          <div className="item" key={item.id} onClick={() => toggleSelect(item.id)} style={{ cursor: 'pointer' }}>
            <div className="feat_property home3">
              <div
                className="thumb"
                style={{
                  backgroundImage: item.gradient, // Folosește gradientul stocat
                  width: '95%',
                  height: '220px',
                  backgroundSize: 'cover',
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                  borderRadius: '15px',
                  borderColor: '#E0E0E0',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {selectedId === item.id && (
                  <span className="flaticon-tick" style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', fontSize: '24px' }} />
                )}
                <Image
                  width={300}
                  height={220}
                  className="img-whp w-100 h-100 cover"
                  src={item.img}
                  alt="properties identity"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default GradientSelect;

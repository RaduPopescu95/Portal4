import Link from "next/link";
import Slider from "react-slick";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateRandomGradient } from "@/utils/commonUtils";
import properties from "@/data/properties";
import carduriFidelitate from "@/data/carduriFidelitate";

const predefinedGradients = [
  "linear-gradient(to right, rgb(62, 62, 165), rgb(72, 61, 163))",
  "linear-gradient(to right, rgb(119, 55, 154), rgb(131, 53, 151))",
  "linear-gradient(to right, rgb(178, 47, 141), rgb(189, 46, 139))",
  "linear-gradient(to right, rgb(236, 40, 129), rgb(255, 90, 95))",
];
// const predefinedGradients = [
//   // "linear-gradient(to right, rgb(62, 62, 165), rgb(72, 61, 163))",
//   "linear-gradient(to right, rgb(72, 61, 163), rgb(84, 59, 161))",
//   "linear-gradient(to right, rgb(84, 59, 161), rgb(95, 58, 159))",
//   "linear-gradient(to right, rgb(95, 58, 159), rgb(107, 56, 156))",
//   "linear-gradient(to right, rgb(107, 56, 156), rgb(119, 55, 154))",
//   // "linear-gradient(to right, rgb(119, 55, 154), rgb(131, 53, 151))",
//   "linear-gradient(to right, rgb(131, 53, 151), rgb(142, 52, 149))",
//   "linear-gradient(to right, rgb(142, 52, 149), rgb(154, 50, 146))",
//   "linear-gradient(to right, rgb(154, 50, 146), rgb(166, 49, 144))",
//   "linear-gradient(to right, rgb(166, 49, 144), rgb(178, 47, 141))",
//   // "linear-gradient(to right, rgb(178, 47, 141), rgb(189, 46, 139))",
//   "linear-gradient(to right, rgb(189, 46, 139), rgb(201, 44, 136))",
//   "linear-gradient(to right, rgb(201, 44, 136), rgb(213, 43, 134))",
//   "linear-gradient(to right, rgb(213, 43, 134), rgb(224, 41, 132))",
//   "linear-gradient(to right, rgb(224, 41, 132), rgb(236, 40, 129))",
//   // "linear-gradient(to right, rgb(236, 40, 129), rgb(255, 90, 95))",
// ];

const GradientSelect = ({
  selectedId,
  setSelectedId,
  gradientSelected,
  setSelectedGradient,
}) => {
  const [pops, setProperties] = useState([]); // Stocăm proprietățile cu gradientul generat

  useEffect(() => {
    // Adaugă un gradient fiecărei proprietăți la încărcarea componentei
    const propertiesWithGradient = carduriFidelitate
      .slice(0, 4)
      .map((item, index) => ({
        ...item,
        gradient: predefinedGradients[index % predefinedGradients.length],
      }));
    setProperties(propertiesWithGradient);
  }, []); // Dependența goală indică faptul că efectul se rulează o singură dată la montarea componentei

  const toggleSelect = (id, gradient) => {
    setSelectedId((prevSelectedId) => {
      if (prevSelectedId === id) {
        setSelectedGradient(""); // Resetare gradient când deselectăm
        return null; // Deselectează dacă este același ID
      } else {
        setSelectedGradient(gradient); // Setare gradient nou
        return id; // Selectează noul ID
      }
    });
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
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...settings} arrows={false}>
        {pops.map((item) => (
          <div
            className="item"
            key={item.id}
            onClick={() => toggleSelect(item.id, item.gradient)}
            style={{ cursor: "pointer" }}
          >
            <div className="feat_property home3">
              <div
                className="thumb"
                style={{
                  backgroundImage: item.gradient, // Folosește gradientul stocat
                  width: "95%",
                  height: "220px",
                  backgroundSize: "cover",
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  borderRadius: "15px",
                  borderColor: "#E0E0E0",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {selectedId === item.id && (
                  <span
                    className="flaticon-tick"
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      color: "white",
                      fontSize: "24px",
                    }}
                  />
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

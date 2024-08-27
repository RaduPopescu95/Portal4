"use client";

import Link from "next/link";
import Slider from "react-slick";
import properties from "../../data/properties";
import Image from "next/image";
import {
  calculateDistance,
  generateRandomGradient,
  toUrlSlug,
} from "@/utils/commonUtils";
import { useEffect, useState } from "react";
import { fetchLocation } from "@/app/services/geocoding";
import { handleDiacrtice } from "@/utils/strintText";
import {
  handleQueryDoubleParam,
  handleQueryFirestore,
  handleQueryTripleParam,
} from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import PropertyItem from "./PropertyItem";

const FeaturedProperties = () => {
  const [parteneri, setParteneri] = useState([]);
  const { currentUser } = useAuth();
  const settings = {
    dots: true,
    arrows: false,
    slidesToShow: Math.min(4, parteneri.length), // Afișează până la 4 slide-uri sau mai puțin dacă sunt mai puțini parteneri
    slidesToScroll: 3,
    autoplay: false,
    speed: 1200,
    variableWidth: parteneri.length < 4 ? true : false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, parteneri.length),
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, parteneri.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: Math.min(1, parteneri.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const { latitude, longitude } = position.coords;

        try {
          let localitate;
          let res = await fetchLocation(latitude, longitude);
          if (res && res.results && res.results.length > 0) {
            // Caută primul element cu proprietatea 'locality' definită
            const firstLocality = res.results.find(
              (result) => result.locality !== undefined
            );

            if (firstLocality && firstLocality.locality) {
              localitate = handleDiacrtice(firstLocality.locality);
            } else {
              console.error("Localitate missing in all results:", res);
            }
          } else {
            console.error("Invalid response or results missing:", res);
          }
          console.log("localitate a utilizatorului...", localitate);
          let parteneri = await handleQueryTripleParam(
            "UsersUber",
            "localitate",
            localitate,
            "userType",
            "Partener",
            "statusCont",
            "Activ"
          );

          // Adaugă distanța ca o proprietate pentru fiecare partener
          const parteneriCuDistanta = parteneri.map((partener) => {
            const distanta = calculateDistance(
              latitude,
              longitude,
              partener.coordonate.lat,
              partener.coordonate.lng
            );

            return { ...partener, distanta: Math.floor(distanta) };
          });

          // Sortează partenerii după distanță
          const parteneriOrdonati = parteneriCuDistanta.sort(
            (a, b) => a.distanta - b.distanta
          );

          console.log("parteneri cu distanta...", parteneriOrdonati);

          setParteneri([...parteneriOrdonati]);
        } catch (error) {
          console.error("Error fetching location data: ", error);
        }
      },
      function (error) {
        console.error("Geolocation error: ", error);
      }
    );
  }, []);

  return (
    <>
      <Slider {...settings} arrows={false}>
        {parteneri.map((item) =>
          currentUser ? (
            <Link
              href={`/partener/${item?.id}-${toUrlSlug(item?.denumireBrand)}`}
              key={item?.id}
              passHref
            >
              <PropertyItem item={item} isActive={true} />
            </Link>
          ) : (
            <a
              key={item?.id}
              data-bs-toggle="modal"
              data-bs-target=".bd-utilizator-modal-lg"
            >
              <PropertyItem item={item} isActive={false} />
            </a>
          )
        )}
      </Slider>
    </>
  );
};

export default FeaturedProperties;

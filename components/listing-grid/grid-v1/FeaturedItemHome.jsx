"use client";

import Link from "next/link";
import Pagination from "../../common/blog/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLength } from "../../../features/properties/propertiesSlice";
import properties from "../../../data/properties";
import Image from "next/image";
import {
  calculateDistance,
  filtrareParteneri,
  generateRandomGradient,
  getAllAnunturiCadre,
  getAllAnunturiClinici,
  getAllOffers,
  toUrlSlug,
} from "@/utils/commonUtils";
import { fetchLocation } from "@/app/services/geocoding";
import { handleDiacrtice } from "@/utils/strintText";
import {
  handleQueryDoubleParam,
  handleQueryFirestore,
  handleQueryFirestoreSubcollection,
  handleQueryFirestoreSubcollectionTripleParam,
  handleQueryPatruParam,
  handleQueryTripleParam,
} from "@/utils/firestoreUtils";
import FeaturedProperty from "./Item";
import { useAuth } from "@/context/AuthContext";
import SkeletonLoader from "@/components/common/SkeletonLoader";

const FeaturedItemHome = ({ params }) => {
  const {
    keyword,
    location,
    status,
    propertyType,
    price,
    bathrooms,
    bedrooms,
    garages,
    yearBuilt,
    area,
    amenities,
  } = useSelector((state) => state.properties);
  const { statusType, featured, isGridOrList } = useSelector(
    (state) => state.filter
  );
  const {
    currentUser,
    setSearchQueryPateneri,
    searchQueryParteneri,
    userData,
  } = useAuth();

  const [parteneri, setParteneri] = useState([]);
  const [cadreMedicale, setCadreMedical] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoLocation, setIsNoLocation] = useState(false);
  const itemsPerPage = 10;

  const dispatch = useDispatch();

  async function fetchLocationAndUpdatePartners(latitude, longitude) {
    console.log("start...search...location...");
    try {
      let res = await fetchLocation(latitude, longitude);
      console.log("res...here...", res);

      if (res && res.results && res.results.length > 0) {
        // Caută primul element cu proprietatea 'locality' definită
        const firstLocality = res.results.find(
          (result) => result.locality !== undefined
        );

        if (firstLocality && firstLocality.locality) {
          const localitate = handleDiacrtice(firstLocality.locality);
          updatePartnersByLocation(localitate, latitude, longitude);
        } else {
          console.error("Localitate missing in all results:", res);
        }
      } else {
        console.error("Invalid response or results missing:", res);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching location data: ", error);
    }
  }

  async function updatePartnersByLocation(localitate, latitude, longitude) {
    console.log("here...is...stat....", localitate);

    const cadreMedicale = await handleQueryFirestore(
      "UsersUber",
      "userType",
      "Doctor"
    );

    let parteneriCuDistanta = await Promise.all(
      cadreMedicale.map(async (cadru) => {
        const distanta = calculateDistance(
          latitude,
          longitude,
          cadru.coordonate.lat,
          cadru.coordonate.lng
        );
        return {
          ...cadru,
          distanta: Math.floor(distanta),
        };
      })
    );

    let parteneriOrdonati = parteneriCuDistanta.sort(
      (a, b) => a.distanta - b.distanta
    );

    if (parteneriOrdonati.length === 0) {
      console.log("is no length....");
      const cadreMedicale = await handleQueryFirestore(
        "UsersUber",
        "userType",
        "Doctor"
      );
      parteneriOrdonati = await Promise.all(
        cadreMedicale.map(async (cadru) => {
          const distanta = calculateDistance(
            latitude,
            longitude,
            cadru.coordonate.lat,
            cadru.coordonate.lng
          );
          return {
            ...cadru,
            distanta: Math.floor(distanta),
          };
        })
      );
    }

    setCadreMedical(parteneriOrdonati);
    setIsLoading(false);
  }

  function handleGeoSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetchLocationAndUpdatePartners(latitude, longitude);
  }

  async function handleGeoError(error) {
    // alert("Geolocation error: ", error.message);
    console.error("Geolocation error: ", error.message);
    setIsLoading(false);
    // setIsNoLocation(true);
    // Informează utilizatorul despre cum poate activa locația manual
    if (error.code === error.PERMISSION_DENIED) {
      setIsNoLocation(true);
      const cadreMedicale = await handleQueryFirestore(
        "UsersUber",
        "userType",
        "Doctor"
      );
      setCadreMedical(cadreMedicale);
    }
  }

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeoSuccess,
        handleGeoError,
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeoSuccess,
        handleGeoError
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  const paginatedCadreMedicale = () => {
    console.log("paginating...", parteneri);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cadreMedicale.slice(startIndex, endIndex);
  };

  // status handler

  let contentCadreMedicale = paginatedCadreMedicale()
    .slice(0, 10)
    .map((item) => (
      <div
        className={`${
          isGridOrList ? "col-12 feature-list" : "col-md-4 col-lg-4"
        } `}
        key={item?.id}
      >
        {currentUser ? (
          <Link
            href={{
              pathname: `/cadru-medical/${toUrlSlug(
                item?.localitate
              )}-${toUrlSlug(item?.titulatura)}`,
              query: { slug: item?.id },
            }}
            key={item?.id}
            passHref
          >
            <FeaturedProperty item={item} isGridOrList={isGridOrList} />
          </Link>
        ) : (
          <a
            key={item?.id}
            data-bs-toggle="modal"
            data-bs-target=".bd-utilizator-modal-lg"
          >
            <FeaturedProperty item={item} isGridOrList={isGridOrList} />
          </a>
        )}
      </div>
    ));

  // add length of filter items
  // useEffect(() => {
  //   dispatch(addLength(contentCadreMedicale.length));
  // }, [dispatch, contentCadreMedicale]);

  return (
    <>
      {isLoading ? <SkeletonLoader /> : contentCadreMedicale}
      {isNoLocation && (
        <div className="d-flex justify-content-center align-items-center">
          <p>
            Accesul la locație a fost blocat. Te rog activează accesul la
            locație din setările browserului sau dispozitivului tău.
          </p>
        </div>
      )}

      {paginatedCadreMedicale().length === 0 && !isLoading && (
        <div className="d-flex justify-content-center align-items-center">
          <p>
            În acest moment nu există anunțuri de angajare de la cadre medicale
            în apropierea dumneavoastră. Vă recomandăm să cautați prin
            utilizarea filtrului de mai sus.
          </p>
        </div>
      )}
    </>
  );
};

export default FeaturedItemHome;

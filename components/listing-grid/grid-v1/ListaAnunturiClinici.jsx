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

const ListaAnunturiClinici = ({ params }) => {
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
          setTimeout(() => {
            updatePartnersByLocation(localitate, latitude, longitude);
          }, 1500);
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
    let anunturi = await handleQueryFirestoreSubcollectionTripleParam(
      "Anunturi",
      "localitate",
      localitate,
      "tipAnunt",
      "Clinica",
      "status",
      "Activa"
    );

    let parteneriCuDistanta = await Promise.all(
      anunturi.map(async (partener) => {
        const clinica = await handleQueryFirestore(
          "UsersUber",
          "user_uid",
          partener.collectionId
        );
        const distanta = calculateDistance(
          latitude,
          longitude,
          partener.coordonate.lat,
          partener.coordonate.lng
        );
        console.log("anunturi....", clinica[0]);
        return {
          ...partener,
          distanta: Math.floor(distanta),
          clinica: clinica[0],
        };
      })
    );

    let parteneriOrdonati = parteneriCuDistanta.sort(
      (a, b) => a.distanta - b.distanta
    );

    if (parteneriOrdonati.length === 0) {
      console.log("is no length....");
      let anunturi = await handleQueryFirestoreSubcollection(
        "Anunturi",
        "tipAnunt",
        "Clinica",
        "status",
        "Activa"
      );
      parteneriOrdonati = await Promise.all(
        anunturi.map(async (partener) => {
          const clinica = await handleQueryFirestore(
            "UsersUber",
            "user_uid",
            partener.collectionId
          );
          const distanta = calculateDistance(
            latitude,
            longitude,
            partener.coordonate.lat,
            partener.coordonate.lng
          );
          return {
            ...partener,
            distanta: Math.floor(distanta),
            clinica: clinica[0],
          };
        })
      );
    }

    console.log("anunturi....", parteneriCuDistanta);
    setParteneri(parteneriOrdonati);
    setIsLoading(false);
  }

  function handleGeoSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetchLocationAndUpdatePartners(latitude, longitude);
  }

  function handleGeoError(error) {
    // alert("Geolocation error: ", error.message);
    console.error("Geolocation error: ", error.message);
    setIsLoading(false);
    // setIsNoLocation(true);
    // Informează utilizatorul despre cum poate activa locația manual
    if (error.code === error.PERMISSION_DENIED) {
      setIsNoLocation(true);
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

  const paginatedParteneri = () => {
    console.log("paginating...", parteneri);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return parteneri.slice(startIndex, endIndex);
  };

  // status handler
  let content = paginatedParteneri()
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
              pathname: `/partener/${toUrlSlug(item?.titluOferta)}_${
                item?.clinica?.id
              }`,
              query: { slug: item?.clinica?.id },
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
  //   dispatch(addLength(content.length));
  // }, [dispatch, content]);

  return (
    <>
      {isLoading ? <SkeletonLoader /> : content}

      {/* {isNoLocation && (
        <div className="d-flex justify-content-center align-items-center">
          <p>
            Accesul la locație a fost blocat. Te rog activează accesul la
            locație din setările browserului sau dispozitivului tău.
          </p>
        </div>
      )} */}
      {paginatedParteneri().length === 0 && !isLoading && (
        <div className="d-flex justify-content-center align-items-center">
          <p>
            În acest moment nu există anunțuri de angajare de la clinici în
            apropierea dumneavoastră. Vă recomandăm să cautați prin utilizarea
            filtrului de mai sus.
          </p>
        </div>
      )}
    </>
  );
};

export default ListaAnunturiClinici;

"use client";

import Link from "next/link";
import Pagination from "../../common/blog/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLength,
  lengthLoad,
} from "../../../features/properties/propertiesSlice";
import properties from "../../../data/properties";
import Image from "next/image";
import {
  calculateDistance,
  calculeazaSiOrdoneazaParteneriDupaDistanta,
  filtrareCadreMedicale,
  filtrareClinici,
  filtrareGenerala,
  filtrareOferte,
  filtrareParteneri,
  generateRandomGradient,
  getAllOffersWithoutDistance,
  handleGetAnunturiArray,
  processParams,
  toUrlSlug,
} from "@/utils/commonUtils";
import { fetchLocation } from "@/app/services/geocoding";
import { handleDiacrtice } from "@/utils/strintText";
import {
  handleQueryDoubleParam,
  handleQueryFirestore,
  handleQueryFirestoreSubcollection,
  handleQueryFirestoreSubcollectionCinciParam,
  handleQueryFirestoreSubcollectionPatruParam,
  handleQueryFirestoreSubcollectionSaseParam,
  handleQueryFirestoreSubcollectionTripleParam,
  handleQueryFirestoreSubcollectionVariableParams,
  handleQueryPatruParam,
  handleQueryTripleParam,
} from "@/utils/firestoreUtils";
import FeaturedProperty from "./Item";
import { useAuth } from "@/context/AuthContext";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useSearchParams } from "next/navigation";

const FeaturedItem = ({ params, searchQuery }) => {
  const { statusType, featured, isGridOrList } = useSelector(
    (state) => state.filter
  );
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();

  const [parteneri, setParteneri] = useState([]);
  const [anunturiCadre, setAnunturiCadre] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  const dispatch = useDispatch();

  const handleGetAnunturi = async () => {
    let tipProgram = searchParams.get("tipProgram");
    let tipAnunt = searchParams.get("tipAnunt");
    let searchQueryParteneri = searchParams.get("searchQueryParteneri");
    let localitate = searchParams.get("localitate");
    let specialitate = searchParams.get("specialitate");
    let judet = searchParams.get("judet");
    let titulatura = searchParams.get("titulatura");

    console.log("test...aici...", tipProgram);
    console.log("test...aici...", tipAnunt);
    console.log("test...aici...", searchQueryParteneri);
    console.log("test...aici...", localitate);
    console.log("test...aici...", specialitate);
    console.log("test...aici...", judet);
    console.log("test...aici...", titulatura);
    // console.log("test...aici...", params);
    // const parts = params[0].split("__");
    // let judet = parts[1] || "";
    // let titulatura = parts[0] || "";
    setIsLoading(true);
    try {
      const processedParams = {
        titulatura: titulatura || "",
        specialitate: specialitate || "",
        judet: judet || "",
        localitate: localitate || "",
        tipAnunt: tipAnunt,
        tipProgram: tipProgram || "",
        searchQueryParteneri: searchQueryParteneri || "",
      };

      console.log("Processed Params:", processedParams);
      let announcements = [];

      // Logic to decide what kind of announcements to fetch based on `tipAnunt`
      const tAnunt =
        tipAnunt === "Anunturi Cadre Medicale"
          ? "CadruMedical"
          : tipAnunt === "Anunturi Clinici" || tipAnunt === "Clinica"
          ? "Clinica"
          : "";

      announcements = await handleGetAnunturiArray(
        processedParams.titulatura,
        processedParams.specialitate,
        processedParams.judet,
        processedParams.localitate,
        tAnunt,
        processedParams.tipProgram
      );

      console.log("anunturi....1", announcements);

      console.log("anunturi....2", announcements);
      // const announcementsWithDetails = await Promise.all(
      //   announcements.map(async (announcement) => {
      //     const userDetails = await handleQueryFirestore(
      //       "UsersUber",
      //       "user_uid",
      //       announcement.collectionId
      //     );

      //     if (tipAnunt === "Clinica" || tipAnunt === "Anunturi Clinici") {
      //       return {
      //         ...announcement,
      //         // distanta: Math.floor(distanta),
      //         clinica: userDetails[0],
      //       };
      //     } else if (
      //       tipAnunt === "CadruMedical" ||
      //       tipAnunt === "Anunturi Cadre Medicale"
      //     ) {
      //       return {
      //         ...announcement,
      //         // distanta: Math.floor(distanta),
      //         cadruMedical: userDetails[0],
      //       };
      //     } else {
      //       if (announcement.tipAnunt === "CadruMedical") {
      //         return {
      //           ...announcement,
      //           // distanta: Math.floor(distanta),
      //           cadruMedical: userDetails[0],
      //         };
      //       } else {
      //         return {
      //           ...announcement,
      //           // distanta: Math.floor(distanta),
      //           clinica: userDetails[0],
      //         };
      //       }
      //     }
      //   })
      // );

      const processFinalResults = (latitude, longitude) => {
        console.log("Start......process...");
        if (searchQueryParteneri) {
          const filteredResults = filtrareCadreMedicale(
            announcements,
            searchQueryParteneri
          );

          let final;
          if (latitude === null) {
            final = filteredResults;
          } else {
            final = calculeazaSiOrdoneazaParteneriDupaDistanta(
              filteredResults,
              latitude,
              longitude
            );
          }
          console.log("anunturi....3", announcements);

          setParteneri(final);
        } else {
          let final;
          if (latitude === null) {
            final = announcements;
          } else {
            final = calculeazaSiOrdoneazaParteneriDupaDistanta(
              announcements,
              latitude,
              longitude
            );
          }
          console.log("anunturi....4", announcements);
          setParteneri(final);
        }

        setIsLoading(false);
      };

      // Obține coordonatele curente
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User's coordinates:", latitude, longitude);
          processFinalResults(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // Dacă nu reușește să obțină coordonatele, folosește coordonatele default
          processFinalResults(null, null);
        }
      );
    } catch (error) {
      console.error("Error fetching announcements: ", error);
      setIsLoading(false);
    }
  };
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams);

  //   setTitulatura(params.get('titulatura') || '');
  //   setSpecialitate(params.get('specialitate') || '');
  //   setJudet(params.get('judet') || '');
  //   setLocalitate(params.get('localitate') || '');
  //   setTipAnunt(params.get('tipAnunt') || '');
  //   setTipProgram(params.get('tipProgram') || '');
  //   setSearchQueryParteneri(params.get('searchQueryParteneri') || '');

  //   handleGetAnunturi(params);
  // }, [searchParams]);
  useEffect(() => {
    console.log("test............");
    handleGetAnunturi();
  }, [searchParams]);

  // Funcție pentru schimbarea paginilor
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const paginatedParteneri = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return parteneri.slice(startIndex, endIndex);
  };

  // status handler

  let content = paginatedParteneri().map((item) => {
    const pathname = `/cadru-medical/${toUrlSlug(item?.localitate)}-${toUrlSlug(
      item?.titulatura
    )}`;

    return (
      <div
        className={`${
          isGridOrList ? "col-12 feature-list" : "col-md-6 col-lg-6"
        } `}
        key={item?.id}
      >
        {currentUser ? (
          <Link
            href={{
              pathname: pathname,
              query: {
                slug: item.cadruMedical?.id,
              },
            }}
            passHref
          >
            <FeaturedProperty item={item} isGridOrList={isGridOrList} />
          </Link>
        ) : (
          <a data-bs-toggle="modal" data-bs-target=".bd-utilizator-modal-lg">
            <FeaturedProperty item={item} isGridOrList={isGridOrList} />
          </a>
        )}
      </div>
    );
  });

  // add length of filter items
  useEffect(() => {
    dispatch(addLength(content.length));
    dispatch(lengthLoad(isLoading));
  }, [dispatch, content]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      {content}

      <div className="row">
        <div className="col-lg-12 mt20">
          <div className="mbp_pagination">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={parteneri.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
        {/* End paginaion .col */}
      </div>
      {/* End .row */}
    </>
  );
};

export default FeaturedItem;

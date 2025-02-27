"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Pagination from "../../common/blog/Pagination";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// Import firebase/firestore și instanța db
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // asigură-te că ai configurat firebase corespunzător
import FeaturedProperty from "./Item";
import { addLength, lengthLoad } from "@/features/properties/propertiesSlice";

// Helper: convertește un text într-un URL slug
function toUrlSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")           // înlocuiește spațiile cu -
    .replace(/[^\w\-]+/g, "")       // elimină caracterele speciale
    .replace(/\-\-+/g, "-")         // înlocuiește dublurile de -
    .replace(/^-+/, "")             // elimină - de la început
    .replace(/-+$/, "");            // elimină - de la sfârșit
}

// Helper: calculează distanța dintre două coordonate (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Raza Pământului în km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: calculează și sortează partenerii după distanță
function calculeazaSiOrdoneazaParteneriDupaDistanta(parteneri, latitude, longitude) {
  const parteneriCuDistanta = parteneri.map((partener) => {
    const distanta = calculateDistance(
      latitude,
      longitude,
      partener.coordonate.lat,
      partener.coordonate.lng
    );
    return { ...partener, distanta: Math.floor(distanta) };
  });
  return parteneriCuDistanta.sort((a, b) => a.distanta - b.distanta);
}

// Helper: filtrează rezultatele pe baza unui search query (se unesc array-urile dacă este cazul)
function filtrareCadreMedicale(parteneriFiltrati, searchQueryParteneri) {
  try {
    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const searchTerms = searchQueryParteneri.split(/\s+/).map(normalizeText);

    const matchesSearch = (fieldValue) => {
      const text = Array.isArray(fieldValue) ? fieldValue.join(" ") : fieldValue;
      const normalizedText = normalizeText(text);
      return searchTerms.every((term) => normalizedText.includes(term));
    };

    return parteneriFiltrati.filter((partener) =>
      matchesSearch(partener?.numeUtilizator || "") ||
      matchesSearch(partener?.titulatura || "") ||
      matchesSearch(partener?.adresaSediu || "") ||
      matchesSearch(partener?.telefonContact || "") ||
      matchesSearch(partener?.email || "") ||
      matchesSearch(partener?.descriereOferta || "") ||
      matchesSearch(partener?.specialitate || "")
    );
  } catch (error) {
    console.error("Error in filtrareCadreMedicale: ", error);
    return [];
  }
}

// Helper: obține anunțurile de la Firestore folosind noile filtre și operatorul array-contains
async function handleGetAnunturiArray(t, s, j, l, tA, tP) {
  let cadreMeds = [];
  const titulatura = t ?? "";
  const specialitate = s ?? "";
  const judet = j ?? "";
  let localitate = l ?? "";
  const tipAnunt = tA ?? "";
  const tipProgram = tP ?? "";
  let localitateQuery = "localitate";

  if (judet === "Bucuresti") {
    localitateQuery = "sector";
  }

  // Construiește query-ul Firestore pe baza parametrilor
  const usersRef = collection(db, "UsersUber");
  let q;
  
  if (titulatura && judet) {
    q = query(
      usersRef,
      where("judet", "==", judet),
      where("titulaturaQ", "array-contains", titulatura),
      where("userType", "==", "Doctor")
    );
  } else if (titulatura && !judet) {
    q = query(
      usersRef,
      where("titulaturaQ", "array-contains", titulatura),
      where("userType", "==", "Doctor")
    );
  } else if (!titulatura && judet) {
    q = query(
      usersRef,
      where("judet", "==", judet),
      where("userType", "==", "Doctor")
    );
  } else {
    q = query(usersRef, where("userType", "==", "Doctor"));
  }

  const querySnapshot = await getDocs(q);
  cadreMeds = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Filtrare suplimentară pe client pentru tipProgram, tipAnunt, localitate și specialitate
  cadreMeds = cadreMeds.filter((anunt) => {
    const matchesTipProgram = tipProgram && tipProgram !== "" ? anunt.tipProgram === tipProgram : true;
    const matchesTipAnunt = tipAnunt && tipAnunt !== "" ? anunt.tipAnunt === tipAnunt : true;
    const matchesLocalitate =
      localitate && localitate !== ""
        ? anunt[localitateQuery] && anunt[localitateQuery] === localitate
        : true;
    const matchesSpecialitate =
      specialitate && specialitate !== ""
        ? Array.isArray(anunt.specialitate)
          ? anunt.specialitate.includes(specialitate)
          : anunt.specialitate === specialitate
        : true;
    return matchesTipProgram && matchesTipAnunt && matchesLocalitate && matchesSpecialitate;
  });
  return cadreMeds;
}

const FeaturedItem = ({ params, searchQuery }) => {
  const { statusType, featured, isGridOrList } = useSelector((state) => state.filter);
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();

  const [parteneri, setParteneri] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 6;

  const dispatch = useDispatch();

  const handleGetAnunturi = async () => {
    const tipProgram = searchParams.get("tipProgram") || "";
    const tipAnunt = searchParams.get("tipAnunt") || "";
    const searchQueryParteneri = searchParams.get("searchQueryParteneri") || "";
    const localitate = searchParams.get("localitate") || "";
    const specialitate = searchParams.get("specialitate") || "";
    const judet = searchParams.get("judet") || "";
    const titulatura = searchParams.get("titulatura") || "";

    setIsLoading(true);
    try {
      const processedParams = {
        titulatura,
        specialitate,
        judet,
        localitate,
        tipAnunt,
        tipProgram,
        searchQueryParteneri,
      };

      // Determinăm tipul de anunț
      const tAnunt =
        tipAnunt === "Anunturi Cadre Medicale"
          ? "CadruMedical"
          : tipAnunt === "Anunturi Clinici" || tipAnunt === "Clinica"
          ? "Clinica"
          : "";

      const announcements = await handleGetAnunturiArray(
        processedParams.titulatura,
        processedParams.specialitate,
        processedParams.judet,
        processedParams.localitate,
        tAnunt,
        processedParams.tipProgram
      );

      // Funcția de procesare a rezultatelor, adăugând și ordonând după distanță
      const processFinalResults = (latitude, longitude) => {
        if (searchQueryParteneri) {
          const filteredResults = filtrareCadreMedicale(announcements, searchQueryParteneri);
          const finalResults = latitude === null
            ? filteredResults
            : calculeazaSiOrdoneazaParteneriDupaDistanta(filteredResults, latitude, longitude);
          setParteneri(finalResults);
        } else {
          const finalResults = latitude === null
            ? announcements
            : calculeazaSiOrdoneazaParteneriDupaDistanta(announcements, latitude, longitude);
          setParteneri(finalResults);
        }
        setIsLoading(false);
      };

      // Obține coordonatele curente ale utilizatorului
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          processFinalResults(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          processFinalResults(null, null);
        }
      );
    } catch (error) {
      console.error("Error fetching announcements: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAnunturi();
  }, [searchParams]);

  // Funcția de paginare
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const paginatedParteneri = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return parteneri.slice(startIndex, startIndex + itemsPerPage);
  };

  const content = paginatedParteneri().map((item) => {
    const pathname = `/cadru-medical/${toUrlSlug(item?.localitate)}-${toUrlSlug(item?.titulatura)}`;
    return (
      <div
        className={`${isGridOrList ? "col-12 feature-list" : "col-md-6 col-lg-6"}`}
        key={item?.id}
      >
        <Link
          href={{ pathname, query: { slug: item.id } }}
          passHref
        >
          <FeaturedProperty item={item} isGridOrList={isGridOrList} />
        </Link>
      </div>
    );
  });

  useEffect(() => {
    dispatch(addLength(content.length));
    dispatch(lengthLoad(isLoading));
  }, [dispatch, content, isLoading]);

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
      </div>
    </>
  );
};

export default FeaturedItem;

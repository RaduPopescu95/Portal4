"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authentication, db } from "../firebase";
import {
  handleGetUserInfo,
  handleGetUserInfoJobs,
  handleGetUserInfoUber,
} from "../utils/handleFirebaseQuery";
import { handleGetFirestore } from "@/utils/firestoreUtils";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [judete, setJudete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuestUser, setIsGuestUser] = useState(false); // Inițializat ca false
  const [searchQueryParteneri, setSearchQueryPateneri] = useState("");
  const [tipAnunt, setTipAnunt] = useState("Clinica");
  const [tipProgram, setTipProgram] = useState(undefined);

  const [titulatura, setSelectedCategory] = useState(undefined);
  const [specialitate, setSelectedSpecialty] = useState(undefined);
  const [localitate, setSelectedLocalitate] = useState(undefined);
  const [judet, setSelectedJudet] = useState(undefined);

  // Funcția pentru a seta utilizatorul ca guest user
  const setAsGuestUser = (isGuest) => {
    try {
      localStorage.setItem("isGuestUser", isGuest ? "true" : "false");
      setIsGuestUser(isGuest);
    } catch (e) {
      console.error("Failed to update isGuestUser in localStorage:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      console.log("start use effect from auth context", user);
      if (user) {
        try {
          // Încearcă să obții datele utilizatorului din handleGetUserInfoJobs
          let userDataFromFirestore = await handleGetUserInfoUber();
          console.log(
            "User data fetched at onAuthStateChanged from handleGetUserInfoJobs...",
            userDataFromFirestore
          );

          // Dacă datele sunt undefined sau nu sunt primite date, încearcă handleGetUsersInfo
          if (!userDataFromFirestore) {
            console.log(
              "No data found in handleGetUserInfoJobs, trying handleGetUsersInfo..."
            );
            //Rescrie in userJobs informatiile contactului
            userDataFromFirestore = await handleGetUserInfo();

            if (userDataFromFirestore) {
              const collectionId = "UsersUber";
              const documentId = user.uid;
              userDataFromFirestore.user_uid = user.uid;
              setDoc(
                doc(db, collectionId, documentId),
                userDataFromFirestore
              ).then(() => {
                console.log("Înregistrare in portal nou cu succes!");
                console.log(
                  "User data fetched at onAuthStateChanged from handleGetUsersInfo...",
                  userDataFromFirestore
                );
              });
            } else {
              console.log(
                "No data found in both handleGetUserInfoJobs and handleGetUsersInfo."
              );
            }
          }

          setUserData(userDataFromFirestore);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      setCurrentUser(user);

      try {
        const judeteRomania = await handleGetFirestore("Judete");
        console.log("judete....", judeteRomania);
        setJudete(judeteRomania);
      } catch (error) {
        console.error("Failed to fetch judete data in context auth:", error);
      }

      try {
        const guestUserValue = localStorage.getItem("isGuestUser");
        // Setează isGuestUser ca true sau false bazat pe valoarea din localStorage
        // Dacă valoarea nu există, va rămâne setat ca false
        setIsGuestUser(guestUserValue === "true");
      } catch (e) {
        console.error("Failed to fetch isGuestUser from localStorage:", e);
        setIsGuestUser(false); // Setat ca false în cazul unei erori
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isGuestUser, // Includeți isGuestUser în context
    setAsGuestUser, // Expuși funcția prin context
    setUserData,
    setCurrentUser,
    judete,
    searchQueryParteneri,
    setSearchQueryPateneri,
    tipAnunt,
    setTipAnunt,
    tipProgram,
    setTipProgram,
    judet,
    setSelectedJudet,
    localitate,
    setSelectedLocalitate,
    specialitate,
    setSelectedSpecialty,
    titulatura,
    setSelectedCategory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation"; // Pentru App Router
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

// Importăm dinamic componenta AgoraUIKit cu SSR dezactivat
const AgoraUIKitNoSSR = dynamic(
  () => import("agora-react-uikit").then((mod) => mod.default),
  { ssr: false }
);

const VideoCall = () => {
  // Stările componentei
  const [videocall, setVideocall] = useState(true);
  const [isHost] = useState(true);
  const [isPinned, setPinned] = useState(true);
  const [isFullscreen, setFullscreen] = useState(false);
  const [username, setUsername] = useState("");
  const appID = "e17715cba7c84bfc9dbd1b5231b6f86f";
  const [documentId, setDocumentId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idConnect = searchParams.get("idConnect"); // Se așteaptă formatul "ceva__documentId"
  const videoContainerRef = useRef(null);

  // Importăm dinamic layout-ul din AgoraUIKit
  const [agoraLayout, setAgoraLayout] = useState(null);
  useEffect(() => {
    import("agora-react-uikit").then((mod) => {
      setAgoraLayout(mod.layout);
    });
  }, []);

  // Extragem documentId din parametrul idConnect
  useEffect(() => {
    if (idConnect) {
      const parts = idConnect.split("__");
      if (parts.length > 1) {
        setDocumentId(parts[1]);
      }
    }
  }, [idConnect]);

  // Pornim sesiunea și cronometrul imediat ce avem un documentId valid
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const userRole = "client"; // rolul clientului

  useEffect(() => {
    if (documentId) {
      const docRef = doc(db, "RezervariConsultatii", documentId);
      // Marcăm prezența clientului și pornim sesiunea imediat
      updateDoc(docRef, { [`presence.${userRole}`]: true });
      setElapsedTime(0);
      setVideocall(true); // Asigurăm că sesiunea este activă
      // Pornim intervalul de cronometrare
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setElapsedTime((prev) => prev + 1);
        }, 1000);
      }
    }
    return () => {
      if (documentId) {
        const docRef = doc(db, "RezervariConsultatii", documentId);
        updateDoc(docRef, { [`presence.${userRole}`]: false });
      }
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [documentId, userRole]);

  // Funcția pentru fullscreen
  const handleFullscreen = () => {
    const elem = videoContainerRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
    setFullscreen(!isFullscreen);
  };

  // Funcția de încheiere a apelului
  const handleEndCall = async () => {
    if (documentId) {
    //   const docRef = doc(db, "RezervariConsultatii", documentId);
      setVideocall(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    //   await updateDoc(docRef, { [`presence.${userRole}`]: false });
      router.push("/"); // modifică cu pagina dorită
    }
  };

  // Dacă layout-ul Agora sau documentId nu sunt încărcate, afișăm un fallback
  if (!agoraLayout || !documentId) {
    return <div>Loading video call...</div>;
  }

  // Calculăm afișarea timpului
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
  const seconds = (elapsedTime % 60).toString().padStart(2, "0");

  return (
    <div className="main-wrapper">
      <div style={styles.container}>
        <div style={styles.videoContainer} ref={videoContainerRef}>
          {videocall ? (
            <>
              <button
                style={styles.roundButton}
                onClick={() => setPinned(!isPinned)}
              >
                {isPinned ? (
                  <i className="fas fa-th-large" />
                ) : (
                  <i className="fas fa-thumbtack" />
                )}
              </button>
              <button
                style={styles.fullscreenButton}
                onClick={handleFullscreen}
              >
                <i
                  className={`fas ${isFullscreen ? "fa-compress" : "fa-expand"}`}
                />
              </button>
              <AgoraUIKitNoSSR
                rtcProps={{
                  appId: appID,
                  channel: documentId,
                  token: null,
                  role: isHost ? "host" : "audience",
                  layout: isPinned ? agoraLayout.pin : agoraLayout.grid,
                  enableScreensharing: true,
                  videoMode: {
                    max: "cover",
                    min: "contain",
                  },
                }}
                rtmProps={{ username, displayUsername: true }}
                callbacks={{
                  EndCall: handleEndCall,
                }}
                styleProps={{
                  localBtnContainer: {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "2px solid #ffffff",
                    padding: "10px",
                    margin: "10px",
                  },
                  BtnTemplateStyles: {
                    backgroundColor: "transparent",
                    color: "#777777",
                    borderRadius: "50%",
                    border: "2px solid #f0f0f0",
                    margin: "0 10px",
                    fontSize: "28px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease-in-out",
                    height: "60px",
                    width: "60px",
                  },
                  UIKitContainer: {
                    backgroundColor: "transparent",
                    color: "#f0f0f0",
                    border: "2px solid #f0f0f0",
                    padding: "12px",
                    margin: "0 10px",
                    fontSize: "28px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease-in-out",
                  },
                  gridVideoCells: {
                    padding: "12px",
                    margin: "0 10px",
                    fontSize: "28px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease-in-out",
                  },
                  iconSize: 35,
                  theme: "#777777",
                }}
              />
            </>
          ) : (
            <div style={styles.nav}>
              {/* <input
                style={styles.input}
                placeholder="Nume"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              /> */}
              <h3 style={styles.btn} onClick={() => setVideocall(true)}>
                Intră în apel
              </h3>
            </div>
          )}
          <div style={styles.timer}>
            {minutes}:{seconds}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  timer: {
    position: "absolute",
    bottom: "12%",
    left: "5%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "24px",
    zIndex: 1000,
  },
  timerMobile: {
    position: "absolute",
    bottom: "10%",
    left: "20%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "24px",
    zIndex: 1000,
  },
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  roundButton: {
    position: "absolute",
    bottom: "4%",
    left: "5%",
    backgroundColor: "#007bff",
    color: "#ffffff",
    borderRadius: "50%",
    border: "none",
    width: "70px",
    height: "70px",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  fullscreenButton: {
    position: "absolute",
    bottom: "4%",
    right: "5%",
    backgroundColor: "#28a745",
    color: "#ffffff",
    borderRadius: "50%",
    border: "none",
    width: "70px",
    height: "70px",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    flexDirection: "column",
  },
  btn: {
    backgroundColor: "#007bff",
    cursor: "pointer",
    borderRadius: 5,
    padding: "10px 20px",
    color: "#ffffff",
    fontSize: 18,
  },
  input: { display: "flex", height: 24, alignSelf: "center" },

  // Media queries pentru a face butoanele responsive pe mobil
  "@media (max-width: 768px)": {
    roundButton: {
      width: "60px",
      height: "60px",
      fontSize: "20px",
      bottom: "3%",
      left: "4%",
    },
    fullscreenButton: {
      display: "none", // Ascundem butonul fullscreen pe mobil
    },
  },
};

export default VideoCall;

"use client";
import { useAuth } from "@/context/AuthContext";
import { PLATFORM_NAME } from "@/utils/constants";

const CallToAction = () => {
  const { userData, currentUser } = useAuth();
  return (
    <div className="row">
      <div className={currentUser && userData?.userType ? "col-lg-12" : "col-lg-8"}>
        <div className="start_partner tac-smd">
          <h2>
            {PLATFORM_NAME} – Locul unde specialiștii și clienții se conectează.
          </h2>
          <p>
            Înregistrează-te acum și începe să îți promovezi serviciile și să primești
            programări online pe {PLATFORM_NAME}!
          </p>
        </div>
      </div>
      {
        currentUser && userData?.userType ? null :
        <div className="col-lg-4">
        <div className="parner_reg_btn text-right tac-smd">
          <a
            href="#"
            className="btn btn-thm2"
            data-bs-toggle="modal"
            data-bs-target=".bd-utilizator-modal-lg"
          >
            Înregistrează-te
          </a>
        </div>
      </div>
      }
    
    </div>
  );
};

export default CallToAction;

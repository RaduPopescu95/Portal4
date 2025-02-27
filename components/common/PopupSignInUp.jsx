import LoginSignupUtilizator from "./user-credentials/LoginSignupUtilizator";
import LoginSignupPartener from "./user-credentials/LoginSignupPartener";

const PopupSignInUp = () => {
  return (
    <>
      <div
        className="sign_up_modal modal fade bd-utilizator-modal-lg"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <LoginSignupUtilizator />
        </div>
      </div>
      <div
        className="sign_up_modal modal fade bd-partener-modal-lg"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <LoginSignupPartener />
        </div>
      </div>
    </>
  );
};

export default PopupSignInUp;

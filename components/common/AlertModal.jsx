import { useEffect } from "react";

export const AlertModal = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show fixed-bottom m-3 custom-alert`}
      role="alert"
    >
      {message}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

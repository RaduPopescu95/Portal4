import React from "react";

export default function CommonLoader() {
  return (
    <div class="spinner-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

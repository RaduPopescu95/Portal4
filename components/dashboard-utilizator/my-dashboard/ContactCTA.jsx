"use client";

import Link from "next/link";

const ContactCTA = () => {
  return (
    <div className="row my-5">
      <div className="col-12">
        <div className="contact-cta text-center p-4 bg-light border rounded">
          <h2 className="mb-3">Nu găsești funcționalitatea dorită?</h2>
          <p className="mb-4">
            Dacă există o funcționalitate pe care o dorești și nu o găsești, o putem realiza gratuit pentru tine.
            Nu ezita să ne contactezi pentru detalii!
          </p>
          <Link href="https://webappdynamicx.ro/contact" legacyBehavior>
            <a className="btn btn-thm2">Contactează-ne</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactCTA;

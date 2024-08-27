import Link from "next/link";
import Social from "./Social";
import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  return (
    <>
      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 pr0 pl0">
        <div className="footer_about_widget">
          <h4>Alăturați-vă Comunității JobsMD</h4>
          <p>
            JobsMD nu este doar o platformă de recrutare, ci o comunitate
            dedicată excelenței în domeniul medical. Alăturați-vă astăzi și
            descoperiți cum vă putem ajuta să vă atingeți obiectivele
            profesionale.
          </p>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
        <div className="footer_qlink_widget">
          <h4>Companie</h4>
          <ul className="list-unstyled">
            <li>
              <Link href="/despre-noi">Despre noi</Link>
            </li>
            <li>
              <Link href="/termeni-confidentialitate">Termeni si conditii</Link>
            </li>
            {/* <li>
              <Link href="/faq">User’s Guide</Link>
            </li> */}
            {/* <li>
              <Link href="/cum-functioneaza">Cum functioneaza</Link>
            </li> */}
          </ul>
        </div>
      </div>
      {/* End .col */}

      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4">
        <div className="footer_contact_widget">
          <h4>Contactează-ne</h4>
          <ul className="list-unstyled">
            <li>
              <a href="mailto:exclusivmd@creditemedicale.ro">
                exclusivmd@creditemedicale.ro
              </a>
            </li>
            {/* <li>
              <a href="#">Bucurest, str. Cernauti, nr.1A</a>
            </li>
            <li>
              <a href="tel:+079999999">079999999</a>
            </li> */}
          </ul>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div className="footer_social_widget">
          <h4>Urmărește-ne</h4>
          <ul className="mb30">
            <Social />
          </ul>
          <h4>Subscribe</h4>
          <SubscribeForm />
        </div>
      </div> */}
    </>
  );
};

export default Footer;

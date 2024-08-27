import Link from "next/link";

const CallToAction = () => {
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="start_partner tac-smd">
          <h2>
            JobsMD - Locul unde carierele medicale și oportunitățile se
            întâlnesc.
          </h2>
          <p>
            Înregistrează-te acum și începe călătoria ta către succes în
            domeniul medical cu JobsMD!
          </p>{" "}
        </div>
        {/* End .col */}
      </div>
      <div className="col-lg-4">
        <div className="parner_reg_btn text-right tac-smd">
          <Link href="/contact" className="btn btn-thm2">
            Înregistrează-te
          </Link>
        </div>
      </div>
      {/* End .col */}
    </div>
  );
};

export default CallToAction;

import { PLATFORM_NAME } from "@/utils/constants";
import Link from "next/link";

const CallToAction = () => {
  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="start_partner tac-smd">

<h2>
  {PLATFORM_NAME} – Locul unde specialiștii și clienții se conectează.
</h2>
<p>
  Înregistrează-te acum și începe să îți promovezi serviciile și să primești programări online pe {PLATFORM_NAME}!
</p>

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

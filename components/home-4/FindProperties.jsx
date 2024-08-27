import Link from "next/link";
import findProperties from "../../data/findProperties";
import Image from "next/image";

import { getLocalitatiWithUserCounts } from "@/utils/firestoreUtils";
import { jd } from "@/data/judeteLocalitati";

const FindProperties = async () => {
  const localitatiCounts = await getLocalitatiWithUserCounts(jd);

  return (
    <>
      {localitatiCounts.map((item, index) => (
        <div className="col-sm-6 col-lg-4 col-xl-4" key={index}>
          <Link
            href={`/parteneri/parteneri-${item.localitate.toLowerCase()}`}
            className="properti_city style2 d-block"
          >
            <div className="thumb">
              <Image
                width={342}
                height={241}
                className="img-fluid w100 h-100 cover"
                src={"/assets/images/property/pc1.jpg"}
                alt="pc1.jpg"
              />
            </div>
            <div className="details">
              <h4>{item.localitate}</h4>
              <p>{item.count} cadre medicale</p>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default FindProperties;

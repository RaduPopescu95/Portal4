import Image from "next/image";
import PopupVideo from "../common/PopupVideo";

const OurMission = () => {
  const missionContent = [
    {
      id: 1,
      icon: "flaticon-user",
      number: "80,123",
      meta: "Vizitatori zilnic",
    },
    {
      id: 2,
      icon: "flaticon-home",
      number: "1,000",
      meta: "Clinici înregistrate",
    },
    {
      id: 3,
      icon: "flaticon-transfer",
      number: "100,000 RON",
      meta: "În discount",
    },
  ];

  return (
    <>
      <div className="col-lg-12 col-xl-12">
        <div className="about_content">
          {/* <p className="large"> */}
          <p className="large mb0 mb-0">
            Bine ați venit pe JobsMD, platforma dedicată exclusiv cadrelor
            medicale și instituțiilor din domeniul sănătății. Indiferent dacă
            sunteți un angajator în căutare de profesioniști de top sau un
            angajat dornic să-și găsească locul potrivit în carieră, JobsMD este
            aici să vă ajute.
          </p>
          {/* <h2>De ce JobsMD?</h2>
          <h3>Anunțuri Verificate Manual</h3>
          <p>
            Pe JobsMD, siguranța și calitatea sunt pe primul loc. Toate
            anunțurile și companiile sunt verificate manual pentru a asigura
            autenticitatea și relevanța acestora. Astfel, puteți aplica sau
            posta locuri de muncă cu încredere deplină.
          </p>
          <h3>Vizibilitate și Transparență</h3>
          <p>
            Candidații moderni vor să știe mai multe despre locurile unde ar
            putea lucra. JobsMD vă permite să vă prezentați compania în detaliu
            - de la echipă și spațiile de lucru până la avantajele pe care le
            oferiți. În plus, puteți adăuga poze pentru a ilustra mai bine
            mediul de lucru și a atrage astfel cei mai buni profesioniști.
            Fiecare detaliu contează în atragerea celor mai buni candidați.
          </p>
          <h3>Servicii Exclusiv pentru Sectorul Medical</h3>
          <p>
            Pentru a adăuga anunțuri pe platforma noastră, este necesar să vă
            creați un cont. Acest proces este simplu și rapid, dar important
            pentru a menține calitatea serviciilor noastre. JobsMD este dedicat
            doar persoanelor fizice și juridice care activează în sfera medicală
            sau furnizează servicii relevante pentru acest sector.
          </p> */}

          {/* <ul className="ab_counting">
            {missionContent.map((item) => (
              <li className="list-inline-item" key={item.id}>
                <div className="about_counting">
                  <div className="icon">
                    <span className={`${item.icon}`}></span>
                  </div>
                  <div className="details">
                    <p className="mb-2">{item.meta}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul> */}
          {/* End .ab_counting */}
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-5">
        <div className="about_thumb">
          <Image
            width={461}
            height={509}
            priority
            className="img-fluid w100 cover"
            src="/assets/images/about/1.jpg"
            alt="1.jpg"
          />
          <PopupVideo />
        </div>
      </div> */}
    </>
  );
};

export default OurMission;

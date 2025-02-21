import { PLATFORM_NAME } from "@/utils/constants";

const WhyChoose = ({ style = "" }) => {

  const whyCooseContent = [
    {
      id: 1,
      icon: "flaticon-high-five",
      title: "Specialiști Verificați Manual",
      descriptions: `Pe ${PLATFORM_NAME}, siguranța și calitatea sunt prioritare. Toți specialiștii sunt verificați manual pentru a asigura autenticitatea și profesionalismul acestora. Astfel, puteți alege serviciile potrivite cu încredere deplină.`,
    },
    {
      id: 2,
      icon: "flaticon-home-1",
      title: "Programări Online Simple și Rapide",
      descriptions: `Pentru a beneficia de serviciile disponibile pe ${PLATFORM_NAME}, este necesar să vă creați un cont. Acest proces este simplu și rapid, iar contul vă permite să găsiți specialiști și să faceți programări online cu ușurință.`,
    },
    {
      id: 3,
      icon: "flaticon-profit",
      title: "Vizibilitate și Flexibilitate",
      descriptions: `${PLATFORM_NAME} oferă specialiștilor posibilitatea să se prezinte în detaliu – de la descrierea serviciilor și tarifelor până la afișarea programului disponibil. În plus, clienții pot face programări și participa la consultații video direct din platformă.`,
    },
  ];
  
  return (
    <>
      {whyCooseContent.map((item) => (
        <div className="col-md-4 col-lg-4 col-xl-4" key={item.id}>
          <div className={`why_chose_us ${style}`}>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
            <div className="details">
              <h4>{item.title}</h4>
              <p>{item.descriptions}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WhyChoose;

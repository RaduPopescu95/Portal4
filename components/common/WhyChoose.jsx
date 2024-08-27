const WhyChoose = ({ style = "" }) => {
  const whyCooseContent = [
    {
      id: 1,
      icon: "flaticon-high-five",
      title: "Anunțuri Verificate Manual",
      descriptions: `Pe JobsMD, siguranța și calitatea sunt pe primul loc. Toate anunțurile și companiile sunt verificate manual pentru a asigura autenticitatea și relevanța acestora. Astfel, puteți aplica sau posta locuri de muncă cu încredere deplină.`,
    },
    {
      id: 2,
      icon: "flaticon-home-1",
      title: "Servicii Exclusiv pentru Sectorul Medical",
      descriptions: `Pentru a adăuga anunțuri pe platforma noastră, este necesar să vă creați un cont. Acest proces este simplu și rapid, dar important pentru a menține calitatea serviciilor noastre. JobsMD este dedicat doar persoanelor fizice și juridice care activează în sfera medicală sau furnizează servicii relevante pentru acest sector.`,
    },
    {
      id: 3,
      icon: "flaticon-profit",
      title: "Vizibilitate și Transparență",
      descriptions: `Candidații moderni vor să știe mai multe despre locurile unde ar putea lucra. JobsMD vă permite să vă prezentați compania în detaliu - de la echipă și spațiile de lucru până la avantajele pe care le oferiți. În plus, puteți adăuga poze pentru a ilustra mai bine mediul de lucru și a atrage astfel cei mai buni profesioniști. Fiecare detaliu contează în atragerea celor mai buni candidați.`,
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

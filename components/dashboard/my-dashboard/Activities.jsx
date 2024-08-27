const Activities = () => {
  const activities = [
    {
      id: 1,
      numePartener:"Nume partener",
      message: "Primiti 20% discount la produsul xyz.",
    },
    {
      id: 2,
      numePartener:"Nume partener",
      message: " Meniu special de seară la doar 50€ pentru doi.",
    },
    {
      id: 3,
      numePartener:"Nume partener",
      message: "Pachet weekend la munte pentru doi la prețul fix de 200€",
    },
  ];

  return (
    <>
      {activities.map((activity, index) => (
        <div key={activity.id} className={`grid ${index === activities.length - 1 ? 'mb0' : ''} d-flex justify-content-between`}>
        <ul className={`list-unstyled ${index === activities.length - 1 ? 'pb0 mb0 bb_none' : ''}`}>
          <li className="list-inline-item">
            <div className="icon">
              <span className="flaticon-profit"></span>
            </div>
          </li>
          <li className="list-inline-item">
            <p>{activity.message}</p>
          </li>
        </ul>
        {/* Butonul adăugat aici */}
      </div>
      ))}
    </>
  );
};

export default Activities;

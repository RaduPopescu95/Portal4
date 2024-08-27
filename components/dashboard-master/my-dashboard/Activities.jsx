const Activities = ({ actiuni }) => {
  // Sortăm actiuni descrescător după firstUploadDate
  const sortedActiuni = [...actiuni].sort(
    (a, b) => new Date(b.firstUploadDate) - new Date(a.firstUploadDate)
  );

  return (
    <>
      {sortedActiuni.map((activity, index) => (
        <div
          key={activity.id}
          className={`grid ${
            index === sortedActiuni.length - 1 ? "mb0" : ""
          } d-flex justify-content-between`}
        >
          <ul
            className={`list-unstyled ${
              index === sortedActiuni.length - 1 ? "pb0 mb0 bb_none" : ""
            }`}
          >
            <li className="list-inline-item">
              <div className="icon">
                <span className="flaticon-calendar"></span>
              </div>
            </li>
            <li className="list-inline-item">
              <p>
                {activity.firstUploadDate} {activity.firstUploadTime} -{" "}
                {activity.actionText}
              </p>
            </li>
          </ul>
          {/* Butonul adăugat aici */}
        </div>
      ))}
    </>
  );
};

export default Activities;

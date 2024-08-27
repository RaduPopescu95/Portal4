import Image from "next/image";
import properties from "../../../data/properties";

const TableData = () => {
  let theadConent = [
    "Card",
    "Date adaugare",
    "Status",
    "Puncte",
    "Actiune",
  ];
  let tbodyContent = properties?.slice(0, 3)?.map((item) => (
    <tr key={item.id}>
<td className="w-25">
  <div className="w-100">
    <div className="w-100">
      <Image
        width={752} // Dimensiuni ajustate care păstrează raportul
        height={450} // Dimensiuni ajustate (rotunjit)
        layout="responsive"
        objectFit="contain"
        className="img-whp cover"
        src={item.img}
        alt="fp1.jpg"
        style={{ borderRadius: '10px' }} // Colțuri rotunjite
      />
    </div>
  </div>
</td>


      {/* End td */}

      <td>30 December, 2020</td>
      {/* End td */}

      <td>
        <span className="status_tag badge">Pending</span>
      </td>
      {/* End td */}

      <td>2,345</td>
      {/* End td */}

      <td>
        <ul className="view_edit_delete_list mb0">

          <li
            className="list-inline-item"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
          >
            <a href="#">
              <span className="flaticon-garbage"></span>
            </a>
          </li>
        </ul>
      </td>
      {/* End td */}
    </tr>
  ));

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}

        <tbody>{tbodyContent}</tbody>
      </table>
    </>
  );
};

export default TableData;

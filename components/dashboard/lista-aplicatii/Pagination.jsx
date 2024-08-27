import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handleClick = (page, event) => {
    event.preventDefault(); // prevenirea comportamentului default al link-ului
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="page_navigation">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <a
          className="page-link"
          href="#"
          onClick={(e) => handleClick(currentPage - 1, e)}
        >
          <span className="flaticon-left-arrow"></span>
        </a>
      </li>
      {pageNumbers.map((number) => (
        <li
          key={number}
          className={`page-item ${number === currentPage ? "active" : ""}`}
        >
          <a
            className="page-link"
            href="#"
            onClick={(e) => handleClick(number, e)}
          >
            {number}
          </a>
        </li>
      ))}
      <li
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <a
          className="page-link"
          href="#"
          onClick={(e) => handleClick(currentPage + 1, e)}
        >
          <span className="flaticon-right-arrow"></span>
        </a>
      </li>
    </ul>
  );
};

export default Pagination;

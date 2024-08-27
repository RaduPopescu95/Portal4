"use client";

import { useState, useEffect } from "react";

// Hook personalizat pentru gestionarea datelor în tabele cu paginare și căutare
export function useDataWithPaginationAndSearch(
  data,
  searchField,
  itemsPerPage = 6
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Aplică filtrarea folosind câmpul specificat
    const filteredData = data.filter((item) =>
      item[searchField].toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculează totalul de pagini
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));

    // Setează datele curente pentru pagina activă
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentData(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [data, currentPage, itemsPerPage, searchTerm, searchField]);

  return {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm,
    currentPage,
  };
}

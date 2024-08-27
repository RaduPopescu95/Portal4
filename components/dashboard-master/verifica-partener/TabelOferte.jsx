"use client";

import React from "react";
import SearchBox from "./SearchBox";
import TableData from "./TableData";
import Pagination from "./Pagination";

import { useDataWithPaginationAndSearch } from "@/hooks/useDataWithPaginationAndSearch";

export default function TabelOferte({ oferte }) {
  const {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm,
    currentPage,
  } = useDataWithPaginationAndSearch(oferte, "titluOferta");

  return (
    <div className="col-lg-12 mt10">
      <div className="my_dashboard_review">
        <div className="row">
          <div className="col-xl-12">
            <h4>Anunturi Partener</h4>
          </div>
        </div>
        <div className="property_table">
          <div className="w-50">
            <SearchBox onSearch={setSearchTerm} />
          </div>
          <div className="table-responsive mt0">
            <TableData oferte={currentData} />
          </div>
          {/* End .table-responsive */}

          <div className="mbp_pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
          {/* End .mbp_pagination */}
        </div>
      </div>
    </div>
  );
}

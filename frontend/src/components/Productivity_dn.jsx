import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Choice_Dn from "./choice_dn";
import Worker_Performance from "./worker_performance";

const Productivity = () => {

  const organizationList = [
        "D9M","AC1","AM2","D9N"
        ]
     const handleFilterChange = (filterData) => {
    console.log("📥 Received filter data:", filterData);
    setCurrentFilters(filterData);
    // console.log(filterData)
  };

  return (
    <>
       <Choice_Dn
          organizationList={organizationList}        // Send count options        // Send time options
          onSelectionChange={handleFilterChange} // Receive data back
        />

        <Worker_Performance/>
    
    </>
  );
};

export default Productivity;

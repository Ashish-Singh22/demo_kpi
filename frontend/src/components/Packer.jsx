import React, { useState, useEffect } from "react";
import { Package, Users } from "lucide-react";
import Choice_Worker from "./choice_worker";
import Worker_Performance from "./worker_performance";


const Packer = () => {
    const [PackerData, setPackerData] = useState([]);
    const [currentFilters, setCurrentFilters] = useState(null);
    const workerNames = [
        "Packer 1",
        "Packer 2",
        "Packer 3",
        "Packer 4",
        "Packer 5",
    ]
    const countBasisOptions = [
    "Content LPN",
    "Item", 
    "Quantity",
  ];

  const timeBasisOptions = [
     "Drop Off Time"
  ];

  const handleFilterChange = (filterData) => {
    console.log("📥 Received filter data:", filterData);
    setCurrentFilters(filterData);
    // console.log(filterData)
  };

  return (
    <>
    <Choice_Worker
          count_basis={countBasisOptions}        // Send count options
          time_basis={timeBasisOptions}
          worker_names={workerNames}          // Send time options
          onSelectionChange={handleFilterChange} // Receive data back
        />

    <Worker_Performance/>
    </>
  )
};

export default Packer
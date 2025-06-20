import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import Choice_Worker from "./choice_worker";
import Worker_Performance from "./worker_performance";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import WorkerPerformancePlotly from "./worker_performance";

const Packer = () => {
  const [PackerData, setPackerData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [excelFile, setExcelFile] = useState(null); // <-- Store Excel blob

  const workerNames = ["Packer 1", "Packer 2", "Packer 3", "Packer 4", "Packer 5"];

  const countBasisOptions = ["Content LPN", "Item", "Quantity"];
  const timeBasisOptions = ["Drop Off Time"];

  const handleFilterChange = async (filterData) => {
    console.log("📥 Received filter data:", filterData);

    const start = new Date(filterData.startDate);
    const end = new Date(filterData.endDate);
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }

    const updatedFilters = {
      ...filterData,
      dates,
    };

    setCurrentFilters(updatedFilters);

    // // 1. Fetch Packer Data
    // const response = await fetch(SummaryApi.findPacker.url, {
    //   method: SummaryApi.findPacker.method,
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(updatedFilters),
    // });

    // const dataResponse = await response.json();
    // if (dataResponse.success) {
    //   setPackerData(dataResponse.data);

    //   // 2. Fetch Excel File (Python response)
    //   const pythonResponse = await fetch(SummaryApiPython.filterWorkerController.url, {
    //     method: SummaryApiPython.filterWorkerController.method,
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       name: "Packer", // Specify the worker type
    //       PackerData: PackerData, // use the latest fetched Packer data
    //       filterData: updatedFilters,
    //     }),
    //   });

    //   if (pythonResponse.ok) {
    //     const blob = await pythonResponse.blob();
    //     const fileURL = URL.createObjectURL(blob);
    //     setExcelFile(fileURL);
    //     console.log("📦 Excel file received and set");
    //   } else {
    //     const error = await pythonResponse.json();
    //     console.error("❌ Python API error:", error.message);
    //   }

    // } else if (dataResponse.error) {
    //   console.error("❌ Error fetching Packer data:", dataResponse.message);
    // }
  };

  return (
    <>
      <Choice_Worker
        count_basis={countBasisOptions}
        time_basis={timeBasisOptions}
        worker_names={workerNames}
        onSelectionChange={handleFilterChange}
      />
      {excelFile && (
      <WorkerPerformancePlotly excelFile={excelFile} />  // ✅ Proper JSX conditional
     )}
     
      
    </>
  );
};

export default Packer;

import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import Choice_Worker from "./choice_worker";
import Worker_Performance from "./worker_performance";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import WorkerPerformancePlotly from "./worker_performance";
import Choice_Dn from "./choice_dn";

const Shipment = () => {
  const [shipmentData, setShipmentData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [excelFile, setExcelFile] = useState(null); // <-- Store Excel blob

  const organizationList = [
        "D9M","AC1","AM2","D9N"
        ]

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

    // // 1. Fetch shipment Data
    // const response = await fetch(SummaryApi.findShipment.url, {
    //   method: SummaryApi.findShipment.method,
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(updatedFilters),
    // });

    // const dataResponse = await response.json();
    // if (dataResponse.success) {
    //   setshipmentData(dataResponse.data);

    //   // 2. Fetch Excel File (Python response)
    //   const pythonResponse = await fetch(SummaryApiPython.filterDnController.url, {
    //     method: SummaryApiPython.filterDnController.method,
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       name: "shipment", // Specify the Dn type
    //       shipmentData: shipmentData, // use the latest fetched shipment data
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
    //   console.error("❌ Error fetching shipment data:", dataResponse.message);
    // }
  };

  return (
    <>
      <Choice_Dn
        organizationList={organizationList}
        onSelectionChange={handleFilterChange}
      />
      {excelFile && (
      <WorkerPerformancePlotly excelFile={excelFile} />  // ✅ Proper JSX conditional
     )}
     
      
    </>
  );
};

export default Shipment;

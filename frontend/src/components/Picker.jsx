import React, { useState } from "react";
import { Package, Users } from "lucide-react";
import Choice_Worker from "./choice_worker";
import Worker_Performance from "./worker_performance";
import SummaryApi from "../common";
import SummaryApiPython from "../common/index_python";
import WorkerPerformancePlotly from "./worker_performance";

const Picker = () => {
  const [pickerData, setPickerData] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [excelFile, setExcelFile] = useState(null); // <-- Store Excel blob

  const workerNames = ["Picker 1", "Picker 2", "Picker 3", "Picker 4", "Picker 5"];

  const countBasisOptions = ["Line Number", "Item", "Quantity"];
  const timeBasisOptions = ["Loaded Time", "Drop Off Time"];

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

    // 1. Fetch Picker Data
    const response = await fetch(SummaryApi.findPicker.url, {
      method: SummaryApi.findPicker.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFilters),
    });

    const dataResponse = await response.json();
    if (dataResponse.success) {
      setPickerData(dataResponse.data);

      // 2. Fetch Excel File (Python response)
      const pythonResponse = await fetch(SummaryApiPython.filterWorkerController.url, {
        method: SummaryApiPython.filterWorkerController.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickerData: pickerData, // use the latest fetched picker data
          filterData: updatedFilters,
        }),
      });

      if (pythonResponse.ok) {
        const blob = await pythonResponse.blob();
        const fileURL = URL.createObjectURL(blob);
        setExcelFile(fileURL);
        console.log("📦 Excel file received and set");
      } else {
        const error = await pythonResponse.json();
        console.error("❌ Python API error:", error.message);
      }

    } else if (dataResponse.error) {
      console.error("❌ Error fetching picker data:", dataResponse.message);
    }
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

export default Picker;

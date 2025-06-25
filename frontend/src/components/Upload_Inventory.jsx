import React, { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle, AlertCircle, X,
  Loader, Calendar, Package, BarChart3, Download
} from "lucide-react";
import SummaryApiPython from "../common/index_python";
import UploadInventoryShow from "./Upload_Inventory_Show";

const UploadInventory = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [uploadStates, setUploadStates] = useState({
    scheduleReport: { file: null, uploading: false, success: false, error: null },
    exceptionReport: { file: null, uploading: false, success: false, error: null }
  });
  const [processing, setProcessing] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [dataError, setDataError] = useState(null);

  const scheduleInputRef = useRef(null);
  const exceptionInputRef = useRef(null);

  const weeks = Array.from({ length: 4 }, (_, i) => ({
    value: i + 1,
    label: `Week ${i + 1}`
  }));

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const handleFileSelect = (key, file) => {
    setUploadStates(prev => ({
      ...prev,
      [key]: { ...prev[key], file, success: false, error: null }
    }));
  };

  const handleFileRemove = (key) => {
    setUploadStates(prev => ({
      ...prev,
      [key]: { ...prev[key], file: null, success: false, error: null }
    }));
  };

  const handleUploadAndProcess = async () => {
    if (!uploadStates.scheduleReport.file || !uploadStates.exceptionReport.file || !selectedWeek || !selectedMonth) {
      setDataError("Please select both files, week and month.");
      return;
    }

    setProcessing(true);
    setDataError(null);

    setUploadStates(prev => ({
      scheduleReport: { ...prev.scheduleReport, uploading: true, error: null },
      exceptionReport: { ...prev.exceptionReport, uploading: true, error: null }
    }));

    try {
      const formData = new FormData();
      formData.append('scheduleReport', uploadStates.scheduleReport.file);
      formData.append('exceptionReport', uploadStates.exceptionReport.file);
      formData.append('week', selectedWeek);
      formData.append('month', selectedMonth);

      // Debugging
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await fetch(SummaryApiPython.uploadInventoryController.url, {
        method: SummaryApiPython.uploadInventoryController.method || "POST",
        credentials: "include",
        body: formData,
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        console.log("📦 Upload and processing successful:", dataResponse);
        setProcessedData(dataResponse?.data || {});
        setUploadStates(prev => ({
          scheduleReport: { ...prev.scheduleReport, uploading: false, success: true },
          exceptionReport: { ...prev.exceptionReport, uploading: false, success: true }
        }));
      } else {
        throw new Error(dataResponse.message || "Upload and processing failed");
      }
    } catch (error) {
      setDataError(error.message);
      setUploadStates(prev => ({
        scheduleReport: { ...prev.scheduleReport, uploading: false, error: error.message },
        exceptionReport: { ...prev.exceptionReport, uploading: false, error: error.message }
      }));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadResults = () => {
    if (!processedData) return;

    const dataStr = JSON.stringify(processedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `inventory_week${selectedWeek}_month${selectedMonth}.json`;

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
  };

  const canUpload = selectedWeek && selectedMonth && uploadStates.scheduleReport.file && uploadStates.exceptionReport.file;

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Upload Inventory Reports</h2>

      {/* Week and Month Selectors */}
      <div className="flex gap-4">
        <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} className="border px-4 py-2 rounded">
          <option value="">Select Week</option>
          {weeks.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="border px-4 py-2 rounded">
          <option value="">Select Month</option>
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {/* File Upload Inputs */}
      {["scheduleReport", "exceptionReport"].map((type) => (
        <div key={type}>
          <input
            type="file"
            ref={type === "scheduleReport" ? scheduleInputRef : exceptionInputRef}
            onChange={(e) => handleFileSelect(type, e.target.files[0])}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          <div
            onClick={() => {
              if (!processing) {
                (type === "scheduleReport" ? scheduleInputRef : exceptionInputRef).current.click();
              }
            }}
            className={`border p-4 cursor-pointer rounded ${
              uploadStates[type].file ? "border-green-600" : "border-gray-300"
            }`}
          >
            {uploadStates[type].file ? uploadStates[type].file.name : `Upload ${type === "scheduleReport" ? "Schedule" : "Exception"} Report`}
          </div>
          {uploadStates[type].error && <p className="text-red-500 text-sm">{uploadStates[type].error}</p>}
        </div>
      ))}

      {/* Upload Button */}
      <button
        disabled={!canUpload || processing}
        onClick={handleUploadAndProcess}
        className={`w-full py-3 rounded text-white font-semibold ${
          canUpload && !processing ? "bg-red-600 hover:bg-red-700" : "bg-gray-300"
        }`}
      >
        {processing ? "Uploading & Processing..." : "Upload & Process"}
      </button>

      {/* Error Message */}
      {dataError && <p className="text-red-600">{dataError}</p>}

      {/* Download Result */}
      {processedData && (
        <UploadInventoryShow inventoryData={processedData} />
        
      )}
    </div>

    
  );
};

export default UploadInventory;

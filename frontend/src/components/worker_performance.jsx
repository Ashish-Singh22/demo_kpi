// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import Plot from "react-plotly.js";
// import { Upload, Users, BarChart3, Calendar, TrendingUp } from "lucide-react";

// const WorkerPerformancePlotly = () => {
//   const [data, setData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [fileName, setFileName] = useState("");
//   const [isDragging, setIsDragging] = useState(false);

//   const handleFileUpload = (file) => {
//     if (!file) return;

//     setFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       const [headerRow, ...rows] = json;
//       const timeSlots = headerRow.slice(1);
//       setHeaders(timeSlots);

//       const processed = rows.map((row) => {
//         const employee = row[0]?.toString().trim() || "Unknown";
//         const times = row.slice(1).map((v) => parseInt(v) || 0);
//         return { employee, times };
//       });

//       setData(processed);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       handleFileUpload(files[0]);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const barTraces = headers.map((slot, i) => ({
//     x: data.map((d) => d.employee),
//     y: data.map((d) => d.times[i] || 0),
//     name: slot,
//     type: "bar",
//   }));

//   const heatmapZ = data.map((d) => d.times);
//   const heatmapY = data.map((d) => d.employee);

//   const totalHours = data.reduce((sum, emp) => sum + emp.times.reduce((empSum, time) => empSum + time, 0), 0);
//   const avgPerformance = data.length > 0 ? (totalHours / data.length).toFixed(1) : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-4">
//               <div className="bg-blue-600 p-3 rounded-xl">
//                 <TrendingUp className="w-8 h-8 text-white" />
//               </div>
//             </div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">
//               Worker Performance Dashboard
//             </h1>
//             <p className="text-lg text-gray-600">
//               Analyze and visualize employee productivity across time slots
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* File Upload Section */}
//         <div className="mb-8">
//           <div 
//             className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
//               isDragging 
//                 ? 'border-blue-500 bg-blue-50' 
//                 : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
//             }`}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//           >
//             <input 
//               type="file" 
//               accept=".xlsx,.xls" 
//               onChange={(e) => handleFileUpload(e.target.files[0])}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             />
//             <div className="flex flex-col items-center">
//               <div className="bg-blue-100 p-4 rounded-full mb-4">
//                 <Upload className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Upload Excel File
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 Drag and drop your Excel file here, or click to browse
//               </p>
//               <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
//                 Choose File
//               </div>
//             </div>
//           </div>
//         </div>

//         {data.length > 0 && (
//           <>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="bg-green-100 p-3 rounded-lg">
//                     <Users className="w-6 h-6 text-green-600" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Employees</p>
//                     <p className="text-2xl font-bold text-gray-900">{data.length}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="bg-blue-100 p-3 rounded-lg">
//                     <Calendar className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Time Slots</p>
//                     <p className="text-2xl font-bold text-gray-900">{headers.length}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="bg-purple-100 p-3 rounded-lg">
//                     <BarChart3 className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Avg Performance</p>
//                     <p className="text-2xl font-bold text-gray-900">{avgPerformance}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* File Info */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Data Source</h3>
//                   <p className="text-gray-600">{fileName}</p>
//                 </div>
//                 <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                   ✓ Loaded Successfully
//                 </div>
//               </div>
//             </div>

//             {/* Charts Section */}
//             <div className="space-y-8">
//               {/* Bar Chart */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-xl font-semibold text-gray-900">Performance Overview</h3>
//                   <p className="text-gray-600">Stacked bar chart showing hourly performance by employee</p>
//                 </div>
//                 <div className="p-6">
//                   <Plot
//                     data={barTraces}
//                     layout={{
//                       barmode: "stack",
//                       font: { family: "Inter, sans-serif" },
//                       plot_bgcolor: "rgba(0,0,0,0)",
//                       paper_bgcolor: "rgba(0,0,0,0)",
//                       xaxis: {
//                         title: { text: "Employee", font: { size: 14, color: "#374151" } },
//                         tickangle: -45,
//                         gridcolor: "#f3f4f6",
//                         tickfont: { color: "#6b7280" }
//                       },
//                       yaxis: {
//                         title: { text: "Performance Count", font: { size: 14, color: "#374151" } },
//                         gridcolor: "#f3f4f6",
//                         tickfont: { color: "#6b7280" }
//                       },
//                       margin: { t: 20, b: 120, l: 60, r: 20 },
//                       legend: {
//                         orientation: "h",
//                         y: -0.35,
//                         x: 0.5,
//                         xanchor: "center",
//                         font: { size: 12 }
//                       },
//                       colorway: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"]
//                     }}
//                     style={{ width: "100%", height: "500px" }}
//                     useResizeHandler={true}
//                     config={{ responsive: true, displayModeBar: false }}
//                   />
//                 </div>
//               </div>

//               {/* Heatmap */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-xl font-semibold text-gray-900">Performance Heatmap</h3>
//                   <p className="text-gray-600">Visual representation of performance intensity across time slots</p>
//                 </div>
//                 <div className="p-6">
//                   <Plot
//                     data={[
//                       {
//                         z: heatmapZ,
//                         x: headers,
//                         y: heatmapY,
//                         type: "heatmap",
//                         colorscale: [
//                           [0, "#f8fafc"],
//                           [0.2, "#e2e8f0"],
//                           [0.4, "#94a3b8"],
//                           [0.6, "#475569"],
//                           [0.8, "#334155"],
//                           [1, "#1e293b"]
//                         ],
//                         hovertemplate: "<b>%{y}</b><br>%{x}: %{z}<br><extra></extra>",
//                         showscale: true,
//                         colorbar: {
//                           title: "Performance",
//                           titlefont: { color: "#374151" },
//                           tickfont: { color: "#6b7280" }
//                         },
//                         texttemplate: "%{z}",
//                         textfont: {
//                           color: "white",
//                           size: 12,
//                           family: "Inter, sans-serif"
//                         },
//                         showtext: true
//                       },
//                     ]}
//                     layout={{
//                       font: { family: "Inter, sans-serif" },
//                       plot_bgcolor: "rgba(0,0,0,0)",
//                       paper_bgcolor: "rgba(0,0,0,0)",
//                       xaxis: { 
//                         title: { text: "Time Slot", font: { size: 14, color: "#374151" } },
//                         tickfont: { color: "#6b7280" }
//                       },
//                       yaxis: { 
//                         title: { text: "Employee", font: { size: 14, color: "#374151" } },
//                         tickfont: { color: "#6b7280" }
//                       },
//                       margin: { t: 20, b: 80, l: 120, r: 80 },
//                     }}
//                     style={{ width: "100%", height: "500px" }}
//                     useResizeHandler={true}
//                     config={{ responsive: true, displayModeBar: false }}
//                   />
//                 </div>
//               </div>

//               {/* Data Table */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-xl font-semibold text-gray-900">Raw Data</h3>
//                   <p className="text-gray-600">Detailed performance data for all employees</p>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Employee
//                         </th>
//                         {headers.map((h, idx) => (
//                           <th key={idx} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {data.map((row, rowIdx) => (
//                         <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {row.employee}
//                           </td>
//                           {row.times.map((v, colIdx) => (
//                             <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                                 v === 0 ? 'bg-gray-100 text-gray-800' :
//                                 v <= 2 ? 'bg-red-100 text-red-800' :
//                                 v <= 5 ? 'bg-yellow-100 text-yellow-800' :
//                                 'bg-green-100 text-green-800'
//                               }`}>
//                                 {v}
//                               </span>
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WorkerPerformancePlotly;
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Plot from "react-plotly.js";
import { Users, BarChart3, Calendar, TrendingUp } from "lucide-react";

const WorkerPerformancePlotly = ({ excelFile }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (excelFile) {
      loadExcelFile(excelFile);
    }
  }, [excelFile]);

  const loadExcelFile = async (fileURL) => {
    setLoading(true);
    try {
      const response = await fetch(fileURL);
      const arrayBuffer = await response.arrayBuffer();
      
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const [headerRow, ...rows] = json;
      const timeSlots = headerRow.slice(1);
      setHeaders(timeSlots);

      const processed = rows.map((row) => {
        const employee = row[0]?.toString().trim() || "Unknown";
        const times = row.slice(1).map((v) => parseInt(v) || 0);
        return { employee, times };
      });

      setData(processed);
      setFileName("Performance Data");
    } catch (error) {
      console.error("Error loading Excel file:", error);
    } finally {
      setLoading(false);
    }
  };

  const barTraces = headers.map((slot, i) => ({
    x: data.map((d) => d.employee),
    y: data.map((d) => d.times[i] || 0),
    name: slot,
    type: "bar",
  }));

  const heatmapZ = data.map((d) => d.times);
  const heatmapY = data.map((d) => d.employee);

  const totalHours = data.reduce((sum, emp) => sum + emp.times.reduce((empSum, time) => empSum + time, 0), 0);
  const avgPerformance = data.length > 0 ? (totalHours / data.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!excelFile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 inline-block">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600">No performance data available. Please apply filters to generate report.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Worker Performance Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Analyze and visualize employee productivity across time slots
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {data.length > 0 && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Time Slots</p>
                    <p className="text-2xl font-bold text-gray-900">{headers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{avgPerformance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Data Source</h3>
                  <p className="text-gray-600">{fileName}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Loaded Successfully
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Performance Overview</h3>
                  <p className="text-gray-600">Stacked bar chart showing hourly performance by employee</p>
                </div>
                <div className="p-6">
                  <Plot
                    data={barTraces}
                    layout={{
                      barmode: "stack",
                      font: { family: "Inter, sans-serif" },
                      plot_bgcolor: "rgba(0,0,0,0)",
                      paper_bgcolor: "rgba(0,0,0,0)",
                      xaxis: {
                        title: { text: "Employee", font: { size: 14, color: "#374151" } },
                        tickangle: -45,
                        gridcolor: "#f3f4f6",
                        tickfont: { color: "#6b7280" }
                      },
                      yaxis: {
                        title: { text: "Performance Count", font: { size: 14, color: "#374151" } },
                        gridcolor: "#f3f4f6",
                        tickfont: { color: "#6b7280" }
                      },
                      margin: { t: 20, b: 120, l: 60, r: 20 },
                      legend: {
                        orientation: "h",
                        y: -0.35,
                        x: 0.5,
                        xanchor: "center",
                        font: { size: 12 }
                      },
                      colorway: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"]
                    }}
                    style={{ width: "100%", height: "500px" }}
                    useResizeHandler={true}
                    config={{ responsive: true, displayModeBar: false }}
                  />
                </div>
              </div>

              {/* Heatmap */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Performance Heatmap</h3>
                  <p className="text-gray-600">Visual representation of performance intensity across time slots</p>
                </div>
                <div className="p-6">
                  <Plot
                    data={[
                      {
                        z: heatmapZ,
                        x: headers,
                        y: heatmapY,
                        type: "heatmap",
                        colorscale: [
                          [0, "#f8fafc"],
                          [0.2, "#e2e8f0"],
                          [0.4, "#94a3b8"],
                          [0.6, "#475569"],
                          [0.8, "#334155"],
                          [1, "#1e293b"]
                        ],
                        hovertemplate: "<b>%{y}</b><br>%{x}: %{z}<br><extra></extra>",
                        showscale: true,
                        colorbar: {
                          title: "Performance",
                          titlefont: { color: "#374151" },
                          tickfont: { color: "#6b7280" }
                        },
                        texttemplate: "%{z}",
                        textfont: {
                          color: "white",
                          size: 12,
                          family: "Inter, sans-serif"
                        },
                        showtext: true
                      },
                    ]}
                    layout={{
                      font: { family: "Inter, sans-serif" },
                      plot_bgcolor: "rgba(0,0,0,0)",
                      paper_bgcolor: "rgba(0,0,0,0)",
                      xaxis: { 
                        title: { text: "Time Slot", font: { size: 14, color: "#374151" } },
                        tickfont: { color: "#6b7280" }
                      },
                      yaxis: { 
                        title: { text: "Employee", font: { size: 14, color: "#374151" } },
                        tickfont: { color: "#6b7280" }
                      },
                      margin: { t: 20, b: 80, l: 120, r: 80 },
                    }}
                    style={{ width: "100%", height: "500px" }}
                    useResizeHandler={true}
                    config={{ responsive: true, displayModeBar: false }}
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Raw Data</h3>
                  <p className="text-gray-600">Detailed performance data for all employees</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        {headers.map((h, idx) => (
                          <th key={idx} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.employee}
                          </td>
                          {row.times.map((v, colIdx) => (
                            <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                v === 0 ? 'bg-gray-100 text-gray-800' :
                                v <= 2 ? 'bg-red-100 text-red-800' :
                                v <= 5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {v}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkerPerformancePlotly;
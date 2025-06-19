import React, { useState } from "react";

import { toast } from "react-toastify";
import SummaryApiPython from "../common/index_python";

const Home = () => {
  const [data, setData] = useState({
    x: "",
    y: "",
  });
  const [backendSum, setBackendSum] = useState(null); // result from backend

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApiPython.sum.url, {
      method: SummaryApiPython.sum.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        x: Number(data.x),
        y: Number(data.y),
      }),
    });

    const dataResponse = await response.json();

    if (dataResponse.success) {
      toast.success(dataResponse?.message);
      setBackendSum(dataResponse.z); // show backend sum in UI
    } else if (dataResponse.error) {
      toast.error(dataResponse?.message);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center place-content-center">
      <form className="grid gap-3 pt-3" onSubmit={handleSubmit}>
        <label htmlFor="first_number" className="text-sm font-medium">
          First Number:
        </label>
        <input
          type="number"
          id="first_number"
          placeholder="Enter your number"
          name="x"
          value={data.x}
          onChange={handleOnChange}
          className="p-2 border rounded-md text-sm w-full"
          required
        />

        <label htmlFor="second_number" className="text-sm font-medium">
          Second Number:
        </label>
        <input
          type="number"
          id="second_number"
          placeholder="Enter your number"
          name="y"
          value={data.y}
          onChange={handleOnChange}
          className="p-2 border rounded-md text-sm w-full"
          required
        />

        {/* Display backend sum result */}
        {backendSum !== null && (
          <p className="text-sm mt-2 font-medium text-blue-600">
            Sum from Backend (z): {backendSum}
          </p>
        )}

        <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm mt-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Home;

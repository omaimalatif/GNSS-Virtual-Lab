import { useState } from "react";
// import axios from "axios";
import api from "../api/axios";

function Positioning() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [height, setHeight] = useState("");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  const locations = [
    { name: "Islamabad", latitude: 33.6844, longitude: 73.0479, height: 540 },
    { name: "Karachi", latitude: 24.8607, longitude: 67.0011, height: 8 },
    { name: "Lahore", latitude: 31.5204, longitude: 74.3587, height: 217 },
    { name: "Peshawar", latitude: 34.0151, longitude: 71.5249, height: 331 },
    { name: "Quetta", latitude: 30.1798, longitude: 66.9750, height: 1680 }
  ];

  const fetchPosition = async () => {
    setLoading(true);
    try {
      const response = await api.post("/positioning/", {
        latitude: Number(latitude),
        longitude: Number(longitude),
        height: Number(height),
      });
      setPosition(response.data);
    } catch (error) {
      console.error("Error evaluating positions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Premium structural container matching the sage-gray template panel
    <div className="p-6 rounded-[24px] bg-[#cbd1cc] text-[#1e293b] font-sans min-h-[calc(100vh-48px)] transition-all">
      
      {/* Title Header Group */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2c4a3e] m-0">
          Simulation Parameters
        </h2>
        <p className="text-sm text-[#5c7268] mt-1">
          Perform basic receiver position estimation using pseudorange data models.
        </p>
      </div>

      {/* Input Workspace Container (White Card style from layout) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#bec7c2]/40 mb-5">
        <div className="flex flex-wrap items-end gap-4">
          
          {/* Preset Location Dropdown selector */}
          <div className="flex-[1.5] min-w-[200px]">
            <label className="block text-xs font-bold text-[#4a6156] mb-1.5">
              Location Preset
            </label>
            <select
              className="w-full h-10 px-3 py-2 border border-[#bec7c2] rounded-lg text-sm text-[#1e293b] bg-white focus:outline-none transition-colors"
              onChange={(e) => {
                const city = locations.find((l) => l.name === e.target.value);
                if (city) {
                  setLatitude(city.latitude);
                  setLongitude(city.longitude);
                  setHeight(city.height);
                }
              }}
            >
              <option value="">-- Custom Coordinates --</option>
              {locations.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Core Telemetry Input Fields */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-bold text-[#4a6156] mb-1.5">Latitude</label>
            <input 
              type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)}
              className="w-full h-10 px-3 border border-[#bec7c2] rounded-lg text-sm focus:outline-none" 
            />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-bold text-[#4a6156] mb-1.5">Longitude</label>
            <input 
              type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)}
              className="w-full h-10 px-3 border border-[#bec7c2] rounded-lg text-sm focus:outline-none" 
            />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-bold text-[#4a6156] mb-1.5">Height (m)</label>
            <input 
              type="number" step="any" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full h-10 px-3 border border-[#bec7c2] rounded-lg text-sm focus:outline-none" 
            />
          </div>

          {/* Dark Forest Action Button matching your screenshots */}
          <button
            onClick={fetchPosition}
            disabled={loading}
            className="h-10 px-6 bg-[#345447] hover:bg-[#253d33] disabled:bg-[#5c7268] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            {loading ? "Simulating..." : "Simulate"}
          </button>
        </div>
      </div>

      {/* Main Results View Dashboard */}
      {position ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Reference Geometries */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bec7c2]/30 transition-all">
            <h3 className="text-xs font-bold text-[#5c7268] uppercase tracking-wider mb-3">
              Actual Position
            </h3>
            <div className="space-y-1.5 text-sm font-medium text-[#1e293b]">
              <div className="flex justify-between border-b border-gray-100 pb-1"><span>Lat:</span> <span className="font-mono">{position.actual?.latitude}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span>Lng:</span> <span className="font-mono">{position.actual?.longitude}</span></div>
              <div className="flex justify-between"><span>Height:</span> <span className="font-mono">{position.actual?.height} m</span></div>
            </div>
          </div>

          {/* Card 2: Estimated Geometries */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bec7c2]/30 transition-all">
            <h3 className="text-xs font-bold text-[#5c7268] uppercase tracking-wider mb-3">
              Estimated Position
            </h3>
            <div className="space-y-1.5 text-sm font-medium text-[#1e293b]">
              <div className="flex justify-between border-b border-gray-100 pb-1"><span>Lat:</span> <span className="font-mono">{position.estimated?.latitude}</span></div>
              <div className="flex justify-between border-b border-gray-100 pb-1"><span>Lng:</span> <span className="font-mono">{position.estimated?.longitude}</span></div>
              <div className="flex justify-between"><span>Height:</span> <span className="font-mono">{position.estimated?.height} m</span></div>
            </div>
          </div>

          {/* Card 3: Measured Vector Deltas */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bec7c2]/30 flex flex-col justify-between transition-all">
            <h3 className="text-xs font-bold text-[#5c7268] uppercase tracking-wider mb-2">
              Position Error
            </h3>
            <div>
              <p className="text-4xl font-bold font-mono text-[#345447]">
                {position.positionError?.toFixed(3) ?? "0.000"} <span className="text-sm font-sans font-semibold text-[#5c7268]">m</span>
              </p>
              <span className="text-[11px] font-medium text-gray-400 block mt-1">Geometric variance delta vector</span>
            </div>
          </div>

          {/* Card 4: Receiver Time Divergences */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#bec7c2]/30 flex flex-col justify-between transition-all">
            <h3 className="text-xs font-bold text-[#5c7268] uppercase tracking-wider mb-2">
              Receiver Clock Bias
            </h3>
            <div>
              <p className="text-4xl font-bold font-mono text-[#345447]">
                {position.clockBias?.toFixed(2) ?? "0.00"}
              </p>
              <span className="text-[11px] font-semibold text-[#5c7268] block uppercase mt-1">
                {position.clockBiasUnit || "ns"}
              </span>
            </div>
          </div>

        </div>
      ) : (
        // Standard Empty State placeholder matching your simulation panels
        <div className="bg-white rounded-2xl border border-[#bec7c2]/30 p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-[#64748b]">
            No active positioning metrics evaluated. Select coordinates and execute parameters above.
          </p>
        </div>
      )}
    </div>
  );
}

export default Positioning;
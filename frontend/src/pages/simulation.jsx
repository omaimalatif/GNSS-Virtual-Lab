import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skyplot from '../components/Skyplot';
import MapPicker from "../components/MapPicker";
import api from '../api/axios';

export default function Simulation() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [height, setHeight] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Custom Coordinates");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileOrTablet = windowWidth < 1024;

  const locations = [
    { name: "Custom Coordinates", latitude: "", longitude: "", height: "" },
    { name: "Islamabad", latitude: 33.6844, longitude: 73.0479, height: 540 },
    { name: "Karachi", latitude: 24.8607, longitude: 67.0011, height: 8 },
    { name: "Lahore", latitude: 31.5204, longitude: 74.3587, height: 217 },
    { name: "Peshawar", latitude: 34.0151, longitude: 71.5249, height: 331 },
    { name: "Quetta", latitude: 30.1798, longitude: 66.9750, height: 1680 },
    { name: "Gilgit", latitude: 35.9208, longitude: 74.3142, height: 1500 },
    { name: "Skardu", latitude: 35.2971, longitude: 75.6337, height: 2228 },
  ];

  const years = Array.from({ length: 2026 - 2018 + 1 }, (_, i) => 2018 + i);

  const fetchVisibility = async (lat, lon, h) => {
    setLoading(true);
    try {
      const response = await api.post("/visibility/", {
        latitude: Number(lat),
        longitude: Number(lon),
        height: Number(h),
      });
      setSatellites(response.data);
    } catch (error) {
      console.error("Backend connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVisibility(latitude, longitude, height);
  };

  const handleLocationChange = async (e) => {
    const city = locations.find((loc) => loc.name === e.target.value);
    setSelectedLocation(city.name);
    setLatitude(city.latitude);
    setLongitude(city.longitude);
    setHeight(city.height);

    if (city.name !== "Custom Coordinates") {
      await fetchVisibility(city.latitude, city.longitude, city.height);
    }
  };

  const visibleSatellites = satellites.filter((sat) => sat.visible);
  const hiddenSatellites = satellites.filter((sat) => !sat.visible);

  return (
    <div style={styles.container}>
      <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Simulation Parameters</h3>
      <div
    className="glass-panel"
    style={{
        marginBottom: "24px",
        padding: "18px",
    }}
>
    <h4
        style={{
            color: "#fff",
            marginBottom: "15px",
            fontSize: "16px",
        }}
    >
        📍 Select Receiver Location
    </h4>

    <MapPicker
        latitude={latitude}
        longitude={longitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        />
      </div>
      {/* High-Tech Parameter Grid Card */}
      <form onSubmit={handleSubmit} className="glass-panel" style={styles.panelCard}>
        <div style={styles.formRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Location Preset</label>
            <select value={selectedLocation} onChange={handleLocationChange} style={styles.selectInput}>
              {locations.map((loc) => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Dataset Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={styles.selectInput}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {['Latitude', 'Longitude', 'Height (m)'].map((label, i) => (
            <div key={label} style={styles.inputGroup}>
              <label style={styles.label}>{label}</label>
              <input 
                type="number" 
                step="any" 
                style={styles.textInput}
                value={i === 0 ? latitude : i === 1 ? longitude : height} 
                disabled={selectedLocation !== "Custom Coordinates"} 
                onChange={(e) => i === 0 ? setLatitude(e.target.value) : i === 1 ? setLongitude(e.target.value) : setHeight(e.target.value)} 
                required 
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Processing...' : 'Simulate'}
          </button>
        </div>
      </form>

      {/* Workspace Split Panel */}
      <div style={{ display: 'flex', flexDirection: isMobileOrTablet ? 'column' : 'row', gap: '20px', flex: 1 }}>
        <div className="glass-panel" style={{ width: isMobileOrTablet ? '100%' : '40%', maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '13px' }}>
            <span style={{ color: '#a0aec0' }}>Total: <b>{satellites.length}</b></span>
            <span style={{ color: '#52c41a' }}>Visible: <b>{visibleSatellites.length}</b></span>
            <span style={{ color: '#ff4d4f' }}>Hidden: <b>{hiddenSatellites.length}</b></span>
          </div>

          {visibleSatellites.length > 0 ? (
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                   <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>PRN</th>
                   <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>Azimuth</th>
                   <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8' }}>Elevation</th>
                 </tr>
               </thead>
               <tbody>
                 {visibleSatellites.map((sat, index) => (
                   <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                     <td style={{ padding: '12px 8px', color: '#52c41a', fontWeight: 'bold' }}>{sat.satellite}</td>
                     <td style={{ padding: '12px 8px', color: '#fff' }}>{sat.azimuth?.toFixed(1)}°</td>
                     <td style={{ padding: '12px 8px', color: '#fff' }}>{sat.elevation?.toFixed(1)}°</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          ) : (
            <div style={{ textAlign: 'center', color: '#475569', marginTop: '40px' }}>No active tracking data.</div>
          )}
        </div>
        
        <div className="glass-panel" style={{ width: isMobileOrTablet ? '100%' : '60%' }}>
          <Skyplot visibleSatellites={visibleSatellites} isCompact={isMobileOrTablet} />
        </div>
      </div> 
    </div>
  );
}

const styles = {
  container: { width: '100%', marginTop: '30px', paddingBottom: '40px' },
  panelCard: { padding: '24px', marginBottom: '24px' },
  formRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '140px' },
  label: { fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  textInput: { height: '42px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', color: '#ffffff', padding: '0 12px', fontSize: '14px', outline: 'none', fontFamily: 'monospace', width: '100%', boxSizing: 'border-box' },
  selectInput: { height: '42px', backgroundColor: '#0f1115', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', color: '#ffffff', padding: '0 12px', fontSize: '13.5px', outline: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box' },
  submitBtn: { height: '42px', padding: '0 24px', backgroundColor: '#ffffff', color: '#070809', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.15s ease' }
};
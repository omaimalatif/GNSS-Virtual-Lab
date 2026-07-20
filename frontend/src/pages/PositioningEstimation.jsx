import React, { useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import MapPicker from "../components/MapPicker";

export default function PositioningEstimation() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [height, setHeight] = useState("");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  // Common reference stations for fast testing/validation
  const locations = [
    { name: "Islamabad", latitude: 33.6844, longitude: 73.0479, height: 540 },
    { name: "Karachi", latitude: 24.8607, longitude: 67.0011, height: 8 },
    { name: "Lahore", latitude: 31.5204, longitude: 74.3587, height: 217 },
    { name: "Peshawar", latitude: 34.0151, longitude: 71.5249, height: 331 },
    { name: "Quetta", latitude: 30.1798, longitude: 66.9750, height: 1680 }
  ];

  const fetchPosition = async () => {
    if (!latitude || !longitude || !height) return;
    setLoading(true);
    try {
      const response = await axios.post("/positioning/", {
        latitude: Number(latitude),
        longitude: Number(longitude),
        height: Number(height),
      });
      setPosition(response.data);
    } catch (error) {
      console.error("Error executing positioning calculation pipeline:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.headerBlock}>
        <h2 style={styles.title}>Receiver Position Estimation</h2>

<p style={styles.subtitle}>
  Estimate the receiver position using GNSS pseudorange observations and compare the computed solution with the selected reference coordinates.
</p>
      </div>

      {/* High-Tech Parameter Grid Card */}
      <div style={styles.panelCard}>
        <div style={styles.formRow}>
          
          <div style={{ ...styles.inputGroup, flex: '1.2' }}>
            <label style={styles.label}>Reference Location</label>
            <select
              style={styles.selectInput}
              onChange={(e) => {
                const city = locations.find((l) => l.name === e.target.value);
                if (city) {
                  setLatitude(city.latitude);
                  setLongitude(city.longitude);
                  setHeight(city.height);
                }
              }}
            >
              <option value="">Choose Location</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Latitude (°N)</label>
            <input 
              type="number" 
              step="any" 
              placeholder="0.000000"
              value={latitude} 
              onChange={(e) => setLatitude(e.target.value)} 
              style={styles.textInput} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Longitude (°E)</label>
            <input 
              type="number" 
              step="any" 
              placeholder="0.000000"
              value={longitude} 
              onChange={(e) => setLongitude(e.target.value)} 
              style={styles.textInput} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Height (m)</label>
            <input 
              type="number" 
              step="any" 
              placeholder="0.0"
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              style={styles.textInput} 
            />
          </div>

          <button
            onClick={fetchPosition}
            disabled={loading || !latitude || !longitude || !height}
            style={{
              ...styles.submitBtn,
              opacity: (loading || !latitude || !longitude || !height) ? 0.5 : 1,
              cursor: (loading || !latitude || !longitude || !height) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Computing..." : "Estimate Position"}
          </button>
        </div>
      </div>
      
      <div
  className="glass-panel"
  style={{
    padding: "20px",
    marginBottom: "24px",
  }}
>
  <h3
    style={{
      color: "#fff",
      marginBottom: "16px",
      fontSize: "16px",
    }}
  >
    Select Receiver Position
  </h3>

  <MapPicker
    latitude={latitude}
    longitude={longitude}
    setLatitude={setLatitude}
    setLongitude={setLongitude}
  />
</div>

      {/* Interactive Telemetry Reports Area */}
      {position ? (
        <div style={styles.resultsGrid}>
          
          {/* Card 1: Reference Geometry */}
          <div style={styles.dataCard}>
            <span style={styles.cardHeader}>Reference Coordinates</span>
            <div style={styles.metricStack}>
              <div style={styles.metricRow}><span>Lat</span> <span style={styles.mono}>{position.actual?.latitude}°</span></div>
              <div style={styles.metricRow}><span>Lon</span> <span style={styles.mono}>{position.actual?.longitude}°</span></div>
              <div style={{...styles.metricRow, border: 'none'}}><span>Height</span> <span style={styles.mono}>{position.actual?.height} m</span></div>
            </div>
          </div>

          {/* Card 2: System Estimates */}
          <div style={styles.dataCard}>
            <span style={styles.cardHeader}>Estimated Receiver Position</span>
            <div style={styles.metricStack}>
              <div style={styles.metricRow}><span>Lat</span> <span style={styles.mono}>{position.estimated?.latitude}°</span></div>
              <div style={styles.metricRow}><span>Lon</span> <span style={styles.mono}>{position.estimated?.longitude}°</span></div>
              <div style={{...styles.metricRow, border: 'none'}}><span>Height</span> <span style={styles.mono}>{position.estimated?.height} m</span></div>
            </div>
          </div>

          {/* Card 3: 3D Delta Position Error */}
          <div style={styles.dataCardHighlight}>
            <span style={styles.cardHeaderLight}>Position Error</span>
            <div style={{ marginTop: 'auto' }}>
              <div style={styles.giantMetric}>
                {position.positionError} <span style={{ fontSize: '16px', color: '#9ca3af' }}>m</span>
              </div>
              <div style={styles.statusIndicator}>
                <div style={styles.greenDot} /> 
                <span style={{ fontSize: '11px', color: '#a3a3a3', fontWeight: '500' }}>Position Solution Valid</span>
              </div>
            </div>
          </div>

          {/* Card 4: Receiver Clock Bias Vector */}
          <div style={styles.dataCard}>
            <span style={styles.cardHeader}>Receiver Clock Offset</span>
            <div style={{ marginTop: 'auto' }}>
              <div style={styles.giantMetric}>
                {position.clockBias} <span style={{ fontSize: '16px', color: '#6b7280' }}>{position.clockBiasUnit || "ns"}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#6b7280', display: 'block', mt: '4px' }}>Receiver clock offset from GNSS system time</span>
            </div>
          </div>

        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}></div>
          <p style={styles.emptyText}>
           Select a reference location or enter receiver coordinates, then estimate the receiver position to view the computed solution, positioning error, and receiver clock bias.
          </p>
        </div>
      )}
    </div>
  );
}

// Deep space dashboard-matching layout specs
const styles = {
  container: {
    animation: 'fadeIn 0.4s ease-out',
  },
  headerBlock: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '6px',
    maxWidth: '700px',
    lineHeight: '1.5',
  },
  panelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '140px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  textInput: {
    height: '42px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '0 12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'monospace',
  },
  selectInput: {
    height: '42px',
    backgroundColor: '#0f1115',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '0 12px',
    fontSize: '13.5px',
    outline: 'none',
    cursor: 'pointer',
  },
  submitBtn: {
    height: '42px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    color: '#070809',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.15s ease',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  dataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '140px',
    boxSizing: 'border-box',
  },
  dataCardHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '140px',
    boxSizing: 'border-box',
  },
  cardHeader: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardHeaderLight: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricStack: {
    marginTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13.5px',
    color: '#9ca3af',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    paddingBottom: '6px',
  },
  mono: {
    fontFamily: 'monospace',
    color: '#ffffff',
    fontWeight: '500',
  },
  giantMetric: {
    fontSize: '36px',
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#ffffff',
    marginTop: '12px',
    lineHeight: '1',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px',
  },
  greenDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 8px #10b981',
  },
  emptyState: {
    border: '1px dashed rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.002)',
  },
  emptyIcon: {
    fontSize: '28px',
    marginBottom: '14px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '13.5px',
    color: '#6b7280',
    maxWidth: '440px',
    margin: '0 auto',
    lineHeight: '1.5',
  }
};
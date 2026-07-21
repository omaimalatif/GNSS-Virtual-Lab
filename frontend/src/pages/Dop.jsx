import React, { useState, useEffect } from 'react';
import MapPicker from "../components/MapPicker";
import api from "../api/axios";

const PAKISTAN_LOCATIONS = {
  custom: { name: 'Custom Coordinates', lat: '', lng: '', alt: '' },
  karachi: { name: 'Karachi (Sindh)', lat: '24.8607', lng: '67.0011', alt: '10' },
  lahore: { name: 'Lahore (Punjab)', lat: '31.5204', lng: '74.3587', alt: '217' },
  faisalabad: { name: 'Faisalabad (Punjab)', lat: '31.4504', lng: '73.1350', alt: '184' },
  rawalpindi: { name: 'Rawalpindi (Punjab)', lat: '33.5651', lng: '73.0169', alt: '508' },
  peshawar: { name: 'Peshawar (KPK)', lat: '34.0151', lng: '71.5249', alt: '331' },
  quetta: { name: 'Quetta (Balochistan)', lat: '30.1798', lng: '66.9750', alt: '1680' },
  multan: { name: 'Multan (Punjab)', lat: '30.1575', lng: '71.5249', alt: '122' },
  gujranwala: { name: 'Gujranwala (Punjab)', lat: '32.1877', lng: '74.1945', alt: '226' },
  hyderabad: { name: 'Hyderabad (Sindh)', lat: '25.3960', lng: '68.3578', alt: '13' },
  gilgit: { name: 'Gilgit (Gilgit-Baltistan)', lat: '35.9208', lng: '74.3089', alt: '1500' },
  muzaffarabad: { name: 'Muzaffarabad (Azad Kashmir)', lat: '34.3700', lng: '73.4708', alt: '737' }
};

export default function Dop() {
  const [selectedPreset, setSelectedPreset] = useState('karachi');
  const [formData, setFormData] = useState({ latitude: '24.8607', longitude: '67.0011', height: '10' });
  const [dopResults, setDopResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVisualizerTab, setActiveVisualizerTab] = useState('good');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileOrTablet = windowWidth < 1024;

  const getRating = (value) => {
    const val = parseFloat(value);
    if (!val || val <= 0) return { label: 'Unknown', color: '#a0aec0', bg: 'rgba(255, 255, 255, 0.05)' };
    if (val <= 2.0) return { label: 'Excellent', color: '#ffffff', bg: 'rgba(255, 255, 255, 0.15)' };
    if (val <= 5.0) return { label: 'Good', color: '#e2e8f0', bg: 'rgba(255, 255, 255, 0.10)' };
    return { label: 'Moderate', color: '#cbd5e1', bg: 'rgba(255, 255, 255, 0.06)' };
  };

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    setSelectedPreset(presetKey);
    if (presetKey !== 'custom') {
      const target = PAKISTAN_LOCATIONS[presetKey];
      setFormData({ latitude: target.lat, longitude: target.lng, height: target.alt });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedPreset('custom');
  };

  const handleCalculateDop = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/dop/', {
  latitude: parseFloat(formData.latitude),
  longitude: parseFloat(formData.longitude),
  height: parseFloat(formData.height)
});
setDopResults(response.data);
    } catch (err) {
      setError("Failed to fetch calculation from the GNSS backend service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', marginTop: '30px' }}>
      
      <h3 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '600', margin: 0 }}>DOP Spatial Analysis</h3>

      {/* 🛠️ Input Section Header & Form styled in Dark Mode with High-Contrast inputs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <form onSubmit={handleCalculateDop} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: isMobileOrTablet ? 'wrap' : 'nowrap' }}>
          
          {/* Preset Selector */}
          <div style={{ flex: 1.5, minWidth: isMobileOrTablet ? '100%' : '200px' }}>
            <label className="dashboard-heading" style={labelStyle}>Location Preset</label>
            <select 
              value={selectedPreset} 
              onChange={handlePresetChange} 
              style={darkFieldStyle}
            >
              <option value="custom" style={{ background: '#0e1311', color: '#fff' }}>Custom Coordinates</option>
              {Object.keys(PAKISTAN_LOCATIONS).map((key) => (
                key !== 'custom' && (
                  <option key={key} value={key} style={{ background: '#0e1311', color: '#fff' }}>
                    {PAKISTAN_LOCATIONS[key].name}
                  </option>
                )
              ))}
            </select>
          </div>

          {/* Input Fields */}
          {['latitude', 'longitude', 'height'].map((field) => (
            <div key={field} style={{ flex: 1, minWidth: '120px' }}>
              <label className="dashboard-heading" style={labelStyle}>
                {field === 'height' ? 'Height (M)' : field.toUpperCase()}
              </label>
              <input 
                type="number" 
                step="any" 
                name={field}
                value={formData[field]} 
                disabled={selectedPreset !== 'custom'}
                onChange={handleInputChange} 
                required 
                style={darkFieldStyle}
              />
            </div>
          ))}

          {/* Curved Primary Action Button */}
          <button 
            type="submit" 
            disabled={loading} 
            style={curvedButtonStyle}
          >
            {loading ? 'Computing...' : 'Analyze Geometry'}
          </button>
        </form>
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
    Select Analysis Location
  </h3>

  <MapPicker
    latitude={formData.latitude}
    longitude={formData.longitude}
    setLatitude={(lat) =>
      setFormData((prev) => ({ ...prev, latitude: lat }))
    }
    setLongitude={(lng) =>
      setFormData((prev) => ({ ...prev, longitude: lng }))
    }
  />
</div>

      {error && (
        <div style={{ padding: '14px', backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#fca5a5', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* 📱 Main Workspace Content Grid */}
      <div style={{ display: 'flex', flexDirection: isMobileOrTablet ? 'column' : 'row', gap: '20px', flex: 1 }}>
        
        {/* Left Panel: Results Panel */}
        <div className="glass-panel" style={{ width: isMobileOrTablet ? '100%' : '45%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
          {dopResults ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>Active Constellation:</span>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{dopResults.visibleSatellites ?? 0} Satellites</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Geometric DOP (GDOP)', val: dopResults.GDOP },
                  { label: 'Position DOP (PDOP)', val: dopResults.PDOP },
                  { label: 'Horizontal DOP (HDOP)', val: dopResults.HDOP },
                  { label: 'Vertical DOP (VDOP)', val: dopResults.VDOP },
                  { label: 'Time DOP (TDOP)', val: dopResults.TDOP }
                ].map((item, index) => {
                  const rating = getRating(item.val);
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>{item.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '17px', color: '#ffffff', fontWeight: '700', fontFamily: 'monospace' }}>
                          {item.val?.toFixed(2) ?? '0.00'}
                        </span>
                        <span style={{ fontSize: '10px', color: rating.color, backgroundColor: rating.bg, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.08)', fontWeight: '600' }}>
                          {rating.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '280px', color: '#cbd5e1', fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
              Provide inputs above and click analyze to track dilution matrix.
            </div>
          )}
        </div>

        {/* Right Panel: High-Visibility Graphical Explainer */}
        <div className="glass-panel" style={{ width: isMobileOrTablet ? '100%' : '55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span className="dashboard-heading" style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>Constellation Geometry</span>
            
            {/* Dark Segmented Control buttons */}
            <div style={{ display: 'flex', gap: '4px', background: '#090d0b', padding: '3px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button 
                type="button"
                onClick={() => setActiveVisualizerTab('good')}
                style={{ ...tabBtnStyle, color: activeVisualizerTab === 'good' ? '#ffffff' : '#94a3b8', background: activeVisualizerTab === 'good' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              >
                Optimal (Low DOP)
              </button>
              <button 
                type="button"
                onClick={() => setActiveVisualizerTab('bad')}
                style={{ ...tabBtnStyle, color: activeVisualizerTab === 'bad' ? '#ffffff' : '#94a3b8', background: activeVisualizerTab === 'bad' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              >
                Poor (High DOP)
              </button>
            </div>
          </div>

          {/* SVG Canvas Area with clean high-contrast vectors */}
          <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#070a09', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180">
              {/* Receiver (White Spot) */}
              <circle cx="200" cy="140" r="5" fill="#ffffff" />
              <text x="200" y="162" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="600">Receiver</text>

              {activeVisualizerTab === 'good' ? (
                <>
                  {/* Satellites */}
                  <circle cx="90" cy="40" r="7" fill="#ffffff" opacity="0.8" />
                  <circle cx="310" cy="40" r="7" fill="#ffffff" opacity="0.8" />
                  <text x="90" y="25" fill="#ffffff" fontSize="10" textAnchor="middle">Sat 01</text>
                  <text x="310" y="25" fill="#ffffff" fontSize="10" textAnchor="middle">Sat 02</text>
                  
                  {/* Rays */}
                  <line x1="90" y1="40" x2="200" y2="140" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" />
                  <line x1="310" y1="40" x2="200" y2="140" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" />
                  
                  {/* Geometry Area */}
                  <ellipse cx="200" cy="140" rx="14" ry="14" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
                  <text x="200" y="90" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="600">Wide-Angle Triangulation</text>
                </>
              ) : (
                <>
                  {/* Satellites */}
                  <circle cx="185" cy="35" r="7" fill="#ffffff" opacity="0.8" />
                  <circle cx="215" cy="35" r="7" fill="#ffffff" opacity="0.8" />
                  <text x="160" y="25" fill="#ffffff" fontSize="10" textAnchor="middle">Sat 01</text>
                  <text x="240" y="25" fill="#ffffff" fontSize="10" textAnchor="middle">Sat 02</text>
                  
                  {/* Rays */}
                  <line x1="185" y1="35" x2="200" y2="140" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" strokeDasharray="3,3" />
                  <line x1="215" y1="35" x2="200" y2="140" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" strokeDasharray="3,3" />
                  
                  {/* Geometry Area */}
                  <ellipse cx="200" cy="140" rx="16" ry="36" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
                  <text x="200" y="90" fill="#ffffff" fontSize="13" textAnchor="middle" fontWeight="600">Clustered Constellation</text>
                </>
              )}
            </svg>
          </div>
          
          <p style={{ margin: '14px 0 0 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
            Spatially separated satellites give precise geometric positioning vectors, minimizing multi-dimensional tracking uncertainty layout.
          </p>
        </div>

      </div>
    </div>
  );
}

// Global Custom Layout Variables
const labelStyle = { 
  marginBottom: '8px', 
  display: 'block',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px'
};

const darkFieldStyle = {
  width: '100%',
  height: '42px',
  backgroundColor: '#0e1311',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '24px', // Curved Inputs to match!
  padding: '0 16px',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s',
};

// Premium, Pill-Shaped Rounded Action Button Style
const curvedButtonStyle = {
  height: '42px',
  padding: '0 28px',
  whiteSpace: 'nowrap',
  backgroundColor: '#1b5e20',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '24px', // Curved visual edge styling
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
};

const tabBtnStyle = {
  padding: '6px 14px',
  fontSize: '11px',
  fontWeight: '600',
  border: 'none',
  borderRadius: '20px', // Curved Pill Tabs
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};
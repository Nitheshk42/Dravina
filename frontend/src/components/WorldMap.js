import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryCoords = {
  'United States': [-95, 38],
  'United Kingdom': [-2, 54],
  'Europe': [10, 51],
  'India': [78, 22],
  'Australia': [133, -25],
  'Canada': [-96, 60],
  'Singapore': [103, 1],
  'UAE': [54, 24],
};

function WorldMap({ selectedCountry, recipientCountry }) {
  const userCoords = [-95, 38];
  const destCoords = countryCoords[selectedCountry] || null;
  const recipientCoords = countryCoords[recipientCountry] || null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a1628, #0f2d4a)',
      borderRadius: '24px',
      padding: '24px',
      minHeight: '90%',
      height: '80%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: 'white', fontWeight: '800', fontSize: '18px', margin: 0 }}>
          🌍 Transfer Route
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '4px 0 0' }}>
          {selectedCountry
            ? `USA → ${selectedCountry}`
            : 'Select a country to see route'}
        </p>
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [20, 20] }}
          style={{ width: '100%', height: '480px' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: '#1a3a5c', stroke: '#0a1628', strokeWidth: 0.5, outline: 'none' },
                    hover: { fill: '#1a3a5c', outline: 'none' },
                    pressed: { fill: '#1a3a5c', outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>

          {/* Line to selected country */}
          {destCoords && (
            <Line
              from={userCoords}
              to={destCoords}
              stroke="#1a7a6e"
              strokeWidth={2}
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
          )}

          {/* Line to recipient country */}
          {recipientCoords && recipientCountry !== selectedCountry && (
            <Line
              from={userCoords}
              to={recipientCoords}
              stroke="#e67e22"
              strokeWidth={2}
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
          )}

          {/* User Marker */}
          <Marker coordinates={userCoords}>
            <circle r={12} fill="#0f4c81" stroke="white" strokeWidth={2} />
            <circle r={22} fill="#0f4c81" fillOpacity={0.3} />
            <text textAnchor="middle" y={-28}
              style={{ fontSize: '11px', fill: 'white', fontWeight: '700', fontFamily: 'Arial' }}>
              🏠 You
            </text>
          </Marker>

          {/* Destination Marker */}
          {destCoords && (
            <Marker coordinates={destCoords}>
              <circle r={10} fill="#1a7a6e" stroke="white" strokeWidth={2} />
              <circle r={20} fill="#1a7a6e" fillOpacity={0.3} />
              <text textAnchor="middle" y={-26}
                style={{ fontSize: '10px', fill: 'white', fontWeight: '600', fontFamily: 'Arial' }}>
                💸 {selectedCountry}
              </text>
            </Marker>
          )}

          {/* Recipient Marker */}
          {recipientCoords && recipientCountry !== selectedCountry && (
            <Marker coordinates={recipientCoords}>
              <circle r={10} fill="#e67e22" stroke="white" strokeWidth={2} />
              <circle r={20} fill="#e67e22" fillOpacity={0.3} />
              <text textAnchor="middle" y={-26}
                style={{ fontSize: '10px', fill: 'white', fontWeight: '600', fontFamily: 'Arial' }}>
                👤 {recipientCountry}
              </text>
            </Marker>
          )}

        </ComposableMap>
      </div>

      {/* Route Info */}
      {selectedCountry ? (
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '16px', marginTop: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0 }}>FROM</p>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '14px', margin: '2px 0 0' }}>🇺🇸 United States</p>
            </div>
            <p style={{ color: '#1a7a6e', fontSize: '24px', margin: 0 }}>→</p>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0 }}>TO</p>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '14px', margin: '2px 0 0' }}>💸 {selectedCountry}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px', padding: '16px',
          marginTop: '12px', textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
            👆 Select a country to see your transfer route!
          </p>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0f4c81' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Your location</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1a7a6e' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Destination</span>
        </div>
        {recipientCoords && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e67e22' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Recipient</span>
          </div>
        )}
      </div>

    </div>
  );
}

export default WorldMap;
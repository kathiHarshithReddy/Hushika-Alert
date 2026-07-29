import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { HazardRecord } from '../types';

interface HazardMapProps {
  records: HazardRecord[];
  language: 'english' | 'kiswahili';
}

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

const createCustomIcon = (severityColor: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${severityColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};

export function HazardMap({ records, language }: HazardMapProps) {
  const isKiswahili = language === 'kiswahili';

  const bounds = React.useMemo(() => {
    if (records.length === 0) return null;
    const lats = records.map(r => r.lat);
    const lngs = records.map(r => r.lng);
    return L.latLngBounds(
      L.latLng(Math.min(...lats), Math.min(...lngs)),
      L.latLng(Math.max(...lats), Math.max(...lngs))
    );
  }, [records]);

  // Center over Asia by default if no records
  const defaultCenter: L.LatLngTuple = [25.0, 90.0];
  const defaultZoom = 3;

  return (
    <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden border border-white/10 mb-8 z-0 relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%', background: '#0B2430' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {bounds && <ChangeView bounds={bounds} />}
        {records.map((record) => {
          let severityColor = '#3b82f6'; // default blue (watch)
          if (record.triggerStatus === 'exceeded' && (record.trend === 'rising' || record.trend === 'declining')) {
            severityColor = '#ef4444'; // red (severe)
          } else if (record.triggerStatus === 'exceeded' || record.triggerStatus === 'at_threshold') {
            severityColor = '#E8A33D'; // amber (moderate)
          }

          return (
            <Marker 
              key={record.id} 
              position={[record.lat, record.lng]} 
              icon={createCustomIcon(severityColor)}
            >
              <Popup className="hazard-popup">
                <div className="text-[#0B2430] font-sans">
                  <h4 className="font-bold text-sm mb-1">{record.region}</h4>
                  <p className="text-xs text-gray-600 mb-2">{record.country}</p>
                  <p className="text-xs font-semibold">{record.indicatorName}</p>
                  <p className="text-xs">{record.value} {record.unit} ({record.trend})</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Add a tiny style block to ensure leaflet z-index doesn't overlap our sticky header */}
      <style>{`
        .leaflet-container {
          z-index: 1;
        }
        .hazard-popup .leaflet-popup-content-wrapper {
          background-color: #F3EFE4;
          border-radius: 8px;
          padding: 4px;
        }
        .hazard-popup .leaflet-popup-tip {
          background-color: #F3EFE4;
        }
      `}</style>
    </div>
  );
}

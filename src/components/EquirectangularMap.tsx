import React from 'react';

interface EquirectangularMapProps {
  origin: string;
  destination: string;
  width?: number;
  height?: number;
}

// Small city coords map — extendable
const CITY_COORDS: Record<string, [number, number]> = {
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'London': [51.5074, -0.1278],
  'Paris': [48.8566, 2.3522],
  'Berlin': [52.5200, 13.4050],
  'Tokyo': [35.6895, 139.6917],
};

function findCoords(name: string): [number, number] | null {
  const key = Object.keys(CITY_COORDS).find(k => name.includes(k));
  return key ? CITY_COORDS[key] : null;
}

function project(lat: number, lon: number, width: number, height: number) {
  // Equirectangular projection
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

const EquirectangularMap: React.FC<EquirectangularMapProps> = ({ origin, destination, width = 640, height = 360 }) => {
  const originCoords = findCoords(origin) || [0, 0];
  const destCoords = findCoords(destination) || [0, 0];

  const originProject = project(originCoords[0], originCoords[1], width, height);
  const destProject = project(destCoords[0], destCoords[1], width, height);

  const failed = originCoords[0] === 0 && originCoords[1] === 0 || destCoords[0] === 0 && destCoords[1] === 0;

  if (failed) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground p-4">
        <div className="text-center text-sm">Localização não encontrada para {/* can show origin/dest */} {origin} → {destination}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden rounded bg-[#0f1720]">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
        {/* Background sea */}
        <rect width={width} height={height} rx={6} fill="#0b1220" />

        {/* Draw route line */}
        <line x1={originProject[0]} y1={originProject[1]} x2={destProject[0]} y2={destProject[1]} stroke="#60a5fa" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 6" />

        {/* Draw origin marker */}
        <g transform={`translate(${originProject[0]}, ${originProject[1]})`}>
          <circle r={5} fill="#f97316" />
          <text x={8} y={4} fontSize={10} fill="#94a3b8">{origin}</text>
        </g>

        {/* Draw destination marker */}
        <g transform={`translate(${destProject[0]}, ${destProject[1]})`}>
          <circle r={5} fill="#fb7185" />
          <text x={8} y={4} fontSize={10} fill="#94a3b8">{destination}</text>
        </g>
      </svg>
    </div>
  );
};

export default EquirectangularMap;

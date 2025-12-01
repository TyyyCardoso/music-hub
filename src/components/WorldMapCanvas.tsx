import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoMercator, geoPath } from 'd3-geo';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export interface MarkerItem {
  coordinates: [number, number]; // [lon, lat]
  label?: string;
  color?: string;
}

export interface RouteItem {
  from: [number, number];
  to: [number, number];
  color?: string;
}

interface Props {
  markers?: MarkerItem[];
  routes?: RouteItem[];
  onCountryClick?: (geo: any) => void;
  projectionConfig?: any;
  width?: number;
  height?: number;
  interactive?: boolean; // optionally disable country interactions
  focusRoute?: { from: [number, number]; to: [number, number]; zoom?: number } | null;
}

const WorldMapCanvas: React.FC<Props> = ({ markers = [], routes = [], onCountryClick, projectionConfig = { scale: 130, center: [0, 20] }, width = 800, height = 600, interactive = true, focusRoute = null }) => {
  // Create GeoJSON line features for each route
  const lines = routes.map((r, i) => ({
    type: 'Feature',
    properties: { id: `route-${i}`, color: r.color },
    geometry: { type: 'LineString', coordinates: [r.from, r.to] },
  }));

  // Create a projection that matches the ComposableMap options
  const projection = geoMercator()
    .scale((projectionConfig && projectionConfig.scale) || 130)
    .center((projectionConfig && projectionConfig.center) || [0, 20])
    .translate([width / 2, height / 2]);

  const pathGenerator = geoPath().projection(projection);

  // compute zoom and center for zoomable group based on focusRoute
  let zoom = 1;
  let zoomCenter = (projectionConfig && projectionConfig.center) || [0, 20];
  if (focusRoute) {
    const from = focusRoute.from;
    const to = focusRoute.to;
    // center is midpoint (lon, lat)
    const centerLon = (from[0] + to[0]) / 2;
    const centerLat = (from[1] + to[1]) / 2;
    zoomCenter = [centerLon, centerLat];
    // set zoom heuristically depending on degree spread
    const lonDiff = Math.abs(from[0] - to[0]);
    const latDiff = Math.abs(from[1] - to[1]);
    const maxDiff = Math.max(lonDiff, latDiff);
    if (focusRoute.zoom) zoom = focusRoute.zoom;
    else if (maxDiff < 2) zoom = 3;
    else if (maxDiff < 10) zoom = 2;
    else if (maxDiff < 40) zoom = 1.6;
    else zoom = 1.1;
  }

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={projectionConfig}
      style={{ width: '100%', height: 'auto' }}
      width={width}
      height={height}
    >
      <ZoomableGroup center={zoomCenter as any} zoom={zoom} maxZoom={3} minZoom={1}>
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => interactive && onCountryClick && onCountryClick(geo)}
                  style={{
                    default: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--background))', strokeWidth: 0.5, cursor: interactive ? 'pointer' : 'default' },
                    hover: interactive ? { fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))' } : { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--background))' },
                    pressed: { fill: 'hsl(var(--primary))' },
                  }}
                />
              ))}

              {/* Draw route lines as two Geography components to create a glow + main line */}
              {/* Render routes as SVG paths using a projection-aligned generator (more reliable) */}
              {lines.map((line, i) => {
                const d = pathGenerator(line as any);
                const color = line.properties.color || '#60a5fa';
                return (
                  <g key={line.properties.id}>
                    <path d={d || ''} fill="none" stroke={color} strokeWidth={12} strokeOpacity={0.12} strokeLinecap="round" />
                    <path d={d || ''} fill="none" stroke={color} strokeWidth={4} strokeOpacity={0.98} strokeLinecap="round" />
                  </g>
                );
              })}

              {/* Draw markers */}
              {/* Render markers as circles using the same projection for accurate placement */}
              {markers.map((m, i) => {
                const projected = projection(m.coordinates as any) || [0, 0];
                const [x, y] = projected;
                return (
                  <g key={`marker-${i}`} transform={`translate(${x}, ${y})`}>
                    <circle r={6} fill={m.color || '#ff6347'} stroke="#fff" strokeWidth={1} />
                    {m.label && <text x={10} y={4} fontSize={10} fill="#94a3b8">{m.label}</text>}
                  </g>
                );
              })}

              {/* Draw small arrow at each route destination */}
              {routes.map((r, i) => {
                const fromProjected = projection(r.from as any) || [0, 0];
                const destProjected = projection(r.to as any) || [0, 0];
                const [fx, fy] = fromProjected;
                const [dx, dy] = destProjected;
                const angleRad = Math.atan2(dy - fy, dx - fx);
                const angleDeg = (angleRad * 180) / Math.PI;
                // Place the arrow at the midpoint between the origin and destination
                const mx = (fx + dx) / 2;
                const my = (fy + dy) / 2;
                return (
                  <g
                    key={`route-dest-${i}`}
                    transform={`translate(${mx}, ${my}) rotate(${angleDeg}) translate(-6, -6)`}
                  >
                    <path d="M0 0 L8 4 L0 8 Z" fill={r.color || '#60a5fa'} opacity={0.95} />
                  </g>
                );
              })}
            </>
          )}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default WorldMapCanvas;

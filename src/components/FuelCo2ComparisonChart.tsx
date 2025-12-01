import React from 'react';

interface ComparisonProps {
  previous: { fuel: number; co2: number };
  current: { fuel: number; co2: number };
  previousLabel?: string;
  currentLabel?: string;
}

const FuelCo2ComparisonChart: React.FC<ComparisonProps> = ({ previous, current, previousLabel = 'Last trip', currentLabel = 'This trip' }) => {
  const fuelMax = Math.max(previous.fuel, current.fuel, 1);
  const co2Max = Math.max(previous.co2, current.co2, 1);

  const chartHeight = 120;
  const barWidth = 28;
  const gap = 10;
  const leftGroupX = 15;
  const rightGroupX = leftGroupX + barWidth * 2 + gap + 40;

  const fuelPrevHeight = Math.round((previous.fuel / fuelMax) * chartHeight);
  const fuelCurrHeight = Math.round((current.fuel / fuelMax) * chartHeight);
  const co2PrevHeight = Math.round((previous.co2 / co2Max) * chartHeight);
  const co2CurrHeight = Math.round((current.co2 / co2Max) * chartHeight);

  const fuelDelta = current.fuel - previous.fuel;
  const co2Delta = current.co2 - previous.co2;

  return (
    <div className="w-full">
      <svg width="100%" height={chartHeight + 60} viewBox={`0 0 ${rightGroupX + barWidth + 40} ${chartHeight + 60}`}>
        {/* Fuel group label */}
        <text x={leftGroupX} y={chartHeight + 22} fill="#94a3b8" fontSize={11}>Fuel (gal)</text>
        <rect x={leftGroupX} y={chartHeight - fuelPrevHeight + 8} width={barWidth} height={fuelPrevHeight} fill="#f97316" rx={6} />
        <text x={leftGroupX} y={chartHeight - fuelPrevHeight - 2} fill="#f97316" fontSize={11} fontWeight={600}>{previous.fuel.toLocaleString()}</text>
        <rect x={leftGroupX + barWidth + gap} y={chartHeight - fuelCurrHeight + 8} width={barWidth} height={fuelCurrHeight} fill="#fb923c" rx={6} />
        <text x={leftGroupX + barWidth + gap} y={chartHeight - fuelCurrHeight - 2} fill="#fb923c" fontSize={11} fontWeight={600}>{current.fuel.toLocaleString()}</text>
        <text x={leftGroupX} y={chartHeight + 40} fill="#64748b" fontSize={10}>{previousLabel}</text>
        <text x={leftGroupX + barWidth + gap} y={chartHeight + 40} fill="#64748b" fontSize={10}>{currentLabel}</text>

        {/* CO2 group label */}
        <text x={rightGroupX} y={chartHeight + 22} fill="#94a3b8" fontSize={11}>CO₂ (tons)</text>
        <rect x={rightGroupX} y={chartHeight - co2PrevHeight + 8} width={barWidth} height={co2PrevHeight} fill="#ef4444" rx={6} />
        <text x={rightGroupX} y={chartHeight - co2PrevHeight - 2} fill="#ef4444" fontSize={11} fontWeight={600}>{previous.co2.toLocaleString()}</text>
        <rect x={rightGroupX + barWidth + gap} y={chartHeight - co2CurrHeight + 8} width={barWidth} height={co2CurrHeight} fill="#f87171" rx={6} />
        <text x={rightGroupX + barWidth + gap} y={chartHeight - co2CurrHeight - 2} fill="#f87171" fontSize={11} fontWeight={600}>{current.co2.toLocaleString()}</text>
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-semibold">Δ {fuelDelta.toLocaleString()}</span>
          <span className="text-muted-foreground">{previous.fuel ? `(${((fuelDelta / previous.fuel) * 100).toFixed(1)}%)` : '(N/A)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-semibold">Δ {co2Delta.toLocaleString()}</span>
          <span className="text-muted-foreground">{previous.co2 ? `(${((co2Delta / previous.co2) * 100).toFixed(1)}%)` : '(N/A)'}</span>
        </div>
      </div>
    </div>
  );
};

export default FuelCo2ComparisonChart;

'use client';

import { useState, useMemo } from 'react';

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';
const NAVY = '#1a1f2e';
const PINK = '#c2185b';
const GREEN = '#2e7d32';
const CREAM = '#fdebef';

/**
 * Drag the sliders for CO₂ and temperature.
 * Watch the rate-vs-light-intensity curve plateau move up or down.
 * This is the single most important graph in NSSCO photosynthesis — and the
 * lesson learner sees it change in real time as they change the limiting factor.
 */
export default function LimitingFactorExplorer() {
  const [co2, setCo2] = useState(0.04);     // % (0.04 = atmospheric, 0.1 = enriched)
  const [temp, setTemp] = useState(25);     // °C

  // Compute the plateau height of the curve based on CO2 and temp.
  // Photosynthesis rate = min(light-limited, CO2-limited, enzyme-limited)
  // Simplified for visual: peak rate is a function of CO2 (linear up to ~0.1%)
  // and a bell curve in temperature (optimum 30°C, drops above 40°C).
  const plateau = useMemo(() => {
    const co2Factor = Math.min(co2 / 0.1, 1);  // 0..1
    // Bell curve around 30°C, denatures above 40°C
    const tempFactor = temp < 5 ? 0
      : temp > 50 ? 0
      : temp < 30 ? (temp - 5) / 25
      : temp < 40 ? 1 - (temp - 30) * 0.02
      : Math.max(0, 1 - (temp - 30) * 0.1);
    return Math.max(0.05, co2Factor * tempFactor);  // 0..1
  }, [co2, temp]);

  // Build the SVG path for the curve. X axis is light intensity 0..1.
  // Curve rises linearly until light-limited, then plateaus at `plateau`.
  const knee = Math.max(0.1, plateau * 0.9);  // light intensity where it plateaus
  const W = 360, H = 220;
  const padL = 50, padR = 20, padT = 20, padB = 50;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (t) => padL + t * innerW;
  const y = (v) => padT + (1 - v) * innerH;
  const path = `M ${x(0)} ${y(0)} L ${x(knee)} ${y(plateau)} L ${x(1)} ${y(plateau)}`;

  // Reference curve at default conditions (faint)
  const refPlateau = 0.4;
  const refKnee = 0.36;
  const refPath = `M ${x(0)} ${y(0)} L ${x(refKnee)} ${y(refPlateau)} L ${x(1)} ${y(refPlateau)}`;

  const plateauPct = Math.round(plateau * 100);

  return (
    <div className="my-6 p-4" style={{
      backgroundColor: '#fff',
      border: '1px solid rgba(26,31,46,0.2)',
    }}>
      <div className="text-[10px] uppercase mb-3 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.28em', color: PINK }}>
        Try it — drag the sliders
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          <div className="text-[11px] uppercase mb-1" style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
            CO₂ concentration: <strong style={{ color: PINK }}>{(co2 * 100).toFixed(2)} %</strong>
          </div>
          <input type="range" min="0.01" max="0.15" step="0.005" value={co2}
            onChange={(e) => setCo2(Number(e.target.value))}
            style={{ width: '100%', accentColor: PINK }} />
          <div className="text-[9px] opacity-50" style={{ fontFamily: mono }}>
            atmosphere = 0.04 % · greenhouse = 0.10 %
          </div>
        </label>
        <label>
          <div className="text-[11px] uppercase mb-1" style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
            Temperature: <strong style={{ color: PINK }}>{temp} °C</strong>
          </div>
          <input type="range" min="5" max="50" step="1" value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            style={{ width: '100%', accentColor: PINK }} />
          <div className="text-[9px] opacity-50" style={{ fontFamily: mono }}>
            cold &lt; 15 · optimum ~ 30 · denatured &gt; 40
          </div>
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={NAVY} strokeWidth="1.5" />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={NAVY} strokeWidth="1.5" />
        <polygon points={`${padL},${padT - 5} ${padL - 4},${padT + 3} ${padL + 4},${padT + 3}`} fill={NAVY} />
        <polygon points={`${W - padR + 5},${H - padB} ${W - padR - 3},${H - padB - 4} ${W - padR - 3},${H - padB + 4}`} fill={NAVY} />

        {/* Reference (faint) */}
        <path d={refPath} stroke={NAVY} strokeWidth="1.2" strokeDasharray="3,4" fill="none" opacity="0.35" />
        <text x={W - padR - 10} y={y(refPlateau) + 12} fontFamily={mono} fontSize="8"
          fill={NAVY} textAnchor="end" opacity="0.55">at standard conditions</text>

        {/* Active curve */}
        <path d={path} stroke={GREEN} strokeWidth="3" fill="none" strokeLinejoin="round" />

        {/* Plateau marker */}
        <line x1={padL} y1={y(plateau)} x2={x(knee)} y2={y(plateau)} stroke={GREEN} strokeWidth="0.6" strokeDasharray="2,3" opacity="0.5" />
        <text x={padL - 6} y={y(plateau) + 3} fontFamily={mono} fontSize="9"
          fill={GREEN} textAnchor="end" fontWeight="600">{plateauPct}%</text>

        {/* Labels */}
        <text x={padL + innerW / 2} y={H - 10} fontFamily={mono} fontSize="10"
          textAnchor="middle" fill={NAVY}>light intensity →</text>
        <text x={15} y={padT + innerH / 2} fontFamily={mono} fontSize="10"
          textAnchor="middle" fill={NAVY}
          transform={`rotate(-90 15 ${padT + innerH / 2})`}>rate of photosynthesis →</text>

        {/* Title */}
        <text x={padL + 8} y={padT + 12} fontFamily={serif} fontStyle="italic" fontSize="11" fill={PINK}>
          peak rate: {plateauPct}% of maximum
        </text>
      </svg>

      <div className="mt-3 text-[11px] leading-snug" style={{ fontFamily: serif }}>
        {plateau > 0.7 ? (
          <span>The line plateaus <strong>high</strong> — your conditions aren''t holding photosynthesis back much. Light is now the limit.</span>
        ) : plateau > 0.3 ? (
          <span>The plateau dropped. <strong>{co2 < 0.04 ? 'CO₂' : 'temperature'}</strong> is now limiting the rate even when light is bright.</span>
        ) : (
          <span>Plateau is very low. <strong>{temp < 15 ? 'Cold temperature' : temp > 40 ? 'Heat is denaturing enzymes' : 'Very low CO₂'}</strong> is the bottleneck — extra light won''t help.</span>
        )}
      </div>
    </div>
  );
}

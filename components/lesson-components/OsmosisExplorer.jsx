'use client';

import { useState, useMemo } from 'react';

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';
const NAVY = '#1a1f2e';
const PINK = '#c2185b';
const GREEN = '#2e7d32';

/**
 * Drag the slider for the external solution concentration.
 * Watch the plant cell visibly swell, stay normal, or shrink and plasmolyse.
 * This makes hypotonic / isotonic / hypertonic feel obvious without three pages of words.
 */
export default function OsmosisExplorer() {
  const [solute, setSolute] = useState(0.5);  // 0 = pure water, 1 = very concentrated sugar

  // Cell volume responds to outside solute concentration.
  // Inside cell sap has solute ~0.5. Water moves from low solute to high solute.
  const inside = 0.5;
  const diff = solute - inside;  // positive → water leaves cell → shrinks
  const cellShrink = Math.max(-0.35, Math.min(0.2, diff * 0.7));
  const scale = 1 - cellShrink;  // <1 shrinks, >1 swells

  const state = useMemo(() => {
    if (solute < 0.35) return { name: 'Hypotonic (pure-ish water outside)', color: GREEN, msg: 'Water moves INTO the cell. The cell pushes against the wall — it is **turgid** (firm). This is how plants stay upright.' };
    if (solute > 0.65) return { name: 'Hypertonic (concentrated solution outside)', color: PINK, msg: 'Water moves OUT of the cell. The cytoplasm pulls away from the wall — this is called **plasmolysis**. The plant wilts.' };
    return { name: 'Isotonic (same as cell sap)', color: NAVY, msg: 'No NET movement of water. The cell stays its normal size — **flaccid** (not firm, not shrunken).' };
  }, [solute]);

  // Visual: outer box = cell wall, inner shape = cell membrane + cytoplasm
  const baseW = 120, baseH = 130;
  const innerW = baseW * scale;
  const innerH = baseH * scale;
  const cx = 130;
  const cy = 90;

  return (
    <div className="my-6 p-4" style={{
      backgroundColor: '#fff',
      border: '1px solid rgba(26,31,46,0.2)',
    }}>
      <div className="text-[10px] uppercase mb-3 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.28em', color: PINK }}>
        Try it — drag to change the solution outside the cell
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'center' }}>
        {/* Cell visual */}
        <svg viewBox="0 0 260 190" style={{ width: '100%', height: 'auto' }}>
          {/* Outside solution */}
          <rect x="0" y="0" width="260" height="190"
            fill={solute > 0.65 ? '#fdebef' : solute < 0.35 ? '#e3f2fd' : '#f5f5f5'}
            opacity="0.5" />
          {/* Cell wall (rigid box) */}
          <rect x={cx - baseW / 2} y={cy - baseH / 2} width={baseW} height={baseH}
            fill="none" stroke={GREEN} strokeWidth="3.5" />
          {/* Cell membrane + cytoplasm (shrinks/swells) */}
          <rect x={cx - innerW / 2} y={cy - innerH / 2} width={innerW} height={innerH}
            fill="#d0e5d8" stroke={NAVY} strokeWidth="1.2"
            style={{ transition: 'all 0.3s ease-out' }} />
          {/* Vacuole */}
          <rect x={cx - innerW / 2 + 10} y={cy - innerH / 2 + 10}
            width={Math.max(0, innerW - 20)} height={Math.max(0, innerH - 20)}
            fill="#c2185b" opacity="0.15" stroke={PINK} strokeWidth="0.8"
            style={{ transition: 'all 0.3s ease-out' }} />
          {/* Labels */}
          <text x={cx} y="20" fontFamily={mono} fontSize="9" textAnchor="middle" fill={GREEN}>cell wall</text>
          <text x={cx} y={cy + 5} fontFamily={mono} fontSize="9" textAnchor="middle" fill={NAVY}>cell</text>
          {solute > 0.65 && (
            <>
              <line x1={cx - baseW / 2 - 5} y1={cy} x2={cx - innerW / 2 - 2} y2={cy} stroke={PINK} strokeWidth="1" />
              <text x={cx - baseW / 2 - 8} y={cy + 3} fontFamily={mono} fontSize="8" textAnchor="end" fill={PINK}>gap</text>
            </>
          )}
        </svg>

        {/* Controls + readout */}
        <div>
          <label>
            <div className="text-[11px] uppercase mb-1" style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              Outside solute: <strong style={{ color: state.color }}>{(solute * 100).toFixed(0)} %</strong>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={solute}
              onChange={(e) => setSolute(Number(e.target.value))}
              style={{ width: '100%', accentColor: state.color }} />
            <div className="flex justify-between text-[9px] opacity-55 mt-0.5" style={{ fontFamily: mono }}>
              <span>pure water</span>
              <span>same as inside</span>
              <span>concentrated</span>
            </div>
          </label>

          <div className="mt-4 p-3" style={{ borderLeft: `3px solid ${state.color}`, backgroundColor: `${state.color}10` }}>
            <div className="text-[11px] uppercase mb-1"
              style={{ fontFamily: mono, letterSpacing: '0.22em', color: state.color, fontWeight: 600 }}>
              {state.name}
            </div>
            <div className="text-[12px] leading-snug" style={{ fontFamily: serif }}
              dangerouslySetInnerHTML={{
                __html: state.msg.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              }} />
          </div>
        </div>
      </div>
    </div>
  );
}

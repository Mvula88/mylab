"""Convert SVG → PNG using resvg-py (Rust, prebuilt Windows wheel — no C deps)."""
import sys
from pathlib import Path
from resvg_py import svg_to_bytes

svg_path = Path(sys.argv[1])
png_path = Path(sys.argv[2])
dpi = int(sys.argv[3]) if len(sys.argv) > 3 else 200

svg_string = svg_path.read_text(encoding="utf-8")
png_bytes = svg_to_bytes(svg_string=svg_string, dpi=dpi)
png_path.write_bytes(bytes(png_bytes))
print(f"Converted {svg_path.name} -> {png_path.name} at {dpi} DPI ({len(png_bytes)} bytes)")

"""Try PyMuPDF's SVG export — bypasses rasterization."""
import sys
import fitz
from pathlib import Path

pdf_path = Path(sys.argv[1])
page_no = int(sys.argv[2])
out_dir = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("past-papers/test")
out_dir.mkdir(parents=True, exist_ok=True)

doc = fitz.open(pdf_path)
page = doc[page_no - 1]

# Option A: SVG export
svg = page.get_svg_image(matrix=fitz.Identity, text_as_path=False)
svg_path = out_dir / f"page-{page_no:02d}.svg"
svg_path.write_text(svg, encoding="utf-8")
print(f"SVG exported: {svg_path} ({len(svg)} chars)")

# Look at the SVG content briefly
print(f"\nFirst 800 chars of SVG:")
print(svg[:800])
print(f"\n...contains 'opacity':", "opacity" in svg.lower())
print(f"...contains '<path':", "<path" in svg)
print(f"...contains '<text':", "<text" in svg)
print(f"...contains 'fill=\"white\"':", 'fill="white"' in svg)
print(f"...contains 'fill=\"#fff':", 'fill="#fff' in svg)

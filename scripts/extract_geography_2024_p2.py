"""Extract diagram crops from NSSCO Geography 2024 Paper 2 (6137/2)
plus the 1:50 000 Lüderitz map insert.

Diagrams (from 6137_2.pdf):
  Q2  page 4    Photograph A   waterfall + valley
  Q2  page 5    Fig. 1         longitudinal profile sketch
  Q3  page 6    Fig. 2         Jornada climate graph
  Q4  page 8    Table 1 + Fig. 3 (coal/oil reserves + pie charts)
  Q5  page 10   Fig. 4         Namibia tourism map
  Q5  page 11   Fig. 5         tourist numbers bar chart skeleton
  Q6  page 13   Fig. 6         rural area diagram
  Q6  page 14   Photograph B   Windhoek CBD
  Q7  page 15   Fig. 7         world population graph
  Q7  page 16   Fig. 8         four population pyramids

Map (from Luderitz_map_2024.pdf): rendered as full-page crop at high DPI
  Q1  full page Lüderitz 1:50 000 map extract

Run once after PDFs are placed at:
  past-papers/nssco-geography/2024/6137_2.pdf
  past-papers/nssco-geography/2024/Luderitz_map_2024.pdf
"""

from __future__ import annotations
from pathlib import Path

import fitz
from PIL import Image, ImageChops

DIAGRAMS_P2 = [
    {"key": "q2-waterfall",     "page":  4, "y_top": 0.08, "y_bot": 0.46},
    {"key": "q2-long-profile",  "page":  5, "y_top": 0.10, "y_bot": 0.40},
    {"key": "q3-climate-graph", "page":  6, "y_top": 0.06, "y_bot": 0.46},
    {"key": "q4-reserves",      "page":  8, "y_top": 0.06, "y_bot": 0.72},
    {"key": "q5-tourism-map",   "page": 10, "y_top": 0.06, "y_bot": 0.56},
    {"key": "q5-tourist-bar",   "page": 11, "y_top": 0.06, "y_bot": 0.74},
    {"key": "q6-rural-area",    "page": 13, "y_top": 0.06, "y_bot": 0.56},
    {"key": "q6-windhoek",      "page": 14, "y_top": 0.06, "y_bot": 0.56},
    {"key": "q7-population",    "page": 15, "y_top": 0.06, "y_bot": 0.42},
    {"key": "q7-pyramids",      "page": 16, "y_top": 0.06, "y_bot": 0.54},
]

RIGHT_MARGIN_FRACTION = 0.12  # Cambridge-style examiner column
DPI = 220
MAP_DPI = 260  # higher for the 1:50k map to preserve detail

PROJECT_ROOT = Path(__file__).resolve().parent.parent
P2_PDF = PROJECT_ROOT / "past-papers" / "nssco-geography" / "2024" / "6137_2.pdf"
MAP_PDF = PROJECT_ROOT / "past-papers" / "nssco-geography" / "2024" / "Luderitz_map_2024.pdf"
OUT_DIR = PROJECT_ROOT / "public" / "past-papers" / "geography-nssco-2024-p2"


def tighten_to_content(img: Image.Image, bg: int = 245, pad: int = 12) -> Image.Image:
    gray = img.convert("L")
    inv = ImageChops.invert(gray.point(lambda v: 0 if v >= bg else 255))
    bbox = inv.getbbox()
    if not bbox:
        return img
    L, T, R, B = bbox
    W, H = img.size
    return img.crop((max(0, L - pad), max(0, T - pad), min(W, R + pad), min(H, B + pad)))


def render_page(pdf_path: Path, page_no: int, dpi: int = DPI) -> Image.Image:
    doc = fitz.open(str(pdf_path))
    page = doc[page_no - 1]
    pix = page.get_pixmap(matrix=fitz.Matrix(dpi / 72.0, dpi / 72.0), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def main() -> None:
    if not P2_PDF.exists():
        raise SystemExit(f"PDF not found: {P2_PDF}")
    if not MAP_PDF.exists():
        raise SystemExit(f"Map PDF not found: {MAP_PDF}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Question diagrams from the paper itself ──
    for cfg in DIAGRAMS_P2:
        img = render_page(P2_PDF, cfg["page"], DPI)
        W, H = img.size
        y0 = int(H * cfg["y_top"])
        y1 = int(H * cfg["y_bot"])
        x1 = int(W * (1.0 - RIGHT_MARGIN_FRACTION))
        crop = img.crop((0, y0, x1, y1))
        crop = tighten_to_content(crop, bg=245, pad=16)
        out = OUT_DIR / f"{cfg['key']}.png"
        crop.save(out, optimize=True)
        print(f"  {cfg['key']:24s} -> {out.name}  {crop.size}")

    # ── Lüderitz 1:50 000 map (full-page render, single image) ──
    map_img = render_page(MAP_PDF, 1, MAP_DPI)
    # Crop just the map area: trim the wide legend/title borders
    W, H = map_img.size
    # The map extract on this DNEA sheet sits roughly in the central top 2/3
    map_crop = map_img.crop((int(W * 0.04), int(H * 0.06), int(W * 0.96), int(H * 0.76)))
    out = OUT_DIR / "q1-luderitz-map.png"
    map_crop.save(out, optimize=True)
    print(f"  {'q1-luderitz-map':24s} -> {out.name}  {map_crop.size}")

    print(f"\nDone. {len(DIAGRAMS_P2)+1} diagrams written to {OUT_DIR}")


if __name__ == "__main__":
    main()

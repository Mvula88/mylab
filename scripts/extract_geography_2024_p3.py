"""Extract diagram crops from NSSCO Geography 2024 Paper 3 (6137/3).

The Paper 3 PDF uses an NIED watermark layer that makes direct PyMuPDF
rasterization come out blank. We render via SVG → resvg-py with a zoom
factor for high-resolution output.

Six figures across the fieldwork paper:
  Q1(c)(i)   Fig. 1   beach profile with tide marks            page 3
  Q1(d)(i)   Fig. 2   textbook beach profile (typical)         page 4
  Q1(d)(ii)  Fig. 3   pebble size scatter graph                page 5
  Q2(c)(i)   Fig. 4   recording sheet template + Table 2       page 8
  Q2(d)      Fig. 5   pedestrian count map with isolines       page 9
  Q2(e)(iv)  Fig. 6   CBD building heights map                 page 11
"""

from __future__ import annotations
from io import BytesIO
from pathlib import Path

import fitz
from resvg_py import svg_to_bytes
from PIL import Image, ImageChops

DIAGRAMS = [
    {"key": "q1c-beach-profile",    "page":  3, "y_top": 0.30, "y_bot": 0.72},
    {"key": "q1d-textbook-profile", "page":  4, "y_top": 0.18, "y_bot": 0.54},
    {"key": "q1d-pebble-scatter",   "page":  5, "y_top": 0.04, "y_bot": 0.38},
    {"key": "q2c-recording-sheet",  "page":  8, "y_top": 0.10, "y_bot": 0.62},
    {"key": "q2d-pedestrian-map",   "page":  9, "y_top": 0.06, "y_bot": 0.58},
    {"key": "q2e-cbd-storeys",      "page": 11, "y_top": 0.22, "y_bot": 0.90},
]

RIGHT_MARGIN_FRACTION = 0.12
ZOOM = 4  # resvg zoom factor — 595×842 base × 4 → 2380×3368 pixels
MAX_WIDTH = 1600  # cap output width

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = PROJECT_ROOT / "past-papers" / "nssco-geography" / "2024" / "6137_3.pdf"
OUT_DIR = PROJECT_ROOT / "public" / "past-papers" / "geography-nssco-2024-p3"


def tighten_to_content(img: Image.Image, bg: int = 245, pad: int = 12) -> Image.Image:
    gray = img.convert("L")
    inv = ImageChops.invert(gray.point(lambda v: 0 if v >= bg else 255))
    bbox = inv.getbbox()
    if not bbox:
        return img
    L, T, R, B = bbox
    W, H = img.size
    return img.crop((max(0, L - pad), max(0, T - pad), min(W, R + pad), min(H, B + pad)))


def render_page_svg(doc, page_no: int, zoom: float) -> Image.Image:
    """Render a PDF page via SVG → resvg-py at the given zoom."""
    page = doc[page_no - 1]
    svg = page.get_svg_image(matrix=fitz.Identity)
    png_bytes = svg_to_bytes(svg_string=svg, zoom=zoom, background="#FFFFFF")
    img = Image.open(BytesIO(bytes(png_bytes))).convert("RGB")
    # If the SVG embeds a dark watermark layer (NIED PDFs do this), the output
    # comes out inverted. Detect by checking the mean pixel intensity — if dark,
    # invert it to get black text on white background.
    import numpy as np
    if np.array(img.convert("L")).mean() < 128:
        img = ImageChops.invert(img)
    return img


def main() -> None:
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(PDF_PATH))

    for cfg in DIAGRAMS:
        img = render_page_svg(doc, cfg["page"], ZOOM)
        W, H = img.size
        y0 = int(H * cfg["y_top"])
        y1 = int(H * cfg["y_bot"])
        x1 = int(W * (1.0 - RIGHT_MARGIN_FRACTION))
        crop = img.crop((0, y0, x1, y1))
        crop = tighten_to_content(crop, bg=245, pad=16)
        # Cap output width for browser display
        if crop.width > MAX_WIDTH:
            ratio = MAX_WIDTH / crop.width
            crop = crop.resize((MAX_WIDTH, int(crop.height * ratio)), Image.LANCZOS)

        out = OUT_DIR / f"{cfg['key']}.png"
        crop.save(out, optimize=True)
        print(f"  {cfg['key']:24s} -> {out.name}  {crop.size}")

    print(f"\nDone. {len(DIAGRAMS)} diagrams written to {OUT_DIR}")


if __name__ == "__main__":
    main()

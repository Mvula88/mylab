"""Extract diagram crops from NSSCO Biology 2020 Paper 2 PDF.

For each of the 9 figures in the paper, render the relevant page at high DPI,
crop to a known Y-range, trim the right-margin examiner column, and tighten the
X bounding box to actual content. Saves as PNGs under public/past-papers/.

Run once after the PDF has been placed at:
  past-papers/nssco-biology/2020/6116_2.pdf
"""

from __future__ import annotations
import os
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image, ImageChops

# Per-diagram crop config:
#   key       = output filename stem
#   page      = 1-indexed PDF page
#   y_top, y_bot = vertical crop as fraction of page height (0..1)
# These were tuned by inspecting the 2020 Paper 2 layout.
DIAGRAMS = [
    {"key": "q1-rhino",        "page":  2, "y_top": 0.18, "y_bot": 0.50},
    {"key": "q2a-vertebrates", "page":  4, "y_top": 0.10, "y_bot": 0.60},
    {"key": "q2b-virus",       "page":  5, "y_top": 0.08, "y_bot": 0.42},
    {"key": "q3-root",         "page":  6, "y_top": 0.08, "y_bot": 0.32},
    {"key": "q4a-repro",       "page":  7, "y_top": 0.08, "y_bot": 0.45},
    {"key": "q4b-hormones",    "page":  8, "y_top": 0.10, "y_bot": 0.42},
    {"key": "q5-dialysis",     "page": 11, "y_top": 0.10, "y_bot": 0.62},
    {"key": "q6-feedback",     "page": 13, "y_top": 0.22, "y_bot": 0.62},
    {"key": "q7-carbon-cycle", "page": 15, "y_top": 0.04, "y_bot": 0.55},
    {"key": "q9-giraffes",     "page": 18, "y_top": 0.08, "y_bot": 0.35},
]

# Cambridge papers leave a right-side examiner column ~12% wide. Crop it off.
RIGHT_MARGIN_FRACTION = 0.12

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = PROJECT_ROOT / "past-papers" / "nssco-biology" / "2020" / "6116_2.pdf"
OUT_DIR = PROJECT_ROOT / "public" / "past-papers" / "biology-nssco-2020-p2"


def tighten_to_content(img: Image.Image, bg: int = 245, pad: int = 12) -> Image.Image:
    """Trim mostly-white padding from edges, keeping a small pad."""
    gray = img.convert("L")
    # bbox of pixels darker than `bg`
    inv = ImageChops.invert(gray.point(lambda v: 0 if v >= bg else 255))
    bbox = inv.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    w, h = img.size
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(w, x1 + pad)
    y1 = min(h, y1 + pad)
    return img.crop((x0, y0, x1, y1))


def main() -> None:
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found at {PDF_PATH}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(PDF_PATH)
    print(f"Opened {PDF_PATH.name}: {doc.page_count} pages")

    for d in DIAGRAMS:
        page = doc.load_page(d["page"] - 1)
        # Render the whole page at 2x scale (≈200 DPI)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        W, H = img.size

        # Crop to configured Y-range, dropping the examiner column on the right.
        left = 0
        top = int(H * d["y_top"])
        right = int(W * (1.0 - RIGHT_MARGIN_FRACTION))
        bottom = int(H * d["y_bot"])
        crop = img.crop((left, top, right, bottom))

        # Tighten to actual content
        crop = tighten_to_content(crop, bg=245, pad=14)

        out_path = OUT_DIR / f"{d['key']}.png"
        crop.save(out_path, optimize=True)
        print(f"  {d['key']:18s} → page {d['page']:2d}  {crop.size[0]}x{crop.size[1]}  {out_path.relative_to(PROJECT_ROOT)}")

    doc.close()
    print(f"\nDone. {len(DIAGRAMS)} PNGs written to {OUT_DIR.relative_to(PROJECT_ROOT)}/")


if __name__ == "__main__":
    main()

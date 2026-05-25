"""Extract diagram crops from NSSCO Geography 2024 Paper 1 (6137/1).

Six figures across the paper, one per question's source-based (b) section:
  Q1(b)  Fig. 1   freeze-thaw weathering photograph        page  4
  Q2(b)  Photograph A   Sossusvlei dunes (aerial)          page  8
  Q3(b)  Photograph B   Walvis Bay fishing industry        page 12
  Q4(b)  Fig. 2   Namibia/Kenya wildlife numbers graph     page 16
  Q5(b)  Photograph C   urban traffic congestion           page 20
  Q6(b)  HIV/AIDS newspaper extract (boxed text)           page 23

Run once after the PDF has been placed at:
  past-papers/nssco-geography/2024/6137_1.pdf
"""

from __future__ import annotations
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image, ImageChops

DIAGRAMS = [
    {"key": "q1b-freeze-thaw",       "page":  4, "y_top": 0.10, "y_bot": 0.46},
    {"key": "q2b-sossusvlei-dunes",  "page":  8, "y_top": 0.10, "y_bot": 0.42},
    {"key": "q3b-walvis-bay",        "page": 12, "y_top": 0.08, "y_bot": 0.46},
    {"key": "q4b-wildlife-graph",    "page": 16, "y_top": 0.10, "y_bot": 0.46},
    {"key": "q5b-traffic",           "page": 20, "y_top": 0.08, "y_bot": 0.42},
    {"key": "q6b-hiv-extract",       "page": 23, "y_top": 0.08, "y_bot": 0.32},
]

RIGHT_MARGIN_FRACTION = 0.12  # Cambridge papers leave a right examiner column
DPI = 220

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = PROJECT_ROOT / "past-papers" / "nssco-geography" / "2024" / "6137_1.pdf"
OUT_DIR = PROJECT_ROOT / "public" / "past-papers" / "geography-nssco-2024-p1"


def tighten_to_content(img: Image.Image, bg: int = 245, pad: int = 12) -> Image.Image:
    gray = img.convert("L")
    inv = ImageChops.invert(gray.point(lambda v: 0 if v >= bg else 255))
    bbox = inv.getbbox()
    if not bbox:
        return img
    left, top, right, bot = bbox
    W, H = img.size
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(W, right + pad)
    bot = min(H, bot + pad)
    return img.crop((left, top, right, bot))


def main() -> None:
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(PDF_PATH))
    zoom = DPI / 72.0
    matrix = fitz.Matrix(zoom, zoom)

    for cfg in DIAGRAMS:
        page = doc[cfg["page"] - 1]
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        W, H = img.size
        y0 = int(H * cfg["y_top"])
        y1 = int(H * cfg["y_bot"])
        x1 = int(W * (1.0 - RIGHT_MARGIN_FRACTION))
        crop = img.crop((0, y0, x1, y1))

        # Trim mostly-white padding to tightly hug the diagram
        crop = tighten_to_content(crop, bg=245, pad=16)

        out = OUT_DIR / f"{cfg['key']}.png"
        crop.save(out, optimize=True)
        print(f"  {cfg['key']:30s} -> {out.name}  {crop.size}")

    print(f"\nDone. {len(DIAGRAMS)} diagrams written to {OUT_DIR}")


if __name__ == "__main__":
    main()

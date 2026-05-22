"""Quick debug: render a single page in RGB at 200 DPI and report pixel stats."""
import sys
import fitz
from pathlib import Path
from collections import Counter

pdf_path = Path(sys.argv[1])
page_no = int(sys.argv[2])
out = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("debug.png")

doc = fitz.open(pdf_path)
page = doc[page_no - 1]
mat = fitz.Matrix(200 / 72, 200 / 72)

# Render in RGB
pix = page.get_pixmap(matrix=mat, alpha=False, colorspace=fitz.csRGB)
print(f"Page {page_no}: {pix.width}x{pix.height} RGB, {len(pix.samples)} bytes")
pix.save(str(out))
print(f"Saved RGB render -> {out}")

# Histogram of pixel intensities (grayscale equivalent)
data = pix.samples
intensities = [int(0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]) for i in range(0, len(data), 3 * 100)]  # sample every 100th pixel
hist = Counter()
for v in intensities:
    bucket = (v // 16) * 16  # group into 16 buckets of 16
    hist[bucket] += 1
print("Intensity histogram (every 100th pixel):")
for bucket in sorted(hist.keys()):
    print(f"  {bucket:3d}-{bucket+15:3d}: {hist[bucket]:6d} pixels")

# Drawings on page
drawings = page.get_drawings()
print(f"\n{len(drawings)} vector drawings on page {page_no}")
for d in drawings[:5]:
    print(f"  type={d.get('type')} fill={d.get('fill')} stroke={d.get('color')} opacity={d.get('opacity')}")

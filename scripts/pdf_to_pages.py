#!/usr/bin/env python
"""
Extract a PDF into:
  - page-NN.png   (rendered via SVG → resvg-py; reliable for NIED PDFs)
  - page-NN.txt   (extracted text — for question wording)
  - text.txt      (all pages concatenated)
  - images/page-NN-img-N.{ext}  (embedded raster images, if any)

Uses PyMuPDF's SVG export + resvg-py to render, which works on NIED's
watermark-style PDFs where direct rasterization comes out blank.

Usage:
    python scripts/pdf_to_pages.py <input.pdf> <output_dir> [--dpi 200]
"""
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Install PyMuPDF first:  pip install PyMuPDF", file=sys.stderr)
    sys.exit(1)

try:
    from resvg_py import svg_to_bytes
except ImportError:
    print("Install resvg-py first:  pip install resvg-py", file=sys.stderr)
    sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    pdf_path = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    dpi = 200
    if "--dpi" in sys.argv:
        dpi = int(sys.argv[sys.argv.index("--dpi") + 1])

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)
    images_dir = out_dir / "images"
    images_dir.mkdir(exist_ok=True)

    doc = fitz.open(pdf_path)
    n = len(doc)
    print(f"Processing {n} pages from {pdf_path.name} -> {out_dir}")

    all_text = []
    for i, page in enumerate(doc):
        page_no = i + 1

        # 1. Text — extracted directly from PDF (skips rendering)
        text = page.get_text("text")
        txt_path = out_dir / f"page-{page_no:02d}.txt"
        txt_path.write_text(text, encoding="utf-8")

        # 2. Image — go via SVG (NIED PDFs render blank otherwise)
        svg = page.get_svg_image(matrix=fitz.Identity)
        png_bytes = svg_to_bytes(svg_string=svg, dpi=dpi)
        img_path = out_dir / f"page-{page_no:02d}.png"
        img_path.write_bytes(bytes(png_bytes))

        # 3. Embedded raster images (photos, scanned content)
        img_count = 0
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            try:
                base_img = doc.extract_image(xref)
                img_bytes = base_img["image"]
                ext = base_img.get("ext", "png")
                img_out = images_dir / f"page-{page_no:02d}-img-{img_index + 1}.{ext}"
                img_out.write_bytes(img_bytes)
                img_count += 1
            except Exception as e:
                print(f"  ! could not extract embedded image {img_index} on page {page_no}: {e}")

        all_text.append(f"\n\n===== PAGE {page_no} =====\n\n{text}")
        print(f"  page {page_no}/{n}: {len(text)} chars + {img_count} embedded + {len(png_bytes)//1024} KB png")

    (out_dir / "text.txt").write_text("".join(all_text), encoding="utf-8")
    doc.close()
    print(f"Done. text.txt + {n} page renders in {out_dir}")


if __name__ == "__main__":
    main()

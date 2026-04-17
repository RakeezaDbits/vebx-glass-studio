#!/usr/bin/env python3
"""
Remove light/white background connected to image edges (flood fill).
Writes transparent PNGs over public/partners/*.png — run from repo root:
  python3 scripts/remove-partner-bg.py
Requires: python3-numpy, python3-pil (apt) or pillow + numpy.
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PARTNERS = ROOT / "public" / "partners"
TOL = 44  # JPEG / near-white tolerance


def is_bg(rgb: np.ndarray, y: int, x: int) -> bool:
    r, g, b = int(rgb[y, x, 0]), int(rgb[y, x, 1]), int(rgb[y, x, 2])
    return r >= 255 - TOL and g >= 255 - TOL and b >= 255 - TOL


def flood_edge_transparent(arr: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3]
    out = arr.copy()
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if is_bg(rgb, y, x) and not visited[y, x]:
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(rgb, y, x) and not visited[y, x]:
                q.append((y, x))

    while q:
        y, x = q.popleft()
        if visited[y, x]:
            continue
        if not is_bg(rgb, y, x):
            continue
        visited[y, x] = True
        out[y, x, 3] = 0
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            ny, nx = y + dy, x + dx
            if (
                0 <= ny < h
                and 0 <= nx < w
                and not visited[ny, nx]
                and is_bg(rgb, ny, nx)
            ):
                q.append((ny, nx))

    return out


def process_file(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    if arr.shape[2] == 3:
        a = np.full((arr.shape[0], arr.shape[1], 1), 255, dtype=np.uint8)
        arr = np.concatenate([arr, a], axis=2)
    arr = flood_edge_transparent(arr.astype(np.uint8))
    Image.fromarray(arr, "RGBA").save(path, "PNG", optimize=True)
    print(f"OK {path.name}")


def main() -> int:
    if not PARTNERS.is_dir():
        print(f"Missing {PARTNERS}", file=sys.stderr)
        return 1
    files = sorted(PARTNERS.glob("*.png"))
    if not files:
        print("No PNG files in public/partners", file=sys.stderr)
        return 1
    for p in files:
        try:
            process_file(p)
        except OSError as e:
            print(f"FAIL {p.name}: {e}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""
render.py

Simple SVG circuit renderer from minimal YAML definitions.

Usage:
    python render.py path/to/circuit.yaml

Dependencies:
    - pyyaml
    - svgwrite (optional). If missing, renderer will assemble SVG strings manually.

Behavior:
    - Loads YAML with keys: components (list) and connections (list)
    - Searches /symbols recursively for a matching SVG filename for each component.symbol
    - Draws wires as <line> elements and places SVG symbols at specified positions
    - Saves output in the same directory as input with suffix .svg

Notes:
    This is a minimal, forgiving renderer meant to prove the pipeline. It does NOT handle
    complex transforms, rotations, or scaling of embedded SVGs beyond simple translation.
"""

import os
import sys
import argparse
import textwrap

try:
    import yaml
except Exception:
    print('Missing dependency: pyyaml is required. Install with: pip install pyyaml')
    raise

# svgwrite is optional; prefer it if available for safer output, otherwise fall back.
try:
    import svgwrite
    SVGWRITE_AVAILABLE = True
except Exception:
    SVGWRITE_AVAILABLE = False


def find_symbol_file(symbol_name, symbols_root='symbols'):
    # symbol_name expected like 'resistor_us' which maps to resistor_us.svg
    target = f"{symbol_name}.svg"
    for dirpath, _, filenames in os.walk(symbols_root):
        if target in filenames:
            return os.path.join(dirpath, target)
    return None


def read_svg_snippet(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return None


def compute_canvas_size(components, connections, padding=20):
    max_x = 0
    max_y = 0
    for c in components:
        pos = c.get('pos') or [0, 0]
        x, y = pos[0], pos[1]
        if x > max_x: max_x = x
        if y > max_y: max_y = y
    for conn in connections:
        s = conn.get('start') or [0, 0]
        e = conn.get('end') or [0, 0]
        for x, y in (s, e):
            if x > max_x: max_x = x
            if y > max_y: max_y = y
    return max_x + padding, max_y + padding


def assemble_svg_text(components, connections, canvas_w, canvas_h, symbols_root='symbols'):
    parts = []
    # Header
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{canvas_w}" height="{canvas_h}" viewBox="0 0 {canvas_w} {canvas_h}">')
    parts.append('<defs></defs>')

    # Build quick lookup of component positions for snapping
    pos_map = {}
    for c in components:
        pos = c.get('pos') or [0, 0]
        pos_key = (int(pos[0]), int(pos[1]))
        pos_map[pos_key] = c

    # Draw wires (snap endpoints to nearby component centers within tolerance)
    SNAP_TOL = 8
    for conn in connections:
        s = conn.get('start', [0, 0])
        e = conn.get('end', [0, 0])

        def snap(pt):
            for (px, py), comp in pos_map.items():
                if abs(pt[0] - px) <= SNAP_TOL and abs(pt[1] - py) <= SNAP_TOL:
                    return [px, py]
            return pt

        s = snap(s)
        e = snap(e)
        parts.append(f'<line x1="{s[0]}" y1="{s[1]}" x2="{e[0]}" y2="{e[1]}" stroke="black" stroke-width="2" stroke-linecap="round" />')

    # Insert symbols
    for comp in components:
        name = comp.get('name', 'U?')
        symbol = comp.get('symbol')
        pos = comp.get('pos', [0, 0])
        x, y = pos[0], pos[1]

        if symbol:
            sym_path = find_symbol_file(symbol, symbols_root)
            if sym_path:
                svg_snip = read_svg_snippet(sym_path) or ''
                # Strip <?xml ... ?> and outer <svg ...> if present, then place inside group
                # crude but effective for simple symbols
                svg_snip = svg_snip.strip()
                # Remove xml declaration
                if svg_snip.startswith('<?xml'):
                    svg_snip = svg_snip.split('?>', 1)[1]
                # If starts with <svg ...> then extract inner content and try to keep its viewBox
                inner = svg_snip
                if svg_snip.startswith('<svg'):
                    # find the closing '>' of opening svg tag
                    idx = svg_snip.find('>')
                    if idx != -1:
                        inner = svg_snip[idx+1:]
                    # remove trailing </svg>
                    if inner.strip().endswith('</svg>'):
                        inner = inner.rsplit('</svg>', 1)[0]
                # Wrap in group with translation
                parts.append(f'<g transform="translate({x},{y})">{inner}</g>')
            else:
                # Placeholder rectangle
                parts.append(f'<rect x="{x-8}" y="{y-8}" width="16" height="16" fill="none" stroke="red" />')
                parts.append(f'<text x="{x+12}" y="{y+14}" font-size="12" >{name} (missing:{symbol})</text>')
                continue
        else:
            parts.append(f'<rect x="{x-6}" y="{y-6}" width="12" height="12" fill="none" stroke="orange" />')

        # Label near symbol (slightly below to avoid overlap)
        parts.append(f'<text x="{x+12}" y="{y+14}" font-size="12">{name}</text>')

    parts.append('</svg>')
    return '\n'.join(parts)


def render_with_svgwrite(components, connections, canvas_w, canvas_h, out_path, symbols_root='symbols'):
    dwg = svgwrite.Drawing(out_path, size=(canvas_w, canvas_h))
    # wires
    # build pos map for snapping
    pos_map = {}
    for c in components:
        pos = c.get('pos') or [0, 0]
        pos_map[(int(pos[0]), int(pos[1]))] = pos

    SNAP_TOL = 8
    def snap(pt):
        for (px, py), p in pos_map.items():
            if abs(pt[0] - px) <= SNAP_TOL and abs(pt[1] - py) <= SNAP_TOL:
                return (px, py)
        return (pt[0], pt[1])

    for conn in connections:
        s = conn.get('start', [0, 0])
        e = conn.get('end', [0, 0])
        s = snap(s)
        e = snap(e)
        dwg.add(dwg.line(start=s, end=e, stroke_width=2, stroke='black', stroke_linecap='round'))

    for comp in components:
        name = comp.get('name', 'U?')
        symbol = comp.get('symbol')
        pos = comp.get('pos', [0, 0])
        x, y = pos[0], pos[1]
        if symbol:
            sym_path = find_symbol_file(symbol, symbols_root)
            if sym_path:
                # svgwrite can't import raw svg easily; embed as raw text by using marker
                svg_snip = read_svg_snippet(sym_path) or ''
                # crude embedding: create a group and add raw svg snippet
                g = svgwrite.container.Group(transform=f'translate({x},{y})')
                g.add(svgwrite.container.Raw(svg_snip))
                dwg.add(g)
            else:
                dwg.add(dwg.rect(insert=(x-8, y-8), size=(16, 16), fill='none', stroke='red'))
                dwg.add(dwg.text(f"{name} (missing:{symbol})", insert=(x+10, y+4), font_size=12))
                continue
        else:
            dwg.add(dwg.rect(insert=(x-6, y-6), size=(12, 12), fill='none', stroke='orange'))
        dwg.add(dwg.text(name, insert=(x+10, y+4), font_size=12))

    dwg.save()


def main():
    parser = argparse.ArgumentParser(description='Render simple circuit YAML to SVG')
    parser.add_argument('input', help='Path to circuit definition YAML')
    parser.add_argument('--symbols', default='symbols', help='Root folder where SVG symbol files reside')
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f'Input file not found: {args.input}')
        sys.exit(1)

    with open(args.input, 'r', encoding='utf-8') as f:
        try:
            data = yaml.safe_load(f)
        except Exception as e:
            print(f'Failed to parse YAML: {e}')
            sys.exit(1)

    if not data:
        print('Input YAML parsed to empty / null. Nothing to render.')
        sys.exit(1)

    components = data.get('components', []) or []
    connections = data.get('connections', []) or []

    canvas_w, canvas_h = compute_canvas_size(components, connections)

    input_dir = os.path.dirname(os.path.abspath(args.input))
    base_name = os.path.splitext(os.path.basename(args.input))[0]
    out_path = os.path.join(input_dir, f"{base_name}.svg")

    if SVGWRITE_AVAILABLE:
        try:
            render_with_svgwrite(components, connections, canvas_w, canvas_h, out_path, args.symbols)
            print(f'Wrote SVG to: {out_path}')
            return
        except Exception as e:
            print(f'svgwrite rendering failed ({e}), falling back to manual assembly')

    svg_text = assemble_svg_text(components, connections, canvas_w, canvas_h, args.symbols)
    try:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(svg_text)
        print(f'Wrote SVG to: {out_path}')
    except Exception as e:
        print(f'Failed to write SVG: {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()

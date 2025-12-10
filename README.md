# ⚡ Electronic-Legion-library

**Status:** Active Development (Focus on Core Data Assets and Validation)

This repository is designed to serve as a structured, validated, and machine-readable reference for **AI-assisted analog circuit diagram generation.** It provides the fundamental data (symbols, component definitions) needed for an LLM to assemble accurate, consistent schematics.

### Primary Goal
To build the most reliable backend reference for an AI system by ensuring component definitions and symbols are minimal, uniform, and validated against strict schemas.

---

## 🛠️ Tooling & Capability (What Makes This Usable)

This section contains the necessary scripts to prove the machine-readability of the data assets.

### 1. Validation Script (`validate.py`)
A script that parses all component YAML files in `/components` and ensures they conform exactly to the JSON schemas defined in `/schemas`.

### 2. Rendering Script (Future: `render.py`)
(Future Plan) An optional Python script to auto-generate a circuit SVG/PNG from a component list using the SVG assets in `/symbols`. This script serves as the "proof-of-concept" for AI-driven diagram generation.

---

## 📂 Core Data Assets (The Library)

These sections represent the current, validated core of the library.

### 3. Components (YAML)
Machine-readable definitions for passive, active, and integrated components. Each definition follows a consistent YAML structure for easy parsing by external tools and AIs.

* Resistors, Capacitors, Inductors
* Semiconductors (Diodes, BJT, MOSFET)
* Integrated Circuits (OPAMPs)

### 4. Symbols (SVG)
A minimal, uniform library of SVG schematic symbols designed for quick rendering and consistent visual style. Organized by category (e.g., Passive, Active).

### 5. Schemas
JSON Schema files that define the structural rules for all component and metadata files. These schemas enforce data consistency, which is critical for machine reliability.

### 6. Examples
Fully worked sample cases that demonstrate the integration of data, symbols, and (eventually) simulation files.

* Component definitions (YAML)
* The resulting schematic diagram (SVG/PNG)
* Associated theory or calculations (Markdown)

---

## 🎯 Project Expansion (Future Modules)

These folders represent the target outcomes of using the data assets and will be populated as the core library matures.

### 7. Circuits
Topic-based folders containing verified analog circuit concepts and notes. This is where the machine-readable component definitions are used to build actual circuit examples.

* Basic Circuit Theory (Voltage Dividers, Ohm's Law)
* OP-AMP Circuits (Inverting, Non-Inverting)
* Filters (Low-pass, High-pass)

### 8. Simulations
Pre-verified simulation files for the circuits defined in Section 7. This provides a mechanism for cross-checking the theoretical design.

* LTspice (`.asc`)
* Proteus project files

---

## ⚖️ License
MIT License.
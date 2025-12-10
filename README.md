# Electronic-Legion-library
This repository is in active development.   
Its purpose is to provide a structured, machine-readable resource for an AI chatbot to generate clean, consistent analog electronic circuit diagrams.
A structured repository for analog electronics concepts, circuit theory, schematic symbols, component metadata, and simulation files.

### Primary Goal
Serve as a backend reference for an AI system:
- Component definitions in YAML  
- Minimal, uniform SVG schematic symbols  
- Example circuits with component metadata  
- Validated schemas to keep all files consistent  

### Not intended as a full textbook  
This repository acts as a standardized library that an AI can parse to assemble accurate analog circuit drawings.

## Repository Sections

### 1. Circuits
Topic-based folders containing explanations and diagrams:
- OP-AMP circuits
- Filters
- Diode circuits
- Transistor circuits
- Basic circuit theory

### 2. Simulations
Simulation-ready files:
- LTspice (.asc)
- Proteus project files

### 3. Symbols
A minimal library of SVG schematic symbols organized by category:
- Resistors, capacitors, inductors  
- Diodes and other semiconductors  
- BJTs, MOSFETs  
- OPAMP blocks  
- Miscellaneous symbols  

These symbols are designed for easy reuse in notes, docs, and auto-generated diagrams.

### 4. Components (YAML)
Machine-readable component definitions:
- Resistors
- Capacitors
- Inductors
- Semiconductors (diodes, BJT, MOSFET)
- Power components
- ICs

Each file follows the validation schema in `/schemas`.

### 5. Schemas
Validation structures for consistent component definitions:
- Component schema
- Symbol schema
- Metadata schema

### 6. Examples
Sample diagrams, component lists, and notes showing how everything works together.

## Future Plans
- Full symbol library for all major analog components  
- Complete YAML component database  
- Auto-validation scripts  
- Larger example library for AI-driven schematic generation  
- Optional script to auto-render diagrams from YAML + SVG assets  

## License
MIT License.

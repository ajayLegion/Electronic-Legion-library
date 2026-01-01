import { ComponentCategory, ElectronicComponent, SymbolAsset } from './types';

export const MOCK_COMPONENTS: ElectronicComponent[] = [
  {
    id: 'res_001',
    name: 'Generic Resistor',
    category: ComponentCategory.PASSIVE,
    description: 'A standard passive two-terminal electrical component that implements electrical resistance as a circuit element.',
    yamlDefinition: `name: Resistor
designator: R
pins:
  - number: 1
    name: ~
  - number: 2
    name: ~
parameters:
  resistance:
    type: number
    unit: ohm
    required: true
  tolerance:
    type: number
    unit: percent
    default: 5`,
    symbolPath: "M5,10 H15 L20,5 L30,15 L40,5 L50,15 L60,5 L70,15 L80,5 L85,10 H95"
  },
  {
    id: 'cap_001',
    name: 'Ceramic Capacitor',
    category: ComponentCategory.PASSIVE,
    description: 'A passive two-terminal electrical component used to store energy electrostatically in an electric field.',
    yamlDefinition: `name: Capacitor
designator: C
pins:
  - number: 1
    name: ~
  - number: 2
    name: ~
parameters:
  capacitance:
    type: number
    unit: farad
    required: true
  voltage_rating:
    type: number
    unit: volt`,
    symbolPath: "M5,10 H40 M40,0 V20 M60,0 V20 M60,10 H95"
  },
  {
    id: 'opamp_001',
    name: 'Op-Amp (Ideal)',
    category: ComponentCategory.INTEGRATED_CIRCUIT,
    description: 'A DC-coupled high-gain electronic voltage amplifier with a differential input and, usually, a single-ended output.',
    yamlDefinition: `name: Operational Amplifier
designator: U
pins:
  - number: 1
    name: IN+
  - number: 2
    name: IN-
  - number: 3
    name: V+
  - number: 4
    name: V-
  - number: 5
    name: OUT
parameters:
  gain:
    type: number
    default: 100000`,
    symbolPath: "M20,10 V90 L80,50 Z M10,25 H20 M10,75 H20 M80,50 H90"
  },
  {
    id: 'bjt_npn',
    name: 'NPN Transistor',
    category: ComponentCategory.SEMICONDUCTOR,
    description: 'A bipolar junction transistor (BJT) where the majority charge carriers are electrons.',
    yamlDefinition: `name: NPN Transistor
designator: Q
pins:
  - number: 1
    name: Base
  - number: 2
    name: Collector
  - number: 3
    name: Emitter
parameters:
  beta:
    type: number
    default: 100`,
    symbolPath: "M30,20 V80 M30,50 H10 M30,30 L60,10 M30,70 L60,90 L55,80 M58,86 L53,92" // Rough representation
  }
];

export const MOCK_SYMBOLS: SymbolAsset[] = MOCK_COMPONENTS.map(comp => ({
  id: `sym_${comp.id}`,
  name: comp.name,
  category: comp.category,
  svgContent: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    ${comp.symbolPath}
  </svg>`
}));

export const SAMPLE_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Component Definition",
  "type": "object",
  "required": ["name", "designator", "pins"],
  "properties": {
    "name": { "type": "string" },
    "designator": { "type": "string", "pattern": "^[A-Z]+$" },
    "pins": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["number"],
        "properties": {
          "number": { "type": "integer" },
          "name": { "type": ["string", "null"] }
        }
      }
    },
    "parameters": { "type": "object" }
  }
}`;

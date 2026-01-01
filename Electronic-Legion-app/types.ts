export enum View {
  DASHBOARD = 'DASHBOARD',
  COMPONENTS = 'COMPONENTS',
  SYMBOLS = 'SYMBOLS',
  AI_DESIGNER = 'AI_DESIGNER',
  VALIDATOR = 'VALIDATOR',
}

export enum ComponentCategory {
  PASSIVE = 'Passive',
  SEMICONDUCTOR = 'Semiconductor',
  INTEGRATED_CIRCUIT = 'Integrated Circuit',
}

export interface ElectronicComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  yamlDefinition: string;
  symbolPath?: string; // SVG path data
}

export interface SymbolAsset {
  id: string;
  name: string;
  category: ComponentCategory;
  svgContent: string; // Full SVG string
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'code' | 'schematic';
  language?: string;
}

export interface LabelData {
  lines: string[];
  fontFamily: string;
  fontSize: number;
  textColor: string;
  textAlign: "left" | "center" | "right";
}

export interface Template {
  id: string;
  name: string;
  type: "address" | "return_address" | "generic";
  placeholderLines: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: "address",
    name: "Address Label",
    type: "address",
    placeholderLines: ["John Smith", "123 Main Street", "Apt 4B", "New York, NY 10001"],
  },
  {
    id: "return_address",
    name: "Return Address",
    type: "return_address",
    placeholderLines: ["Jane Doe", "456 Oak Avenue", "Chicago, IL 60601"],
  },
  {
    id: "generic",
    name: "Generic Label",
    type: "generic",
    placeholderLines: ["Line 1", "Line 2", "Line 3"],
  },
];

export const FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
];

export const FREE_TIER_LIMIT = 10;

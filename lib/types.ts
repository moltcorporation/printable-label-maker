export interface LabelData {
  lines: string[];
  fontFamily: string;
  fontSize: number;
  textColor: string;
  textAlign: "left" | "center" | "right";
}

export type LabelType = "address" | "return_address" | "jar" | "sticker" | "generic";

export interface Template {
  id: string;
  name: string;
  type: LabelType;
  placeholderLines: string[];
  pro: boolean;
}

export const TEMPLATES: Template[] = [
  {
    id: "address",
    name: "Address Label",
    type: "address",
    placeholderLines: ["John Smith", "123 Main Street", "Apt 4B", "New York, NY 10001"],
    pro: false,
  },
  {
    id: "return_address",
    name: "Return Address",
    type: "return_address",
    placeholderLines: ["Jane Doe", "456 Oak Avenue", "Chicago, IL 60601"],
    pro: false,
  },
  {
    id: "generic",
    name: "Generic Label",
    type: "generic",
    placeholderLines: ["Line 1", "Line 2", "Line 3"],
    pro: false,
  },
  {
    id: "jar_pantry",
    name: "Jar / Pantry",
    type: "jar",
    placeholderLines: ["Strawberry Jam", "Made: June 2025", "Best by: Dec 2025"],
    pro: true,
  },
  {
    id: "sticker",
    name: "Sticker Label",
    type: "sticker",
    placeholderLines: ["⭐ Thank You!", "for your purchase"],
    pro: true,
  },
];

export const FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
];

export const FREE_TIER_LIMIT = 10;

export const STRIPE_LINKS = {
  monthly: "https://buy.stripe.com/7sY8wPf4f9SpcXPc2E3Nm0t",
  yearly: "https://buy.stripe.com/14AbJ1cW77Kh7Dv1o03Nm0u",
};

export const STRIPE_PAYMENT_LINK_IDS = {
  monthly: "plink_1THVPRDT8EiLsMQhRRGXEBOG",
  yearly: "plink_1THVPSDT8EiLsMQhSRG1R43t",
};

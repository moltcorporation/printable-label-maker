export interface LandingPage {
  slug: string;
  keyword: string;
  title: string;
  metaDescription: string;
  h1: string;
  description: string;
  templateParam: string;
  faqs: { question: string; answer: string }[];
}

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "address-labels",
    keyword: "printable address labels",
    title: "Printable Address Labels — Free Avery 5160 Template",
    metaDescription:
      "Create and print address labels on Avery 5160 sheets for free. Customize font, size, and alignment. Download as a print-ready PDF — no account needed.",
    h1: "Printable Address Labels",
    description:
      "Create professional address labels for envelopes, packages, and mailings. Enter your addresses, choose your layout on Avery 5160 sheets, and download a print-ready PDF in seconds. No account or sign-up required.",
    templateParam: "address",
    faqs: [
      {
        question: "What size are printable address labels?",
        answer:
          'The standard address label size is 1" × 2⅝" (Avery 5160), which fits 30 labels per letter-size sheet. This is the most common size for mailing and correspondence.',
      },
      {
        question: "Can I print address labels at home?",
        answer:
          "Yes. Use our free label maker to design your labels, download the PDF, and print on Avery 5160 compatible label sheets using any inkjet or laser printer.",
      },
      {
        question: "Do I need special paper for address labels?",
        answer:
          "You need Avery 5160 compatible label sheets, available at any office supply store. These are self-adhesive sheets that feed through standard printers.",
      },
      {
        question: "How many address labels fit on one page?",
        answer:
          "Avery 5160 sheets hold 30 labels per page, arranged in 3 columns and 10 rows. Each label measures 1\" × 2⅝\".",
      },
    ],
  },
  {
    slug: "return-address-labels",
    keyword: "return address labels",
    title: "Return Address Labels — Free Printable Template",
    metaDescription:
      "Make return address labels for free. Customize text, font, and size. Print on Avery 5160 sheets and download as PDF — no sign-up required.",
    h1: "Return Address Labels",
    description:
      "Design and print return address labels for your personal or business mail. Enter your return address once, generate a full sheet of identical labels, and print on Avery 5160 sheets. Save time on every mailing.",
    templateParam: "return_address",
    faqs: [
      {
        question: "How do I make return address labels at home?",
        answer:
          "Use our free label maker to type your return address, pick your font and size, then download the PDF. Print on Avery 5160 label sheets with any home printer.",
      },
      {
        question: "What is the standard return address label size?",
        answer:
          'The most common return address label is 1" × 2⅝" (Avery 5160), giving you 30 labels per sheet. This size fits neatly in the upper-left corner of standard envelopes.',
      },
      {
        question: "Can I print the same return address on every label?",
        answer:
          "Yes. Our editor fills every label on the sheet with the same content, so you get 30 identical return address labels per page.",
      },
    ],
  },
  {
    slug: "mailing-labels",
    keyword: "mailing labels",
    title: "Mailing Labels — Free Printable Avery Templates",
    metaDescription:
      "Create mailing labels for letters and packages. Print on Avery 5160 sheets for free. Customize text and download a print-ready PDF instantly.",
    h1: "Mailing Labels",
    description:
      "Print mailing labels for letters, packages, and bulk mailings. Our free label maker lets you customize text, font, and alignment, then download a PDF formatted for Avery 5160 sheets. Perfect for holiday cards, wedding invitations, and business mail.",
    templateParam: "address",
    faqs: [
      {
        question: "What size paper do I use for mailing labels?",
        answer:
          'Use standard US Letter size (8.5" × 11") Avery 5160 compatible label sheets. These fit 30 labels per page and work with any inkjet or laser printer.',
      },
      {
        question: "Can I print mailing labels without Word or Excel?",
        answer:
          "Yes. Our online label maker works entirely in your browser — no software to install. Just type your addresses, download the PDF, and print.",
      },
      {
        question: "How do I print mailing labels for a large batch?",
        answer:
          "Enter the address you need, and our tool generates a full sheet of 30 labels. For different addresses, create separate sheets. Pro users can import addresses via CSV for batch printing.",
      },
      {
        question: "Are mailing labels the same as address labels?",
        answer:
          'Yes, "mailing labels" and "address labels" refer to the same product. Both typically use the Avery 5160 format (1" × 2⅝", 30 per sheet).',
      },
    ],
  },
  {
    slug: "jar-labels",
    keyword: "printable jar labels",
    title: "Printable Jar Labels — Custom Pantry & Canning Labels",
    metaDescription:
      "Design and print jar labels for canning, pantry organization, and homemade goods. Customize text and download as PDF. Free to try.",
    h1: "Printable Jar Labels",
    description:
      "Create custom jar labels for canning, pantry organization, spice jars, and homemade goods. Add product names, dates, and ingredients, then print on label sheets. Great for farmers market products, gift jars, and kitchen organization.",
    templateParam: "jar_pantry",
    faqs: [
      {
        question: "What size labels work for jars?",
        answer:
          'For standard mason jars, 2" × 4" labels (Avery 5163) work well for the front, while 1" × 2⅝" labels (Avery 5160) are good for smaller jars and spice containers.',
      },
      {
        question: "Can I include dates on my jar labels?",
        answer:
          "Yes. Our editor lets you add multiple lines of text, so you can include the product name, date made, best-by date, and ingredients on each label.",
      },
      {
        question: "Are these labels waterproof?",
        answer:
          "The labels depend on the sheets you print on. For waterproof jar labels, use waterproof label sheets (like Avery 22805) with a laser printer for best durability.",
      },
    ],
  },
  {
    slug: "avery-5160-template",
    keyword: "avery 5160 template",
    title: "Avery 5160 Template — Free Printable Label Template",
    metaDescription:
      "Free Avery 5160 template with 30 labels per sheet (1\" × 2⅝\"). Customize and print address labels, mailing labels, and more. Download as PDF.",
    h1: "Avery 5160 Template",
    description:
      "Use our free Avery 5160 template to create 30 labels per sheet. The Avery 5160 is the most popular label format, measuring 1\" × 2⅝\" in a 3×10 grid on standard letter paper. Customize your text, pick a font, and download a perfectly aligned PDF.",
    templateParam: "address",
    faqs: [
      {
        question: "What are the dimensions of Avery 5160 labels?",
        answer:
          'Each Avery 5160 label is 1" tall × 2⅝" wide. The sheet holds 30 labels in a 3-column, 10-row layout on standard 8.5" × 11" paper.',
      },
      {
        question: "Is Avery 5160 the same as Avery 8160?",
        answer:
          "Yes, they have the same dimensions and layout. The difference is the printer type: 5160 is for laser printers and 8160 is for inkjet printers. Our template works with both.",
      },
      {
        question: "Can I use Avery 5160 for return address labels?",
        answer:
          "Yes. Avery 5160 is the most common sheet for return address labels. At 1\" × 2⅝\", each label fits a standard return address with room for your name, street, and city/state/zip.",
      },
      {
        question: "What printer settings should I use for Avery 5160?",
        answer:
          'Print at 100% scale (do not select "fit to page"). Use US Letter paper size. Our PDF is pre-formatted with the correct margins and spacing for perfect alignment.',
      },
    ],
  },
];

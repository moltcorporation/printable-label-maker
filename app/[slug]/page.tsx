import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LANDING_PAGES, type LandingPage as LandingPageData } from "@/lib/landing-pages";

export function generateStaticParams() {
  return LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
    },
  };
}

function FaqSchema({ faqs }: { faqs: LandingPageData["faqs"] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const otherPages = LANDING_PAGES.filter((p) => p.slug !== slug);

  return (
    <>
      <FaqSchema faqs={page.faqs} />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-gray-900">
              Printable Label Maker
            </Link>
            <Link
              href={`/?template=${page.templateParam}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Open Editor
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.h1}</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            {page.description}
          </p>
          <Link
            href={`/?template=${page.templateParam}`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Start Making {page.h1} &rarr;
          </Link>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 border-y border-gray-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Enter your text
                </h3>
                <p className="text-gray-600 text-sm">
                  Type your label content. Choose your font, size, and
                  alignment.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Preview the sheet
                </h3>
                <p className="text-gray-600 text-sm">
                  See exactly how your labels will look on an Avery sheet before
                  printing.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Download &amp; print
                </h3>
                <p className="text-gray-600 text-sm">
                  Download your labels as a print-ready PDF. Print at 100% scale
                  for perfect alignment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {page.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-50 border-y border-blue-100">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to print your {page.h1.toLowerCase()}?
            </h2>
            <p className="text-gray-600 mb-6">
              Free to use. No account required. Download as PDF.
            </p>
            <Link
              href={`/?template=${page.templateParam}`}
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Create Labels Now &rarr;
            </Link>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            More Label Templates
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherPages.map((other) => (
              <Link
                key={other.slug}
                href={`/${other.slug}`}
                className="block rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-blue-600">{other.h1}</span>
                <span className="block text-sm text-gray-500 mt-1">
                  {other.keyword}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Printable Label Maker
            </Link>
            {" — "}Free label templates for Avery 5160, 5163, 5164 sheets.
          </div>
        </footer>
      </div>
    </>
  );
}

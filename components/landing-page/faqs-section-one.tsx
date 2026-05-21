"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "How does Klicktiv replace my current spreadsheets?",
      answer:
        "Our platform automates sums and totals and general financial tracking, eliminating the need for manual formulas and complex spreadsheets. We provide a centralized dashboard that handles calculations in real-time, reducing human error.",
    },
    {
      id: "item-2",
      question: "Is it difficult to migrate my existing data?",
      answer:
        "Not at all. Our system supports bulk uploads, allowing you to transition your historical financial data from spreadsheets directly into the platform. Our VA team is also available to assist with the initial setup.",
    },
    {
      id: "item-3",
      question: "How secure is my financial information?",
      answer:
        "Data security is our top priority. We use enterprise-grade encryption and secure cloud storage to ensure your business's financial records are protected and accessible only by authorized users.",
    },
    {
      id: "item-4",
      question: "What is included in the paid access?",
      answer:
        "Paid access grants you full entry to our financial management tool, including automated reporting, expense tracking, and dedicated support from our VA team to help optimize your business workflows.",
    },
    {
      id: "item-5",
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, we offer flexible subscription plans. You can manage your billing preferences through your account settings or contact our support team to assist you with any changes to your access.",
    },
  ]

  return (
    <section id="faqs" className="bg-muted py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div>
          <h2 className="text-4xl font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-balance text-muted-foreground">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-(--radius) border border-transparent bg-card px-8 py-3 shadow ring-1 ring-foreground/5"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dotted"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-6 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Contact our{" "}
            <Link
              href="https://advancedvirtualstaff.com/booking"
              className="font-medium text-primary hover:underline"
            >
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

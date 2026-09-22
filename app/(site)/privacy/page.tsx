import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/layout/section";
import { getPublicConfig } from "@/lib/booking/public-data";
import { clinic } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Tic Tac Tooth collects, uses, stores and deletes information about patients and their parents or guardians.",
};

export const dynamic = "force-dynamic";

/**
 * Privacy notice.
 *
 * This is a structural draft, not legal copy. Every clause is written so that
 * a lawyer reviewing it can see exactly what the application actually does, * the retention period, the processors, the erasure route and the absence of
 * tracking are all statements about real behaviour in this codebase, not
 * boilerplate. That is what makes it reviewable.
 *
 * [LEGAL REVIEW REQUIRED] Nothing on this page may go live until reviewed
 * against the Digital Personal Data Protection Act 2023, in particular §9
 * (children's data). The bracketed placeholders are decisions the clinic and
 * its lawyer must make, not gaps to be filled in with plausible text.
 */

function Clause({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

export default async function PrivacyPage() {
  const config = await getPublicConfig();

  return (
    <Section tone="cream" size="loose">
      <div className="mx-auto max-w-3xl">
        <SectionHeading as="h1" title="Privacy notice" align="left" />

        {/* [LEGAL REVIEW REQUIRED] This notice must be reviewed and approved
            under the Digital Personal Data Protection Act 2023, in particular
            §9 on children's data, before the site accepts a real booking. */}

        <p className="mt-6 leading-relaxed text-ink/85">
          Almost everyone we treat is a child. That single fact shapes this
          notice: we ask for as little as we can, we say plainly what happens
          to it, and we do not track anybody.
        </p>

        <Clause title="What we collect">
          <p>When you book an appointment, we ask for:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>your child&apos;s first name and date of birth</li>
            <li>
              anything you choose to tell us that would help us prepare for the
              visit, this is optional and entirely up to you
            </li>
            <li>
              your name, mobile number, relationship to the child, and your
              email address if you give one
            </li>
            <li>the reason for the visit and the time you asked for</li>
          </ul>
          <p>
            We do not ask for a surname, an address, a photograph, an ID number
            or any clinical history through this website. Anything clinical is
            a conversation with the dentist, not a form field.
          </p>
        </Clause>

        <Clause title="Why we collect it">
          <p>
            To schedule the appointment, to prepare for it, to contact you
            about it, and to keep a record of your child&apos;s visits so that
            the dentist knows their history at the next one. We do not use any
            of it for advertising, and we do not sell or share it for anyone
            else&apos;s marketing.
          </p>
        </Clause>

        <Clause title="Consent">
          <p>
            A parent or legal guardian gives consent when they book. We store
            the exact wording that was agreed to, along with who agreed, their
            stated relationship to the child, and when, so that a consent
            recorded years ago still means something specific rather than
            pointing at wording that has since changed.
          </p>
          <p>
            You can withdraw consent at any time by contacting us. Withdrawing
            it means we stop using the information and, if you ask, erase it.
          </p>
        </Clause>

        <Clause title="We do not track you">
          <p>
            This website carries no analytics, no advertising pixels, no
            third-party marketing scripts and no behavioural tracking of any
            kind. Nothing on these pages reports your visit to anybody. This is
            not a setting you have to find and switch off, the code to do it
            is not here.
          </p>
        </Clause>

        <Clause title="Who else sees it">
          <p>
            Only the clinic&apos;s own staff, and the service providers that
            make the booking system work:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            {/* [PLACEHOLDER: name each provider and the country its data
                centres are in, once the contracts are signed.] */}
            <li>our hosting and database providers, who store the records</li>
            <li>
              the service that sends your confirmation email, which sees your
              email address and your child&apos;s first name
            </li>
            <li>
              if you choose WhatsApp, the messaging provider we use, which sees
              your mobile number and your child&apos;s first name
            </li>
          </ul>
          <p>
            Each of these is a data processor acting on our instructions, under
            a written agreement.
            {/* [PLACEHOLDER: confirm a data processing agreement is signed
                with each provider before launch.] */}
          </p>
        </Clause>

        <Clause title="How long we keep it">
          {/* [PLACEHOLDER: the retention period, set by the clinic on legal
              advice. The system enforces whatever period is configured.] */}
          <p>
            Records are kept for a defined period and then deleted. The period
            is set by the clinic on legal advice and will be stated here.
          </p>
          <p>
            The deletion is automatic rather than a task someone remembers to
            do. Records past the retention period are removed on a schedule.
          </p>
        </Clause>

        <Clause title="Asking us to delete it">
          <p>
            You can ask us to erase your family&apos;s records at any time.
            When you do, we delete the family record, every child on it, and
            their whole appointment history. It is a permanent deletion, there
            is no archived copy inside the system.
          </p>
          <p>
            We keep one thing: a log entry recording that a deletion happened,
            when, who carried it out, and the reason given, normally something
            like &ldquo;parent requested deletion by phone&rdquo;. It exists so
            we can demonstrate that we did what you asked. Staff are instructed
            not to put names in that reason, and no part of the deleted record
            itself is copied into it.
          </p>
          <p>
            You can also ask to see what we hold, or to correct anything that
            is wrong. Contact us on{" "}
            <a
              href={config.phoneHref}
              className="font-semibold text-ink underline underline-offset-2"
            >
              {config.phoneDisplay}
            </a>
            .
          </p>
        </Clause>

        <Clause title="Who is responsible">
          {/* [PLACEHOLDER: the registered name of the clinic as Data
              Fiduciary, its address, and the person responsible for data
              protection questions.] */}
          <p>
            {clinic.fullName}, {clinic.addressLines.join(", ")}. Data protection
            questions can be raised by phone on {clinic.phoneDisplay}.
          </p>
          <p>
            If you are not satisfied with how we have handled your information,
            you can complain to the Data Protection Board of India.
          </p>
        </Clause>

        <Clause title="Changes to this notice">
          <p>
            If we change this notice we will change the date below. Where a
            change affects what you have already consented to, we will ask you
            again rather than assume.
          </p>
          {/* [PLACEHOLDER: date of the approved version.] */}
        </Clause>
      </div>
    </Section>
  );
}

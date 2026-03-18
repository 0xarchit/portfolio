import { PageLayout } from "@/components/PageLayout";
import { AllPortfolioData } from "@/types/api";

const cleanValue = (value?: string) =>
  (value || "").replace(/`/g, "").trim();

async function getAllData(): Promise<AllPortfolioData | null> {
  const apiUrl = process.env.DATA_API_URL || "https://0xarchit.val.run";
  try {
    const res = await fetch(`${apiUrl}/v1/all`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return null;
    }
    const data: AllPortfolioData = await res.json();
    return {
      ...data,
      about: {
        ...data.about,
        links: Object.fromEntries(
          Object.entries(data.about?.links || {}).map(([key, value]) => [
            key,
            cleanValue(value),
          ])
        ),
      },
    };
  } catch {
    return null;
  }
}

export default async function TermsOfService() {
  const data = await getAllData();
  const about = data?.about;
  const lastUpdated = "November 2, 2025";

  return (
    <PageLayout
      title="Terms of Service"
      description="Terms and conditions for using 0xArchit's projects and services"
      about={about}
    >
      <div className="space-y-8 text-[#CCD6F6]">
        <p className="text-[#8892B0] italic">Last Updated: {lastUpdated}</p>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            By accessing and using this website and any projects created by
            0xArchit (Archit Jain), you accept and agree to be bound by the
            terms and provisions of this agreement. If you do not agree to these
            terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Use of Services
          </h2>
          <p className="leading-relaxed mb-4">
            Our services, projects, and code are provided for educational,
            personal, and commercial use subject to the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You must comply with all applicable laws and regulations</li>
            <li>
              You may not use our services for any illegal or unauthorized
              purpose
            </li>
            <li>
              You may not attempt to harm, disrupt, or compromise our services
            </li>
            <li>You must respect intellectual property rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Open Source Projects
          </h2>
          <p className="leading-relaxed mb-4">
            Many of our projects are released under open-source licenses. When
            using these projects:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Respect the specific license terms of each project (MIT, GPL,
              Apache, etc.)
            </li>
            <li>Provide appropriate attribution when required</li>
            <li>
              Contributions to projects are subject to the project's
              contribution guidelines
            </li>
            <li>Open-source code is provided "as is" without warranty</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Intellectual Property
          </h2>
          <p className="leading-relaxed mb-4">Unless otherwise stated:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Content on this website is owned by 0xArchit (Archit Jain)</li>
            <li>
              The "0xArchit" brand, logo, and associated materials are
              proprietary
            </li>
            <li>You may not use our branding without explicit permission</li>
            <li>
              Code snippets and tutorials may be used with proper attribution
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Disclaimer of Warranties
          </h2>
          <p className="leading-relaxed mb-4">
            Our services and projects are provided "as is" and "as available"
            without any warranties:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              We make no warranties about reliability, accuracy, or completeness
            </li>
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>
              We are not responsible for any damages resulting from use of our
              services
            </li>
            <li>Third-party services and links are not under our control</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Limitation of Liability
          </h2>
          <p className="leading-relaxed">
            To the maximum extent permitted by law, 0xArchit (Archit Jain) shall
            not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of or inability to use
            our services, even if we have been advised of the possibility of
            such damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            User Conduct
          </h2>
          <p className="leading-relaxed mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit malicious code or viruses</li>
            <li>Attempt to gain unauthorized access to systems</li>
            <li>Engage in spam, harassment, or abusive behavior</li>
            <li>Impersonate others or misrepresent your affiliation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            External Links
          </h2>
          <p className="leading-relaxed">
            Our website may contain links to third-party websites. These links
            are provided for convenience only. We do not endorse or take
            responsibility for the content, privacy policies, or practices of
            any third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Modifications to Service
          </h2>
          <p className="leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any part of
            our services at any time without notice. We shall not be liable to
            you or any third party for any modification, suspension, or
            discontinuation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Changes to Terms
          </h2>
          <p className="leading-relaxed">
            We reserve the right to update these Terms of Service at any time.
            Changes will be effective immediately upon posting. Your continued
            use of our services after changes constitutes acceptance of the
            modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Governing Law
          </h2>
          <p className="leading-relaxed">
            These terms shall be governed by and construed in accordance with
            the laws of India, without regard to its conflict of law provisions.
            Any disputes shall be subject to the exclusive jurisdiction of the
            courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Severability
          </h2>
          <p className="leading-relaxed">
            If any provision of these terms is found to be unenforceable or
            invalid, that provision shall be limited or eliminated to the
            minimum extent necessary, and the remaining provisions shall remain
            in full force and effect.
          </p>
        </section>

        <section className="bg-[#0A192F] p-6 rounded-lg border border-[#233554]">
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Contact Information
          </h2>
          <p className="leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please
            contact us:
          </p>
          <p className="leading-relaxed">
            Email:{" "}
            <a
              href="mailto:mail@0xarchit.is-a.dev"
              className="text-[#64FFDA] hover:underline font-mono"
            >
              mail@0xarchit.is-a.dev
            </a>
          </p>
          <p className="leading-relaxed mt-2">
            Website:{" "}
            <a
              href="https://0xarchit.is-a.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#64FFDA] hover:underline"
            >
              0xarchit.is-a.dev
            </a>
          </p>
          <p className="leading-relaxed mt-2">
            GitHub:{" "}
            <a
              href="https://github.com/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#64FFDA] hover:underline"
            >
              github.com/0xarchit
            </a>
          </p>
        </section>
      </div>
    </PageLayout>
  );
}

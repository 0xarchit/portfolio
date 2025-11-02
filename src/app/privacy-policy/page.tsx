"use client";
import { PageLayout } from "@/components/PageLayout";

export default function PrivacyPolicy() {
  const lastUpdated = "November 2, 2025";

  return (
    <PageLayout
      title="Privacy Policy"
      description="How we handle your data and protect your privacy"
    >
      <div className="space-y-8 text-[#CCD6F6]">
        <p className="text-[#8892B0] italic">Last Updated: {lastUpdated}</p>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Introduction
          </h2>
          <p className="leading-relaxed">
            Welcome to 0xArchit's Privacy Policy. This policy describes how we
            collect, use, and protect your information when you visit our
            website and use our projects. We are committed to ensuring that your
            privacy is protected.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Information We Collect
          </h2>
          <p className="leading-relaxed mb-4">
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Basic analytics data (page views, browser type, device
              information)
            </li>
            <li>Information you provide when contacting us via email</li>
            <li>
              Any data you explicitly share through our projects or services
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            How We Use Your Information
          </h2>
          <p className="leading-relaxed mb-4">
            The information we collect is used to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Improve our website and user experience</li>
            <li>Respond to your inquiries and communications</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Maintain and improve our projects and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Data Storage and Security
          </h2>
          <p className="leading-relaxed">
            We implement appropriate security measures to protect your personal
            information. However, please note that no method of transmission
            over the Internet or electronic storage is 100% secure. We strive to
            use commercially acceptable means to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Third-Party Services
          </h2>
          <p className="leading-relaxed mb-4">
            Our website may contain links to third-party websites or services.
            We are not responsible for the privacy practices of these external
            sites. We encourage you to review their privacy policies before
            providing any personal information.
          </p>
          <p className="leading-relaxed">
            We may use third-party analytics services (such as Google Analytics)
            to analyze website traffic. These services may collect information
            about your use of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">Cookies</h2>
          <p className="leading-relaxed">
            Our website may use cookies to enhance your browsing experience.
            Cookies are small text files stored on your device. You can choose
            to disable cookies through your browser settings, though this may
            affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Your Rights
          </h2>
          <p className="leading-relaxed mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt-out of certain data collection practices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Children's Privacy
          </h2>
          <p className="leading-relaxed">
            Our services are not directed to children under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you believe we have collected such information, please contact us
            immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Changes to This Policy
          </h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated "Last Updated" date. We
            encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">
            Open Source Projects
          </h2>
          <p className="leading-relaxed">
            Many of our projects are open-source and hosted on GitHub. When you
            use or contribute to these projects, GitHub's privacy policy and
            terms of service also apply. Please review their policies at{" "}
            <a
              href="https://docs.github.com/en/site-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#64FFDA] hover:underline"
            >
              GitHub's site policy
            </a>
            .
          </p>
        </section>

        <section className="bg-[#0A192F] p-6 rounded-lg border border-[#233554]">
          <h2 className="text-2xl font-bold text-[#64FFDA] mb-4">Contact Us</h2>
          <p className="leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact us:
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
        </section>
      </div>
    </PageLayout>
  );
}

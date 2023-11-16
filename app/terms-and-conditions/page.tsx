import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className=" text-5xl font-bold underline mb-2">
        MUNCH PAY FOOD SERVICE
      </h1>
      <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
      <h2 className="text-sm mb-8">Last Updated: Thursday, 16 November 2023</h2>

      <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <p className="text-base mb-8">
        By using our Meal Payment System, you agree to comply with and be bound
        by these Terms and Conditions.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
      <p className="text-base mb-8">
        Users are responsible for maintaining the confidentiality of their
        account information and for all activities that occur under their
        account.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Payment and Refunds</h2>
      <p className="text-base mb-8">
        Payments are processed securely. Refunds may be issued according to our
        Refund Policy, outlined{" "}
        <Link
          href="terms-and-conditions"
          target="_blank"
          className="underline text-blue-700"
        >
          here
        </Link>
        .
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Prohibited Activities</h2>
      <p className="text-base mb-8">
        Users are prohibited from engaging in any unlawful activities, including
        but not limited to hacking, data mining, or any activity that could
        disrupt the functionality of the system.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
      <p className="text-base mb-8">
        We prioritize the security of user data. Any unauthorized access or
        breach should be reported immediately.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
      <p className="text-base mb-8">
        We reserve the right to update and change the Terms and Conditions from
        time to time without notice. Continued use of the service after any
        changes shall constitute your consent to such changes.
      </p>

      <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
      <p className="text-base mb-8">
        We reserve the right to terminate or suspend accounts at our discretion
        for any reason without notice.
      </p>

      <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
      <p className="text-base mb-8">
        If you have any questions or concerns regarding these Terms and
        Conditions, please contact us at{" "}
        <Link href="mailto:werukioni@gmail.com" className="text-blue-500">
          werukioni@gmail.com
        </Link>
        .
      </p>
    </div>
  );
};

export default TermsAndConditions;

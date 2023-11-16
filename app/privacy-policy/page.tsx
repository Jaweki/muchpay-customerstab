import Link from "next/link";

const page = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className=" text-5xl font-bold underline mb-2">
        MUNCH PAY FOOD SERVICE
      </h1>
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <h2 className="text-sm mb-8">Last Updated: Thursday, 16 November 2023</h2>
      <h3 className="text-2xl font-semibold mb-4">
        Welcome to Jaweki Dev Group!
      </h3>

      <p className="text-base mb-8">
        This Privacy Policy describes how your personal information is
        collected, used, and shared when you use our Meal Payment System.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
      <p className="text-base mb-8">
        <h3 className="text-lg font-semibold mb-2">Customer Information:</h3>
        <ul className="list-disc pl-4">
          <li>
            When you make a payment, we collect information such as your name,
            students identity number(reg_no if provided), phone number, and
            transaction details. Most relevant to customers is data used to
            aquired during an mpesa transaction.
          </li>
        </ul>
        <h3 className="text-lg font-semibold mb-2">Profile Avatars:</h3>
        <ul className="list-disc pl-4">
          <li>
            If you choose to upload a profile avatar, it will be stored on AWS
            S3. This option is only present for staff members who work in the
            kitchen.
          </li>
        </ul>
        <h3 className="text-lg font-semibold mb-2">Usage Data:</h3>
        <ul className="list-disc pl-4">
          <li>
            We collect information on how you interact with our system, such as
            pages visited and features used.
          </li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        How We Use Your Information
      </h2>
      <p className="text-base mb-8">
        We use the information we collect for various purposes, including:
        <ul className="list-disc pl-4">
          <li>Processing your meal payments</li>
          <li>Providing customer support</li>
          <li>Improving and optimizing our system</li>
          <li>Communicating with you about your orders and account</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
      <p className="text-base mb-8">
        Refund to customers are only initialized for the following
        circumstances:
        <ul className="list-disc pl-4">
          <li>
            A successful transaction with a message from mpesa to your phone,
            that was not provided for a recipt for, by the muchpay system
          </li>
          <li>
            Unintended Errorneous cause by muchpay system, to make the customer
            pay an amount exceess of the stated during inital placement of
            order, provided that the customer has a message from mpesa
            confirming sucessful transaction.
          </li>
          <li>
            If a customer orders meals more that 5 the base quantity, and are
            willingful to deduct the order.
          </li>
          <li>
            For customers who are valid students but the system charged them a
            VAT on their bill.{" "}
          </li>
        </ul>
        <span className=" font-bold italic">
          NOTE! While claiming a refund, ensure you have the recipt to prove the
          order and/or an mpesa_message that confirms successful transaction .{" "}
        </span>
      </p>
      <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
      <p className="text-base mb-8">
        We take the security of your data seriously. We implement
        industry-standard measures to protect your personal information from
        unauthorized access, disclosure, alteration, and destruction.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
      <p className="text-base mb-8">
        We retain your personal information for as long as necessary to provide
        our services and fulfill the purposes outlined in this Privacy Policy.
        You can request the deletion of your account at any time for staff
        members. For customers data will be retained for 90 days before being
        deleted as we might need to query large storage and inspect for
        suspicious activities.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
      <p className="text-base mb-8">
        You have the right to:
        <ul className="list-disc pl-4">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccuracies in your personal information</li>
          <li>Request the deletion of your data</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        Changes to This Privacy Policy
      </h2>
      <p className="text-base mb-8">
        We may update our Privacy Policy from time to time. Any changes will be
        posted on this page, and the date at the top will indicate when the
        policy was last revised.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p className="text-base mb-8">
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <Link href="mailto:werukioni@gmail.com" className="text-blue-500">
          werukioni@gmail.com
        </Link>
        {"."}
      </p>
    </div>
  );
};

export default page;

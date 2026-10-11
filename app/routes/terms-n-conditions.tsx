const TermsNConditions = () => {
  return (
    <main className="py-12 text-gray-800 font-sans antialiased leading-relaxed min-h-screen">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          MIV (Made In Vikhroli) — Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 italic">
          Please read this document carefully before registering on the website.
        </p>
      </header>

      {/* Terms Content Container */}
      <article className="space-y-12">
        {/* Section 1 */}
        <section id="section-1" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            1. About MIV
          </h2>
          <p className="mb-3">
            MIV (&quot;Made In Vikhroli&quot;) is a website where local sellers
            (&quot;Members&quot;) can list products (&quot;Artifacts&quot;) and
            buyers can browse, discover and purchase them.
          </p>
          <p>
            You may freely browse Artifacts, Member profiles, and make donations
            without creating an account. An account is required only to purchase
            a product, so that your purchase history can be maintained.
          </p>
        </section>

        {/* Section 2 */}
        <section id="section-2" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            2. Role of MIV in Payments
          </h2>
          <p className="mb-3">
            MIV facilitates payment information and verification between buyers
            and sellers.{" "}
            <strong className="text-gray-900 font-semibold">
              MIV does not hold, process, or route any funds.
            </strong>{" "}
            All payment goes directly from buyer to seller. MIV&apos;s role is
            limited to displaying payment details and providing tools to verify
            that a payment has taken place.
          </p>
          <p>
            Since MIV does not handle funds, sellers are solely responsible for
            complying with applicable Indian tax laws, including GST, on their
            sales.
          </p>
        </section>

        {/* Section 3 */}
        <section id="section-3" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            3. Creating a Buyer Account
          </h2>
          <p className="mb-3">
            To sign in, you will be asked to enter your{" "}
            <strong className="text-gray-900 font-semibold">email ID</strong>{" "}
            and <strong className="text-gray-900 font-semibold">UPI ID</strong>,
            and confirm login with an OTP sent to your email (valid for 2
            minutes).
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>
              A login session lasts{" "}
              <strong className="text-gray-900 font-semibold">7 days</strong>{" "}
              from the date the OTP is issued, after which you will need to log
              in again.
            </li>
            <li>
              You may be logged in on only{" "}
              <strong className="text-gray-900 font-semibold">
                one device at a time
              </strong>
              . For payments, you may open the payment QR code on a
              desktop/second screen without logging in there, while completing
              payment details on your logged-in device.
            </li>
            <li>
              Your{" "}
              <strong className="text-gray-900 font-semibold">
                email and UPI ID are stored in plain text
              </strong>
              , so sellers can verify your identity and payment. Your OTP is
              stored only in hashed form and cannot be read by anyone, including
              MIV.
            </li>
            <li>
              When making a purchase, you will be asked to provide a{" "}
              <strong className="text-gray-900 font-semibold">
                UTR (transaction reference) number
              </strong>
              , used to verify your payment more strongly. We strongly recommend
              providing this, as it helps resolve payment disputes quickly.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="section-4" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            4. Creating a Seller Account
          </h2>
          <p className="mb-3">
            Sellers provide the same details as buyers, plus: username, profile
            photo, a short description, social media links, and (optionally) a
            WhatsApp number.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>
              Your{" "}
              <strong className="text-gray-900 font-semibold">
                UPI ID will be publicly visible
              </strong>{" "}
              to all visitors, logged in or not. We strongly recommend{" "}
              <strong className="text-gray-900 font-semibold">not</strong> using
              a phone-number-based UPI ID.
            </li>
            <li>
              Your product listings (name, slug, price, description, tags, and
              payment details) are publicly visible.
            </li>
            <li>
              You agree to let MIV feature your product&apos;s first image on
              the MIV homepage.
            </li>
            <li>
              For digital products, you agree to provide genuine, high-quality
              files as described, and agree that buyers may download and retain
              these files after purchase. You agree not to alter or
              destructively edit a product after it has been purchased in a way
              that removes access to what was originally provided.
            </li>
            <li>
              You agree to sell only products you have the legal right to sell —
              i.e., your own original creations, or work you are an
              author/co-author of.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="section-5" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            5. Order & Payment Verification Process
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-2">
            <li>
              An order is created once a buyer provides their UTR number and UPI
              ID. Once submitted,{" "}
              <strong className="text-gray-900 font-semibold">
                the order cannot be edited by the buyer.
              </strong>
            </li>
            <li>
              The seller must verify (or reject) the payment within{" "}
              <strong className="text-gray-900 font-semibold">48 hours</strong>.
            </li>
            <li>
              If the seller does not act within 48 hours, the buyer may raise a
              dispute. MIV will attempt to contact the seller and help resolve
              the matter, and will update the buyer on the payment status.
            </li>
            <li>
              In case of a dispute, MIV may request proof from either side
              (e.g., proof of non-receipt from the seller, or proof of
              successful payment from the buyer) to resolve the issue.
            </li>
            <li>
              Once verified:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>
                  <strong className="text-gray-900 font-semibold">
                    Digital products
                  </strong>{" "}
                  are emailed to the buyer immediately from MIV&apos;s official
                  email, with a download link.
                </li>
                <li>
                  <strong className="text-gray-900 font-semibold">
                    Physical products
                  </strong>{" "}
                  require the buyer and seller to independently coordinate
                  shipping and address details over email or WhatsApp.
                </li>
              </ul>
            </li>
            <li>
              <strong className="text-gray-900 font-semibold">
                MIV is not responsible if a seller fails to ship a physical
                product
              </strong>{" "}
              after payment is verified. Such disputes should be raised with the
              appropriate authorities (see Section 9).
            </li>
          </ol>
        </section>

        {/* Section 6 */}
        <section id="section-6" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            6. Fair Use & Account Integrity
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>
              Each user may hold only{" "}
              <strong className="text-gray-900 font-semibold">
                one account
              </strong>
              . Additional accounts will be deleted, with a warning issued
              first.
            </li>
            <li>
              Repeatedly submitting fake/non-existent UTR numbers across orders
              will be treated as spam and may result in a warning or account
              deletion.
            </li>
            <li>
              Accounts suspected of being non-genuine (bots) will receive a
              verification email. Failure to respond within a reasonable time
              will result in account deletion.
            </li>
            <li>
              Buyers and sellers agree to communicate respectfully during
              payment verification, over email or WhatsApp. Verified complaints
              of misbehaviour may result in a warning or account deletion. MIV
              is not responsible for distress arising from communication beyond
              basic, automated payment-verification messages, and discourages
              conversations beyond that scope on these channels.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="section-7" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            7. Content & Listing Standards
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>
              Sellers agree to list only{" "}
              <strong className="text-gray-900 font-semibold">
                legal products
              </strong>
              . MIV is not responsible for any illegal listing that goes
              unnoticed at the time of listing.
            </li>
            <li>
              MIV reserves the right to remove any listing found to be illegal,
              regardless of its sales history, and to cancel any associated
              orders. MIV also reserves the right to suspend or delete accounts
              found to be in violation of these terms, following a warning.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section id="section-8" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            8. Account Deletion
          </h2>
          <p className="mb-3">
            Please read this document carefully before registering, as account
            deletion is restricted once you have transaction history.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>
              <strong className="text-gray-900 font-semibold">
                Before your first order/sale:
              </strong>{" "}
              you may delete your account anytime from your profile. All your
              data will be permanently deleted from MIV&apos;s database
              (verifiable via the website&apos;s public backend source code on
              GitHub).
            </li>
            <li>
              <strong className="text-gray-900 font-semibold">
                After your first order (as buyer) or sale (as seller):
              </strong>{" "}
              accounts cannot be self-deleted. Please contact{" "}
              <a
                href="mailto:info@madeinvikhroli.com"
                className="text-indigo-600 hover:underline"
              >
                info@madeinvikhroli.com
              </a>{" "}
              to discuss your situation; we will try our best to help, including
              deletion where possible.
            </li>
            <li>
              If a seller&apos;s account is deleted after sales have taken
              place, MIV will email all affected buyers with download links to
              retain their purchased content, since it will no longer be
              available on the platform. By listing a product for sale, you
              agree to this process.
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section id="section-9" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            9. Disclaimers & Limitation of Liability
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>
              MIV does not take responsibility for delays in payment
              verification by sellers.
            </li>
            <li>
              MIV is not responsible for data breaches, though reasonable
              security measures are taken to protect the limited data we
              collect. We recommend avoiding phone-number-linked UPI IDs and
              WhatsApp numbers, since these are made public.
            </li>
            <li>
              The website may occasionally be unavailable due to maintenance or
              technical issues. While we try to minimize this, MIV is not
              responsible for extended downtime.
            </li>
            <li>
              MIV is not responsible for any harm caused by a seller&apos;s
              product (digital or physical), or for any intellectual property
              infringement arising from a seller&apos;s product.
            </li>
            <li>
              For issues beyond what MIV can resolve — such as payment reversal,
              non-delivery of physical products, or harassment during
              communication — please contact the relevant authority: your bank
              (for payment reversal), or the appropriate cybercrime/IT Act
              channels for harassment on digital platforms. Such matters are
              governed by RBI, UPI, and IT Act regulations, as applicable.
            </li>
            <li>
              Users agree to indemnify MIV against any claims arising from their
              own listings or conduct on the platform.
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="section-10" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            10. Eligibility
          </h2>
          <p>
            Buyers and sellers must be{" "}
            <strong className="text-gray-900 font-semibold">
              18 years or older
            </strong>
            . By providing a UPI ID during signup or payment, you confirm that
            you meet this requirement.
          </p>
        </section>

        {/* Section 11 */}
        <section id="section-11" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            11. Pricing
          </h2>
          <p>
            All prices are listed in{" "}
            <strong className="text-gray-900 font-semibold">
              INR (Indian Rupees)
            </strong>
            , as MIV uses the UPI standard for payments, which supports INR
            only. Prices are fixed and non-negotiable. Products may receive
            non-destructive updates, which will be described in the product
            listing.
          </p>
        </section>

        {/* Section 12 */}
        <section id="section-12" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            12. Contact Us
          </h2>
          <p className="mb-2">
            For any complaints, issues, or information regarding the website:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
            <li>
              <strong className="text-gray-900 font-semibold">
                General/Entity:
              </strong>{" "}
              <a
                href="mailto:info@madeinvikhroli.com"
                className="text-indigo-600 hover:underline"
              >
                info@madeinvikhroli.com
              </a>
            </li>
            <li>
              <strong className="text-gray-900 font-semibold">
                Individual (Pratham Patankar):
              </strong>{" "}
              <a
                href="mailto:praxham@madeinvikhroli.com"
                className="text-indigo-600 hover:underline"
              >
                praxham@madeinvikhroli.com
              </a>
            </li>
          </ul>
        </section>

        {/* Section 13 */}
        <section id="section-13" className="scroll-mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            13. Changes to These Terms
          </h2>
          <p>
            Any changes to this document will be communicated to all registered
            users via email.
          </p>
        </section>
      </article>
    </main>
  );
};

export default TermsNConditions;

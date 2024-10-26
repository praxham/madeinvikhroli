import React, {useState, useEffect} from "react";

const sections = [
  {
    title: "Payment Processing",
    content: [
      'Made in Vikhroli (hereinafter referred to as "the Platform") serves solely as a facilitator for showcasing products and processing payments.',
      'All payments made through this website are directed to the individual creator of the product (hereinafter referred to as "the Maker").',
      "The Platform does not retain any portion of the payment and acts only as an intermediary payment processor.",
    ],
  },
  {
    title: "Product Responsibility",
    content: [
      "The Platform is not responsible for the quality, accuracy, or delivery of the products sold.",
      "All matters related to the product, including but not limited to quality, description, and fulfillment, are the sole responsibility of the Maker.",
    ],
  },
  {
    title: "Communication",
    content: [
      "Any inquiries, concerns, or discussions regarding payments or products should be directed to the respective Maker.",
      "The Platform does not mediate disputes between Buyers and Makers but may provide contact information for direct communication.",
    ],
  },
  {
    title: "Product Delivery",
    content: [
      "After the payment is processed through the Platform, the Buyer will be redirected to either WhatsApp or email (as chosen by the Buyer) with the payment and purchase details of the products.",
      "The Buyer is required to send these purchase details to the Seller directly.",
      "Payment verification is currently performed manually by the Seller. (We plan to automate this process in the future.)",
      "Upon successful verification of the payment, the Seller will provide the deliverable to the Buyer within a 24-hour period.",
      "The Platform facilitates the initial redirection but is not responsible for the final delivery of the product or the verification of payment.",
    ],
  },
  {
    title: "Refunds and Cancellations",
    content: [
      "The Platform does not offer refunds or cancellations for any purchases made.",
      "All sales are final once the payment is processed.",
      "Buyers are encouraged to carefully review their purchase before completing the transaction.",
      "Any issues or concerns regarding a product should be addressed directly with the Maker.",
      "The Platform is not responsible for mediating disputes between Buyers and Makers regarding refunds or cancellations.",
    ],
  },
];

const PurchasePolicy = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(
    () => JSON.parse(localStorage.getItem('translateToMarathi'))
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      setTranslateToMarathi(JSON.parse(localStorage.getItem('translateToMarathi')))
    };

    window.addEventListener('language', handleLanguageChange);

    return () => {
      window.removeEventListener('language', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  

  return (
    <div className="w-[1240px] mx-auto mt-16 flex flex-col items-center justify-center text-white">
      <div className="text-[84px] font-medium my-64">Purchase Policy</div>
      <div className="w-full flex flex-col gap-4">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-semibold mb-2 ">
              {index + 1}. {section.title}
            </h2>
            <ul className="list-disc pl-6">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className=" mb-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="">
          By using this platform to make a purchase and clicking on the "I agree
          to this website's Purchase Policy" checkbox during the checkout
          process, you confirm your agreement to these terms.
        </p>
      </div>
    </div>
  );
};

export default PurchasePolicy;

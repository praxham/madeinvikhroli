import StyledButton from "~/components/common/styledButton";
import WorkCard from "~/components/work/workCard";
import { workList } from "~/constatns";
import { generateMailToLink } from "~/functions";
import websiteServiceIllustration from "../assets/work/website.png";
import storeServiceIllustration from "../assets/work/store.png";
import automationServiceIllustration from "../assets/work/automation.png";
import customSoftwareServiceIllustration from "../assets/work/custom.png";
import pcBuyingServiceIllustration from "../assets/work/pc.png";

const Work = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <h1 className="heading1 text-[2rem]">Articles</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {workList.map((item, index) => (
          <WorkCard
            key={item.title}
            title={item.title}
            bgImage={item.bgImage}
            articleUrl={item.articleUrl}
            headingBgColor={item.headingBgColor}
            headingMaxWidth={item.headingMaxWidth}
            className={
              index === 2
                ? "max-lg:col-span-2 max-md:aspect-[2/1] max-lg:w-full max-lg:max-h-[286px]"
                : ""
            }
          />
        ))}
      </div>
      <h1 className="heading1 text-[2rem]">Services</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4">
        {servicesList.map((item) => {
          const providedByUserURL = new URL(item.urls.providedByUser);
          const username =
            "@" + providedByUserURL.pathname.replace("/members/", "");
          return (
            <div
              key={item.title}
              className="flex flex-col gap-3 min-w-[250px] h-full min-h-[81px] bg-white p-4 rounded-(--corner-radius)"
            >
              <img src={item.illustration} alt="" />
              <div className="flex flex-col gap-1 w-full">
                <h1 className="font-semibold text-[1.2rem]">{item.title}</h1>
                <div className="flex flex-row flex-wrap gap-1 text-[0.87rem] font-medium text-(--clr-grey-one)">
                  {item.tags
                    .filter((tag) => tag.trim() !== "")
                    .map((tag, index, arr) => (
                      <h2 key={tag} className="break-words whitespace-normal">
                        {tag}
                        {index < arr.length - 1 ? ", " : ""}
                      </h2>
                    ))}
                </div>
                {item.urls.example.length > 0 && (
                  <div className="flex flex-row flex-wrap gap-2 text-[0.87rem] text-(--clr-grey-two)">
                    <p>eg:</p>
                    <div className="flex flex-row gap-2">
                      {item.urls.example
                        .filter((url) => url.url.trim() !== "")
                        .map((url, index, arr) => (
                          <a
                            key={url.name}
                            href={url.url}
                            className="hover:underline"
                          >
                            {url.name}
                            {index < arr.length - 1 ? ", " : ""}
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row flex-wrap gap-2 w-full mt-auto">
                <StyledButton
                  title={`Contact ` + username}
                  action={() => {}}
                  heirarchy="secondary"
                  mode="link"
                  url={generateMailToLink({
                    emailId: item.urls.contactEmail,
                    subject: `Hey ${username} - ${item.title}`,
                    body: `Hi ${username},\n\nSaw your "${item.title}" showcase on Made in Vikhroli. Are you available to discuss a project?\n\nDetails:\n\nBest,`,
                  })}
                  length="full-width"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Work;

const servicesList = [
  {
    title: "Web Development",
    tags: ["small business", "lead generation", "landing page"],
    illustration: websiteServiceIllustration,
    urls: {
      providedByUser: "https://madeinvikhroli.com/members/praxham",
      contactEmail: "prathampatankar1234@gmail.com",
      example: [
        {
          name: "Samsons Music Academy",
          url: "https://samsonsmusicacademy.vercel.app/",
        },
      ],
    },
  },
  {
    title: "Online Store",
    tags: ["small business", "online shop", "online store"],
    illustration: storeServiceIllustration,
    urls: {
      providedByUser: "https://madeinvikhroli.com/members/praxham",
      contactEmail: "prathampatankar1234@gmail.com",
      example: [
        {
          name: "Made in Vikhroli",
          url: "https://madeinvikhroli.com/",
        },
      ],
    },
  },
  {
    title: "Automations",
    tags: ["working professional", "repeating tasks", "excel automations"],
    illustration: automationServiceIllustration,
    urls: {
      providedByUser: "https://madeinvikhroli.com/members/praxham",
      contactEmail: "prathampatankar1234@gmail.com",
      example: [],
    },
  },
  {
    title: "Custom Software Solutions",
    tags: ["small business", "working professional", "customised software"],
    illustration: customSoftwareServiceIllustration,
    urls: {
      providedByUser: "https://madeinvikhroli.com/members/praxham",
      contactEmail: "prathampatankar1234@gmail.com",
      example: [],
    },
  },
  {
    // i aim to help people buy correct computer according to their needs for cheapest
    // possible amount which perfectly suits their workflow and is upgradable by making or helping to make
    // infromed purchasing decision secondhand office pcs, thinkpads etc for usecases like education, work, gaming
    // the charge is the 10% of amount u wouldve spent otherwise
    title: "Custom PC & Laptop Buying Consultation",
    tags: [
      "hardware",
      "secondhand tech",
      "working professional",
      "students",
      "gaming",
    ],
    illustration: pcBuyingServiceIllustration,
    urls: {
      providedByUser: "https://madeinvikhroli.com/members/praxham",
      contactEmail: "prathampatankar1234@gmail.com",
      example: [],
    },
  },
];

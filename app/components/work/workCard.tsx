type WorkCardProps = {
  title: string;
  bgImage: string;
  articleUrl: string;
  headingBgColor: string;
  headingMaxWidth: string;
} & React.ComponentPropsWithoutRef<"a">;

const WorkCard = ({
  title,
  bgImage,
  articleUrl,
  headingBgColor,
  headingMaxWidth,
  className
}: WorkCardProps) => {
  return (
    <a
      key={title}
      style={{ backgroundImage: `url(${bgImage})` }}
      href={articleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group aspect-square md:aspect-auto md:h-[286px] relative flex flex-col justify-center gap-2 bg-cover bg-center bg-no-repeat shadow-[0_4px_2px_0_rgba(0,0,0,0.5)] cursor-pointer ${className}`}
    >
      <div className="bg-black absolute top-2 right-2 w-[36px] aspect-square flex flex-col items-center justify-center rounded-full md:opacity-0 transition-opacity duration-200 md:group-hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="white"
          className="size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>
      <div
        className="flex flex-row justify-between items-center px-4 py-2"
        style={{
          backgroundColor: headingBgColor,
          maxWidth: headingMaxWidth,
        }}
      >
        <span className="font-semibold text-[1rem] sm:text-[2rem] sm:leading-[36px] group-hover:underline">
          {title}
        </span>
      </div>
    </a>
  );
};

export default WorkCard;

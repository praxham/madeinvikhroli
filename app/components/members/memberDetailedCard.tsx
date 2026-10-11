import type { DetailedMember } from "~/types/common";
import CardBG from "../../assets/members/card_bg.png";

const MemberDetailedCard = ({ member }: { member: DetailedMember }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-fit mx-auto text-white">
      <div
        className="w-full aspect-[0.71] lg:w-[396px] lg:h-[557px] relative font-semibold rounded-[50px]"
        style={{ backgroundImage: `url(${CardBG})` }}
      >
        <img
          className="w-[150px] lg:w-[208px] aspect-square rounded-full absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]"
          src={member.profile_photo}
          alt=""
        />
        <h1 className="absolute bottom-[57px] left-[30px] ">
          @{member.username}
        </h1>
        <div className="absolute bottom-[30px] left-[30px] flex flex-row gap-2">
          {member.socials?.map((social, index) => {
            const [platform, handle] = Object.entries(social)[0];
            return (
              <a key={index} href={`https://${platform}.com/${handle}`}>
                {platform === "instagram" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M7.465 1.066C8.638 1.012 9.012 1 12 1s3.362.013 4.534.066s1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12s-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.4 5.4 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066s-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.4 5.4 0 0 1-1.949-1.268a5.4 5.4 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12s.013-3.362.066-4.534s.24-1.972.511-2.672a5.4 5.4 0 0 1 1.27-1.948a5.4 5.4 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511m8.98 1.98c-1.16-.053-1.508-.064-4.445-.064s-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.4 3.4 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445s.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064s3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445s-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.4 3.4 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379m-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986M8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996m10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89"
                      clip-rule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 0h16v16H0z" fill="none" />
                    <path
                      fill="currentColor"
                      d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07l-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
                    />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      </div>
      {member.description && (
        <div
          className="w-full min-h-[400px] aspect-[0.71] lg:w-[396px] lg:h-[557px] relative -scale-x-100 rounded-[50px]"
          style={{ backgroundImage: `url(${CardBG})` }}
        >
          <h1 className="max-w-[366px]  font-medium absolute top-[30px] right-[30px] pr-[30px] line-clamp-[20] -scale-x-100">
            {member.description}
          </h1>
        </div>
      )}
    </div>
  );
};

export default MemberDetailedCard;

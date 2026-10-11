import { useNavigate } from "react-router";
import type { GridMember } from "~/types/common";

const MemberGridCard = ({ member }: { member: GridMember }) => {
  const navigate = useNavigate();
  return (
    <div
      key={member.id}
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => navigate(`/members/${member.username}`)}
    >
      <img
        className="w-full lg:w-[413.33px] aspect-square object-cover"
        src={member.profile_photo}
      />

      {/* Details Container */}
      <div className="flex flex-col gap-2">
        <h1 className="heading2">{member.username}</h1>
      </div>
    </div>
  );
};

export default MemberGridCard;

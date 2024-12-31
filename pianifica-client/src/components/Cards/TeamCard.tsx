import type { Team } from "@/interface";
import Link from "next/link";

type Props = {
  team: Team;
};

const TeamCard = ({ team }: Props) => {
  return (
    <Link href={`/team/${team.id}`} className={"flex flex-row w-max items-center gap-2"}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-1">
          <span className="font-bold">
            {team.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
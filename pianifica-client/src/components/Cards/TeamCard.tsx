import type { Team } from "@/interface";
import { Users } from "lucide-react";
import Link from "next/link";
import UserCard from "./UserCard";

type Props = {
  team: Team;
  size?: "sm" | "md";
  backgroundColor?: string;
};

const TeamCard = ({ team, size = "md", backgroundColor = "bg-gray-200 dark:bg-zinc-900" }: Props) => {
  return (
    <Link href={`/team/${team.id}`} className={`${backgroundColor} dark:border-zinc-600 flex flex-col rounded-lg gap-6  ${size === "sm" ? "w-full p-1" : "max-w-md p-6 m-1 border shadow-md"}`}>
      <div className="w-full flex flex-row items-center gap-2 justify-between">
        <span className="font-bold text-xl">
          {team.name}
        </span>
        <Users />
      </div>
      {size === "md" && (
        <div className="flex flex-col gap-2">
          <div>
            {team.teamManager && (
              <>
                <span className="font-semibold text-lg">Team Manager: </span>
                < UserCard user={team.teamManager} size="sm" />
              </>
            )}
          </div>
          <div>
            {team.teamLead && (
              <>
                <span className="font-semibold text-lg">Team Lead: </span>

                < UserCard user={team.teamLead} size="sm" />
              </>
            )}
          </div>
        </div>
      )}

    </Link>
  );
};

export default TeamCard;
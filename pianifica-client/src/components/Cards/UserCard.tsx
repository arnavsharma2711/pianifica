import type { User } from "@/interface";
import Image from "next/image";
import Link from "next/link";

type Props = {
	user: User;
	tag?: React.ReactNode;
	size?: "sm" | "md";
};

const UserCard = ({ user, size = "sm", tag = null }: Props) => {
	const imageSize = size === "sm" ? 30 : 50;
	const textSize = size === "sm" ? "text-sm" : "text-md";

	return (
		<Link href={`/user/${user.username}`} className={`flex flex-row w-max items-center gap-2 ${textSize}`}>
			<div className={"size-9"}>
				<Image
					src={
						user.profilePictureUrl ||
						"/default-profile-picture.webp"
					}
					alt={user.username || "N/A"}
					width={imageSize}
					height={imageSize}
					className="h-full rounded-full object-cover"
				/>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-row items-center gap-1">
					<span>
						{user.firstName} {user.lastName}
					</span>
					<span>
						{tag}
					</span>
				</div>
				{size === "md" && <span className="text-gray-500">@{user.username}</span>}
			</div>
		</Link>
	);
};

export default UserCard;
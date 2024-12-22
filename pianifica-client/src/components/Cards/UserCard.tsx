import type { User } from "@/interface";
import Image from "next/image";

type Props = {
	user: User;
};

const UserCard = ({ user }: Props) => {
	return (
		<div className="flex gap-2 items-center rounded border p-4 shadow">
			{user.profilePictureUrl && (
				<Image
					src={user.profilePictureUrl || "/default-profile-picture.webp"}
					alt="profile picture"
					width={32}
					height={32}
					className="rounded-full"
				/>
			)}
			<div>
				<h3>{user.username}</h3>
				<p>{user.email}</p>
			</div>
		</div>
	);
};

export default UserCard;

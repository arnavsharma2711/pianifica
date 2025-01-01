import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@/interface';

type Props = {
	user: User
	size?: "sm" | "md" | "lg";
	tag?: React.ReactNode;
};

const UserCard = ({ user, size = "sm", tag }: Props) => {
	const textSize = size === "sm" ? "text-sm" : "text-base";
	const imageSize = size === "sm" ? 24 : 48;

	return (
		<>
			{size !== "lg" ? (
				<Link href={`/user/${user.username}`} className={`flex flex-row w-max items-center gap-2 ${textSize} ${size === "md" ? " w-full" : ""}`}>
					<div className={`${size === "md" ? "size-12" : "size-8"} rounded-full overflow-hidden`}>
						<Image
							src={user.profilePictureUrl || "/default-profile-picture.webp"}
							alt={user.username || "N/A"}
							width={imageSize}
							height={imageSize}
							className="h-full rounded-full object-cover"
						/>
					</div>
					<div className="flex flex-col">
						<div className="flex flex-row items-center gap-1">
							<span className={`${size === "md" ? "font-bold" : ""}`}>
								{user.firstName} {user.lastName}
							</span>
							<span>
								{tag}
							</span>
						</div>
						{size === "md" && <span className="text-gray-500">@{user.username}</span>}
					</div>
				</Link>
			) : (<div className="bg-gray-200 dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden w-72 mx-auto">
				<div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
					<div className="h-28 w-28 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
						<Image
							src={user.profilePictureUrl || '/placeholder.svg?height=96&width=96'}
							alt={`${user.firstName} ${user.lastName}`}
							width={96}
							height={96}
						/>
					</div>
				</div>
				<div className="pt-16 pb-8 px-6 text-center">
					<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
						{user.firstName} {user.lastName}
					</h2>
					<p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">@{user.username}</p>
					<p className="text-gray-600 dark:text-gray-400 mt-4">{user.email}</p>
				</div>
			</div>)}
		</>
	);
};

export default UserCard;

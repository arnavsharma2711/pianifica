"use client";

import { useEffect, useState } from "react";

type Props = {
	params: Promise<{ priority: string }>;
};

const Priority = ({ params }: Props) => {
	const [priority, setPriority] = useState<string | null>(null);
	useEffect(() => {
		params.then((resolvedParams) => {
			setPriority(resolvedParams.priority);
		});
	}, [params]);

	if (!priority) {
		return <div>Loading...</div>;
	}
	return <div>{priority} Priority</div>;
};

export default Priority;

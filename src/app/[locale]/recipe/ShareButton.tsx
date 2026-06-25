"use client";

import { Button } from "@/components/atoms/Button";
import { useState } from "react";
import { LuCheck, LuShare2 } from "react-icons/lu";

export const ShareButton = ({ label, copied }: { label: string; copied: string }) => {
	const [done, setDone] = useState(false);

	const handleShare = async () => {
		await navigator.clipboard.writeText(window.location.href);
		setDone(true);
		setTimeout(() => setDone(false), 2000);
	};

	return (
		<Button variant="outlined" size="small" icon={done ? <LuCheck /> : <LuShare2 />} onClick={handleShare}>
			{done ? copied : label}
		</Button>
	);
};

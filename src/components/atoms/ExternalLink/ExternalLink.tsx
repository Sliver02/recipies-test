import classNames from "classnames";
import type { ReactNode } from "react";
import styles from "./ExternalLink.module.scss";

export interface ExternalLinkProps {
	href: string;
	icon?: ReactNode;
	/** chip — bordered pill (default). youtube — chip with YouTube red. inline — plain icon+text link. */
	variant?: "chip" | "youtube" | "inline";
	children: ReactNode;
	className?: string;
}

export const ExternalLink = ({
	href,
	icon,
	variant = "chip",
	children,
	className,
}: ExternalLinkProps) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className={classNames(styles.link, styles[variant], className)}
	>
		{icon}
		{children}
	</a>
);

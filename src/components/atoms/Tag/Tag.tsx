import classNames from "classnames";
import type { ReactNode } from "react";
import styles from "./Tag.module.scss";

export interface TagProps {
	size?: "sm" | "md";
	children: ReactNode;
	className?: string;
}

export const Tag = ({ size = "sm", children, className }: TagProps) => (
	<span className={classNames(styles.tag, styles[size], className)}>{children}</span>
);

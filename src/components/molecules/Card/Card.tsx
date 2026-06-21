"use client";

import { BaseProps } from "@/common/globalInterfaces";
import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Card.module.scss";

export interface CardProps extends BaseProps {
	/** Optional title shown at the top of the card */
	title?: string;
	/** Optional subtitle shown below the title */
	subtitle?: string;
	/** Optional content (e.g., an icon or button) to display on the top-right corner */
	rightMenu?: ReactNode;
}

/**
 * Card component for displaying content in a structured container.
 * Inspired by the design concept: warm backgrounds, rounded corners, and clear hierarchy.
 */
export const Card = ({ title, subtitle, rightMenu, children, className, ...props }: CardProps) => {
	const hasHeader = title || subtitle || rightMenu;

	return (
		<div className={classNames(styles.card, className)} {...props}>
			{hasHeader && (
				<div className={styles.header}>
					<div className={styles.textContainer}>
						{title && <h3 className={styles.title}>{title}</h3>}
						{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
					</div>
					{rightMenu && <div className={styles.rightMenu}>{rightMenu}</div>}
				</div>
			)}
			{children && <div className={styles.content}>{children}</div>}
		</div>
	);
};

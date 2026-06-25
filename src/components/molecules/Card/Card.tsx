"use client";

import { BaseProps } from "@/common/globalInterfaces";
import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Card.module.scss";

export interface CardProps extends BaseProps {
	title?: string;
	subtitle?: string;
	rightMenu?: ReactNode;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	shadow?: boolean;
	noPadding?: boolean;
}

export const Card = ({
	title,
	subtitle,
	rightMenu,
	children,
	className,
	onClick,
	shadow,
	noPadding,
	...props
}: CardProps) => {
	const hasHeader = title || subtitle || rightMenu;

	return (
		<div
			className={classNames(
				styles.card,
				onClick && styles.clickable,
				shadow && styles.shadow,
				noPadding && styles.noPadding,
				className
			)}
			onClick={onClick}
			{...props}
		>
			{hasHeader && (
				<div className={styles.header}>
					<div className={styles.textContainer}>
						{title && (
							<h3 className={`${styles.title} text--h-xs text--strong`}>{title}</h3>
						)}
						{subtitle && <p className={`${styles.subtitle} text--p-sm`}>{subtitle}</p>}
					</div>
					{rightMenu && <div className={styles.rightMenu}>{rightMenu}</div>}
				</div>
			)}
			{children && <div className={styles.content}>{children}</div>}
		</div>
	);
};

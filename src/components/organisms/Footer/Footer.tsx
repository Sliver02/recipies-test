import { Link } from "@/i18n/routing";
import styles from "./Footer.module.scss";

export interface FooterNavItem {
	href: string;
	label: string;
}

export interface FooterProps {
	navItems?: FooterNavItem[];
	className?: string;
}

export const Footer = ({ navItems, className }: FooterProps) => {
	return (
		<footer className={className}>
			<div className={styles.inner}>
				{navItems && navItems.length > 0 && (
					<nav className={styles.links}>
						{navItems.map(({ href, label }) => (
							<Link key={href} href={href} className={styles.link}>
								{label}
							</Link>
						))}
					</nav>
				)}
			</div>
		</footer>
	);
};

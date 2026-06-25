import { Card } from "@/components/molecules/Card";
import { Background } from "@/components/atoms/Background";
import { ExternalLink } from "@/components/atoms/ExternalLink";
import { Tag } from "@/components/atoms/Tag";
import { Link } from "@/i18n/routing";
import classNames from "classnames";
import Image from "next/image";
import { LuExternalLink } from "react-icons/lu";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import type { ReactNode } from "react";
import type { MealDetail } from "@/types/meal";
import styles from "./RecipeCard.module.scss";

export interface RecipeCardProps {
	meal: MealDetail;
	badge?: "liked" | "disliked";
	onToggle?: () => void;
	actions?: ReactNode;
	className?: string;
}

export const RecipeCard = ({ meal, badge, onToggle, actions, className }: RecipeCardProps) => (
	<Card className={className} title={undefined} rightMenu={actions}>
		<div className={styles.wrapper}>
			<div className={styles.imageWrapper}>
				{meal.strMealThumb ? (
					<Image
						src={meal.strMealThumb}
						alt={meal.strMeal}
						fill
						className={styles.image}
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
				) : (
					<Background />
				)}
				{badge && (
					<button
						className={classNames(styles.heartIcon, styles[badge], {
							[styles.interactive]: !!onToggle,
						})}
						onClick={(e) => {
							e.preventDefault();
							onToggle?.();
						}}
						aria-label={badge === "liked" ? "Mark as disliked" : "Mark as liked"}
					>
						{badge === "liked" ? <HiHeart /> : <HiOutlineHeart />}
					</button>
				)}
			</div>

			<Link href={`/recipe?id=${meal.idMeal}`} className={styles.titleLink}>
				<h3 className="text--h-xs text--strong">{meal.strMeal}</h3>
			</Link>

			<div className={styles.meta}>
				{meal.strArea && <Tag>{meal.strArea}</Tag>}
				{meal.strCategory && <Tag>{meal.strCategory}</Tag>}
			</div>

			{meal.strSource && (
				<ExternalLink href={meal.strSource} icon={<LuExternalLink aria-hidden />} variant="inline">
					View recipe
				</ExternalLink>
			)}
		</div>
	</Card>
);

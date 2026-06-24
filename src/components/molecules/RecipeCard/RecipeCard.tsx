import { Card } from "@/components/molecules/Card";
import { Background } from "@/components/atoms/Background";
import { Link } from "@/i18n/routing";
import classNames from "classnames";
import Image from "next/image";
import { LuExternalLink } from "react-icons/lu";
import type { ReactNode } from "react";
import type { MealDetail } from "@/types/meal";
import styles from "./RecipeCard.module.scss";

export interface RecipeCardProps {
	meal: MealDetail;
	badge?: "liked" | "disliked";
	actions?: ReactNode;
	className?: string;
}

export const RecipeCard = ({ meal, badge, actions, className }: RecipeCardProps) => (
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
			</div>

			<Link href={`/recipe?id=${meal.idMeal}`} className={styles.titleLink}>
				<h3 className="text--h-xs text--strong">{meal.strMeal}</h3>
			</Link>

			<div className={styles.meta}>
				{meal.strArea && <span className={styles.tag}>{meal.strArea}</span>}
				{meal.strCategory && <span className={styles.tag}>{meal.strCategory}</span>}
				{badge && (
					<span className={classNames(styles.badge, styles[badge])}>
						{badge === "liked" ? "Liked" : "Disliked"}
					</span>
				)}
			</div>

			{meal.strSource && (
				<a
					href={meal.strSource}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.sourceLink}
				>
					<LuExternalLink aria-hidden />
					View recipe
				</a>
			)}
		</div>
	</Card>
);

"use client";

import { Button } from "@/components/atoms/Button";
import { Tag } from "@/components/atoms/Tag";
import { Link } from "@/i18n/routing";
import type { MealDetail } from "@/types/meal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
	HiOutlineHeart,
	HiOutlineXCircle,
	HiOutlineRefresh,
	HiOutlineArrowLeft,
} from "react-icons/hi";
import styles from "./RecipeRecommendation.module.scss";

interface RecipeRecommendationProps {
	meal: MealDetail | null;
	loading: boolean;
	error: string | null;
	onLike: () => void;
	onDislike: () => void;
	onNext: () => void;
	onChangeSearch: () => void;
}

export const RecipeRecommendation = ({
	meal,
	loading,
	error,
	onLike,
	onDislike,
	onNext,
	onChangeSearch,
}: RecipeRecommendationProps) => {
	const t = useTranslations("recommendation");

	if (loading) {
		return (
			<div className={styles.stateContainer}>
				<HiOutlineRefresh className={styles.spinner} />
				<p className="text--p-md">{t("loading")}</p>
			</div>
		);
	}

	if (error || !meal) {
		return (
			<div className={styles.stateContainer}>
				<p className="text--p-lg text--strong">{t("noRecipeTitle")}</p>
				<p className="text--p-md">{t("noRecipeSubtitle")}</p>
				<Button fullWidth icon={<HiOutlineArrowLeft />} onClick={onChangeSearch}>
					{t("resetSearch")}
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.result}>
			<div className={styles.imageWrapper}>
				<Image
					src={meal.strMealThumb}
					alt={meal.strMeal}
					fill
					className={styles.image}
					sizes="(max-width: 768px) 100vw, 480px"
				/>
				<Button
					className={styles.refreshBtn}
					color="accent"
					icon={<HiOutlineRefresh />}
					onClick={onNext}
					aria-label={t("newIdea")}
				/>
			</div>

			<div className={styles.info}>
				<Link href={`/recipe?id=${meal.idMeal}`} className={styles.titleLink}>
					<h2 className={`${styles.title} text--h-xs text--strong`}>{meal.strMeal}</h2>
				</Link>
				{(meal.strArea || meal.strCategory) && (
					<div className={styles.chips}>
						{meal.strArea && <Tag>{meal.strArea}</Tag>}
						{meal.strCategory && <Tag>{meal.strCategory}</Tag>}
					</div>
				)}
			</div>

			<p className={`${styles.question} text--p-lg`}>{t("question")}</p>

			<div className={styles.feedback}>
				<Button
					fullWidth
					variant="outlined"
					color="error"
					icon={<HiOutlineXCircle />}
					onClick={onDislike}
				>
					{t("no")}
				</Button>
				<Button fullWidth icon={<HiOutlineHeart />} onClick={onLike}>
					{t("yes")}
				</Button>
			</div>

			<div className={styles.secondaryActions}>
				<Button fullWidth icon={<HiOutlineArrowLeft />} onClick={onChangeSearch}>
					{t("resetSearch")}
				</Button>
			</div>
		</div>
	);
};

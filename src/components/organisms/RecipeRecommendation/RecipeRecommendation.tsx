"use client";

import { Button } from "@/components/atoms/Button";
import { RecipeCard } from "@/components/molecules/RecipeCard";
import type { MealDetail } from "@/types/meal";
import { useTranslations } from "next-intl";
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
	onRetry: () => void;
}

export const RecipeRecommendation = ({
	meal,
	loading,
	error,
	onLike,
	onDislike,
	onNext,
	onChangeSearch,
	onRetry,
}: RecipeRecommendationProps) => {
	const t = useTranslations("recommendation");

	if (loading) {
		return <p className={`${styles.loading} text--p-md`}>{t("loading")}</p>;
	}

	if (error || !meal) {
		return (
			<div className={styles.empty}>
				<h2 className={`${styles.title} text--h-sm`}>{t("noRecipeTitle")}</h2>
				<p className={`${styles.subtitle} text--p-md`}>{t("noRecipeSubtitle")}</p>
				<div className={styles.actions}>
					<Button fullWidth onClick={onRetry}>
						{t("retry")}
					</Button>
					<Button
						fullWidth
						variant="outlined"
						icon={<HiOutlineArrowLeft />}
						onClick={onChangeSearch}
					>
						{t("changeSearch")}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.result}>
			<RecipeCard meal={meal} />

			<p className={styles.question}>{t("question")}</p>

			<div className={styles.feedback}>
				<Button fullWidth icon={<HiOutlineHeart />} onClick={onLike}>
					{t("yes")}
				</Button>
				<Button fullWidth variant="outlined" icon={<HiOutlineXCircle />} onClick={onDislike}>
					{t("no")}
				</Button>
			</div>

			<div className={styles.secondaryActions}>
				<Button variant="text" icon={<HiOutlineRefresh />} onClick={onNext}>
					{t("newIdea")}
				</Button>
				<Button variant="text" icon={<HiOutlineArrowLeft />} onClick={onChangeSearch}>
					{t("changeSearch")}
				</Button>
			</div>
		</div>
	);
};

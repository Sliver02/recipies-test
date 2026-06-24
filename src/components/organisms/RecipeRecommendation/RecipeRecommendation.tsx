"use client";

import { Alert } from "@/components/atoms/Alert";
import { Button } from "@/components/atoms/Button";
import { Col, Container, Row } from "@/components/atoms/Grid";
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
			<Container>
				<Row>
					<Col xs={12}>
						<p className={`${styles.loading} text--p-md`}>{t("loading")}</p>
					</Col>
				</Row>
			</Container>
		);
	}

	if (error || !meal) {
		return (
			<Container>
				<Row>
					<Col xs={12} md={8} lg={6}>
						<Alert severity="info">{error ?? t("noResults")}</Alert>
						<div className={styles.actions}>
							<Button
								variant="outlined"
								icon={<HiOutlineArrowLeft />}
								onClick={onChangeSearch}
							>
								{t("changeSearch")}
							</Button>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}

	return (
		<section className={styles.section}>
			<Container>
				<Row>
					<Col xs={12} md={8} lg={6}>
						<RecipeCard meal={meal} />

						<p className={styles.question}>{t("question")}</p>

						<div className={styles.feedback}>
							<Button icon={<HiOutlineHeart />} onClick={onLike}>
								{t("yes")}
							</Button>
							<Button
								variant="outlined"
								icon={<HiOutlineXCircle />}
								onClick={onDislike}
							>
								{t("no")}
							</Button>
						</div>

						<div className={styles.actions}>
							<Button variant="text" icon={<HiOutlineRefresh />} onClick={onNext}>
								{t("newIdea")}
							</Button>
							<Button
								variant="text"
								icon={<HiOutlineArrowLeft />}
								onClick={onChangeSearch}
							>
								{t("changeSearch")}
							</Button>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

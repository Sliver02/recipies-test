"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRecipes } from "@/context/RecipesContext";
import { Col, Container, Row } from "@/components/atoms/Grid";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { RecipeCard } from "@/components/molecules/RecipeCard";
import type { HistoryEntry, MealDetail } from "@/types/meal";
import styles from "./page.module.scss";

type StatusFilter = "all" | "liked" | "disliked";

function entryToMeal(entry: HistoryEntry): MealDetail {
	return {
		idMeal: entry.id,
		strMeal: entry.title,
		strMealThumb: entry.image,
		strArea: entry.area,
		strCategory: entry.category,
		strSource: null,
		strInstructions: "",
		strYoutube: null,
	};
}

export default function MyRecipesPage() {
	const t = useTranslations("myRecipes");
	const { history, toggleStatus, removeEntry } = useRecipes();
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<StatusFilter>("all");

	const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
		{ value: "all", label: t("filterAll") },
		{ value: "liked", label: t("filterLiked") },
		{ value: "disliked", label: t("filterDisliked") },
	];

	const filtered = useMemo(() => {
		const normalized = query.toLowerCase();
		return history.filter(
			(e) =>
				(filter === "all" || e.status === filter) &&
				(e.title.toLowerCase().includes(normalized) ||
					e.area.toLowerCase().includes(normalized) ||
					e.category.toLowerCase().includes(normalized))
		);
	}, [history, filter, query]);

	const liked = filtered.filter((e) => e.status === "liked");
	const disliked = filtered.filter((e) => e.status === "disliked");

	const showLiked = filter === "all" || filter === "liked";
	const showDisliked = filter === "all" || filter === "disliked";

	return (
		<Container>
			<Row>
				<Col xs={12}>
					<h1 className={`text--h-md ${styles.pageTitle}`}>{t("title")}</h1>
				</Col>
			</Row>

			<Row>
				<Col xs={12} md={7} lg={6}>
					<Input
						label={t("searchLabel")}
						fullWidth
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</Col>
				<Col xs={12} md={5} lg={6}>
					<div className={styles.filters}>
						{STATUS_FILTERS.map(({ value, label }) => (
							<Button
								key={value}
								variant={filter === value ? "contained" : "outlined"}
								size="small"
								onClick={() => setFilter(value)}
							>
								{label}
							</Button>
						))}
					</div>
				</Col>
			</Row>

			{history.length === 0 ? (
				<Row>
					<Col xs={12}>
						<p className={`text--p-md ${styles.empty}`}>{t("empty")}</p>
					</Col>
				</Row>
			) : (
				<>
					{showLiked && (
						<section className={styles.section}>
							<h2 className={`text--h-xs ${styles.sectionTitle} ${styles.liked}`}>
								{t("liked")}
							</h2>
							{liked.length === 0 ? (
								<p className={`text--p-md ${styles.empty}`}>
									{query ? t("emptyLikedFiltered") : t("emptyLiked")}
								</p>
							) : (
								<Row>
									{liked.map((entry) => (
										<Col key={entry.id} xs={12} md={6} lg={4}>
											<RecipeCard
												meal={entryToMeal(entry)}
												badge="liked"
												onToggle={() => toggleStatus(entry.id)}
												onDelete={() => removeEntry(entry.id)}
											/>
										</Col>
									))}
								</Row>
							)}
						</section>
					)}

					{showDisliked && (
						<section className={styles.section}>
							<h2 className={`text--h-xs ${styles.sectionTitle} ${styles.disliked}`}>
								{t("disliked")}
							</h2>
							{disliked.length === 0 ? (
								<p className={`text--p-md ${styles.empty}`}>
									{query ? t("emptyDislikedFiltered") : t("emptyDisliked")}
								</p>
							) : (
								<Row>
									{disliked.map((entry) => (
										<Col key={entry.id} xs={12} md={6} lg={4}>
											<RecipeCard
												meal={entryToMeal(entry)}
												badge="disliked"
												onToggle={() => toggleStatus(entry.id)}
												onDelete={() => removeEntry(entry.id)}
											/>
										</Col>
									))}
								</Row>
							)}
						</section>
					)}
				</>
			)}
		</Container>
	);
}

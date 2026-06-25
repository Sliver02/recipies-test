"use client";

import { SearchWizard } from "@/components/organisms/SearchWizard";
import { RecipeRecommendation } from "@/components/organisms/RecipeRecommendation";
import { useRecipes } from "@/context/RecipesContext";
import { useMealMatcher } from "@/hooks/useMealMatcher";
import { useState } from "react";
import type { SearchState } from "@/types/meal";
import { Container } from "@/components/atoms/Grid/Container/Container";
import { Row } from "@/components/atoms/Grid/Row/Row";
import { Col } from "@/components/atoms/Grid/Col/Col";
import { Justify } from "@/components/atoms/Grid/interfaces";

const INITIAL: SearchState = { area: "", category: "", step: 0 };

export default function Page() {
	const { currentSearch, setCurrentSearch, clearSearch, addEntry, history } = useRecipes();
	const [search, setSearch] = useState<SearchState>(currentSearch ?? INITIAL);

	const submitted = search.step === 2;
	const excludeIds = history.map((e) => e.id);

	const { meal, loading, error, next } = useMealMatcher({
		area: submitted ? search.area : "",
		category: submitted ? search.category : "",
		excludeIds,
	});

	const handleChange = (s: SearchState) => {
		setSearch(s);
		setCurrentSearch(s);
	};

	const handleSubmit = () => {
		const s = { ...search, step: 2 };
		setSearch(s);
		setCurrentSearch(s);
	};

	const handleChangeSearch = () => {
		const s = { ...search, step: 0 };
		setSearch(s);
		clearSearch();
	};

	const handleRetry = () => {
		setSearch(INITIAL);
		clearSearch();
	};

	const handleLike = () => {
		if (!meal) return;
		addEntry({
			id: meal.idMeal,
			title: meal.strMeal,
			image: meal.strMealThumb,
			timestamp: Date.now(),
			area: search.area,
			category: search.category,
			status: "liked",
		});
		next();
	};

	const handleDislike = () => {
		if (!meal) return;
		addEntry({
			id: meal.idMeal,
			title: meal.strMeal,
			image: meal.strMealThumb,
			timestamp: Date.now(),
			area: search.area,
			category: search.category,
			status: "disliked",
		});
		next();
	};

	if (submitted) {
		return (
			<RecipeRecommendation
				meal={meal}
				loading={loading}
				error={error}
				onLike={handleLike}
				onDislike={handleDislike}
				onNext={next}
				onChangeSearch={handleChangeSearch}
				onRetry={handleRetry}
			/>
		);
	}

	return (
		<Container>
			<Row xsJustify={Justify.center}>
				<Col xs={12} lg={6} xl={5}>
					<SearchWizard value={search} onChange={handleChange} onSubmit={handleSubmit} />
				</Col>
			</Row>
		</Container>
	);
}

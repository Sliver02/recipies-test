"use client";

import { Autocomplete } from "@/components/atoms/Autocomplete";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import { Stepper } from "@/components/molecules/Stepper";
import { RecipeRecommendation } from "@/components/organisms/RecipeRecommendation";
import { useRecipes } from "@/context/RecipesContext";
import { useMealMatcher } from "@/hooks/useMealMatcher";
import type { AutocompleteOption } from "@/components/atoms/Autocomplete";
import type { SearchState } from "@/types/meal";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuSearch, LuChevronRight } from "react-icons/lu";
import styles from "./SearchWizard.module.scss";

const INITIAL: SearchState = { area: "", category: "", step: 0 };

enum SearchWizardStep {
	Area = 0,
	Category = 1,
	Results = 2,
}

interface SearchWizardStepProps {
	title: string;
	content: React.ReactNode;
}

export const SearchWizard = () => {
	const t = useTranslations("wizard");
	const { currentSearch, setCurrentSearch, clearSearch, addEntry, history } = useRecipes();

	const [search, setSearch] = useState<SearchState>(currentSearch ?? INITIAL);

	const submitted = search.step === SearchWizardStep.Results;
	const excludeIds = history.map((e) => e.id);

	const { meal, loading, error, next } = useMealMatcher({
		area: submitted ? search.area : "",
		category: submitted ? search.category : "",
		excludeIds,
	});

	const [areas, setAreas] = useState<AutocompleteOption[]>([]);
	const [categories, setCategories] = useState<AutocompleteOption[]>([]);
	const [loadingAreas, setLoadingAreas] = useState(false);
	const [loadingCategories, setLoadingCategories] = useState(false);

	useEffect(() => {
		const load = async () => {
			setLoadingAreas(true);
			try {
				const r = await fetch("/api/meals/list?type=areas");
				const list: string[] = await r.json();
				setAreas(list.map((a) => ({ value: a, label: a })));
			} finally {
				setLoadingAreas(false);
			}
		};
		load();
	}, []);

	useEffect(() => {
		if (search.step < SearchWizardStep.Category) return;
		const load = async () => {
			setLoadingCategories(true);
			try {
				const r = await fetch("/api/meals/list?type=categories");
				const list: string[] = await r.json();
				setCategories(list.map((c) => ({ value: c, label: c })));
			} finally {
				setLoadingCategories(false);
			}
		};
		load();
	}, [search.step]);

	const update = (s: SearchState) => {
		setSearch(s);
		setCurrentSearch(s);
	};

	const setStep = (step: number) => update({ ...search, step });
	const setArea = (area: string) => update({ ...search, area });
	const setCategory = (category: string) => update({ ...search, category });

	const handleSubmit = () => update({ ...search, step: 2 });

	const handleChangeSearch = () => {
		setSearch(INITIAL);
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

	const areaStep = (
		<>
			<h1 className={`${styles.title} text--h-sm`}>{t("step1Title")}</h1>
			<div className={styles.field}>
				<Autocomplete
					label={t("step1Label")}
					placeholder={loadingAreas ? t("loading") : t("step1Placeholder")}
					options={areas}
					value={search.area}
					onValueChange={setArea}
					fullWidth
					disabled={loadingAreas}
				/>
			</div>
		</>
	);

	const categoryStep = (
		<>
			<h1 className={`${styles.title} text--h-sm`}>{t("step2Title")}</h1>
			<div className={styles.field}>
				<Autocomplete
					label={t("step2Label")}
					placeholder={loadingCategories ? t("loading") : t("step2Placeholder")}
					options={loadingCategories ? [] : categories}
					value={search.category}
					onValueChange={(val) => setCategory(val as string)}
					fullWidth
					disabled={loadingCategories}
				/>
			</div>
			<button className={styles.backLink} onClick={() => setStep(SearchWizardStep.Area)}>
				<LuChevronLeft size={14} />
				{t("back")}
			</button>
		</>
	);

	const resultsStep = (
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

	const steps: SearchWizardStepProps[] = [
		{ title: t("steps.area"), content: areaStep },
		{ title: t("steps.category"), content: categoryStep },
		{ title: t("steps.results"), content: resultsStep },
	];

	return (
		<Card shadow noPadding>
			{!(submitted && loading) && (
				<div className={styles.stepperWrapper}>
					<Stepper steps={steps.map((step) => step.title)} currentStep={search.step} />
				</div>
			)}

			<div className={styles.content}>{steps[search.step]?.content}</div>

			{search.step < SearchWizardStep.Results && (
				<div className={styles.footer}>
					{search.step === SearchWizardStep.Area && (
						<Button
							fullWidth
							size="large"
							icon={<LuChevronRight />}
							iconPosition="end"
							disabled={!search.area}
							onClick={() => setStep(SearchWizardStep.Category)}
						>
							{t("next")}
						</Button>
					)}
					{search.step === SearchWizardStep.Category && (
						<Button
							fullWidth
							size="large"
							icon={<LuSearch />}
							iconPosition="end"
							disabled={!search.category}
							onClick={handleSubmit}
						>
							{t("submit")}
						</Button>
					)}
				</div>
			)}
		</Card>
	);
};

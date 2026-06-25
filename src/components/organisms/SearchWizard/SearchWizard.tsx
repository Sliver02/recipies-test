"use client";

import { Autocomplete } from "@/components/atoms/Autocomplete";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Card } from "@/components/molecules/Card";
import { Stepper } from "@/components/molecules/Stepper";
import type { AutocompleteOption } from "@/components/atoms/Autocomplete";
import type { SelectOption } from "@/components/atoms/Select";
import type { SearchState } from "@/types/meal";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuSearch, LuChevronRight } from "react-icons/lu";
import styles from "./SearchWizard.module.scss";

interface SearchWizardProps {
	value: SearchState;
	onChange: (s: SearchState) => void;
	onSubmit: () => void;
}

interface SearchWizardStepProps {
	title: string;
	content: React.ReactNode;
}

export const SearchWizard = ({ value, onChange, onSubmit }: SearchWizardProps) => {
	const t = useTranslations("wizard");

	const [areas, setAreas] = useState<AutocompleteOption[]>([]);
	const [categories, setCategories] = useState<SelectOption[]>([]);
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
		if (value.step < 1) return;
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
	}, [value.step]);

	const setStep = (step: number) => onChange({ ...value, step });
	const setArea = (area: string) => onChange({ ...value, area });
	const setCategory = (category: string) => onChange({ ...value, category });

	const areaStep = (
		<>
			<h1 className={`${styles.title} text--h-sm`}>{t("step1Title")}</h1>
			<div className={styles.field}>
				<Autocomplete
					label={t("step1Label")}
					placeholder={loadingAreas ? t("loading") : t("step1Placeholder")}
					options={areas}
					value={value.area}
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
					value={value.category}
					onValueChange={(val) => setCategory(val as string)}
					fullWidth
					disabled={loadingCategories}
				/>
			</div>
			<button className={styles.backLink} onClick={() => setStep(0)}>
				<LuChevronLeft size={14} />
				{t("back")}
			</button>
		</>
	);

	const steps: SearchWizardStepProps[] = [
		{ title: t("steps.area"), content: areaStep },
		{ title: t("steps.category"), content: categoryStep },
		{ title: t("steps.results"), content: null },
	];

	return (
		<section className={styles.wizard}>
			<Card shadow noPadding className={styles.card}>
				<div className={styles.stepperWrapper}>
					<Stepper steps={steps.map((step) => step.title)} currentStep={value.step} />
				</div>

				<div className={styles.content}>{steps[value?.step]?.content}</div>

				<div className={styles.footer}>
					{value.step === 0 && (
						<Button
							fullWidth
							size="large"
							icon={<LuChevronRight />}
							iconPosition="end"
							disabled={!value.area}
							onClick={() => setStep(1)}
						>
							{t("next")}
						</Button>
					)}
					{value.step === 1 && (
						<Button
							fullWidth
							size="large"
							icon={<LuSearch />}
							iconPosition="end"
							disabled={!value.category}
							onClick={onSubmit}
						>
							{t("submit")}
						</Button>
					)}
				</div>
			</Card>
		</section>
	);
};

"use client";

import { Autocomplete } from "@/components/atoms/Autocomplete";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Col, Container, Row } from "@/components/atoms/Grid";
import type { AutocompleteOption } from "@/components/atoms/Autocomplete";
import type { SelectOption } from "@/components/atoms/Select";
import type { SearchState } from "@/types/meal";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LuChevronRight, LuChevronLeft, LuSearch } from "react-icons/lu";
import styles from "./SearchWizard.module.scss";

interface SearchWizardProps {
	value: SearchState;
	onChange: (s: SearchState) => void;
	onSubmit: () => void;
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

	return (
		<section className={styles.wizard}>
			<Container>
				<Row>
					<Col xs={12} md={8} lg={6}>
						<p className={styles.stepIndicator}>
							{t("stepOf", { current: value.step + 1, total: 2 })}
						</p>

						{value.step === 0 && (
							<>
								<h1 className={`${styles.title} text--h-md`}>{t("step1Title")}</h1>
								<div className={styles.field}>
									<Autocomplete
										label={t("step1Label")}
										placeholder={
											loadingAreas ? t("loading") : t("step1Placeholder")
										}
										options={areas}
										value={value.area}
										onValueChange={setArea}
										fullWidth
										disabled={loadingAreas}
									/>
								</div>
								<div className={styles.actions}>
									<Button
										icon={<LuChevronRight />}
										iconPosition="end"
										disabled={!value.area}
										onClick={() => setStep(1)}
									>
										{t("next")}
									</Button>
								</div>
							</>
						)}

						{value.step === 1 && (
							<>
								<h1 className={`${styles.title} text--h-md`}>{t("step2Title")}</h1>
								<div className={styles.field}>
									<Select
										label={t("step2Label")}
										options={loadingCategories ? [] : categories}
										value={value.category}
										onValueChange={(val) => setCategory(val as string)}
										fullWidth
										disabled={loadingCategories}
									/>
								</div>
								<div className={styles.actions}>
									<Button
										variant="outlined"
										icon={<LuChevronLeft />}
										iconPosition="start"
										onClick={() => setStep(0)}
									>
										{t("back")}
									</Button>
									<Button
										icon={<LuSearch />}
										iconPosition="end"
										disabled={!value.category}
										onClick={onSubmit}
									>
										{t("submit")}
									</Button>
								</div>
							</>
						)}
					</Col>
				</Row>
			</Container>
		</section>
	);
};

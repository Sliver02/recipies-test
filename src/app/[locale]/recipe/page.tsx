import { Col, Container, Row } from "@/components/atoms/Grid";
import { Justify } from "@/components/atoms/Grid/interfaces";
import { ExternalLink } from "@/components/atoms/ExternalLink";
import { Tag } from "@/components/atoms/Tag";
import { IngredientList } from "@/components/molecules/IngredientList";
import { Link } from "@/i18n/routing";
import type { MealDetail } from "@/types/meal";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LuChevronLeft, LuExternalLink, LuYoutube } from "react-icons/lu";
import { ShareButton } from "./ShareButton";
import styles from "./page.module.scss";

const BASE = "https://www.themealdb.com/api/json/v1/1";

async function getMeal(id: string): Promise<MealDetail | null> {
	try {
		const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		const data = await res.json();
		return data.meals?.[0] ?? null;
	} catch {
		return null;
	}
}

function getIngredients(meal: MealDetail) {
	return Array.from({ length: 20 }, (_, i) => i + 1)
		.map((i) => ({
			name: (meal[`strIngredient${i}`] as string | null)?.trim() ?? "",
			measure: (meal[`strMeasure${i}`] as string | null)?.trim() ?? "",
		}))
		.filter(({ name }) => name.length > 0);
}

export default async function RecipePage({
	searchParams,
}: {
	searchParams: Promise<{ id?: string }>;
}) {
	const { id } = await searchParams;
	const t = await getTranslations("recipeDetail");

	if (!id) {
		return (
			<Container>
				<p className={styles.notFound}>{t("notFound")}</p>
			</Container>
		);
	}

	const meal = await getMeal(id);

	if (!meal) {
		return (
			<Container>
				<p className={styles.notFound}>{t("notFound")}</p>
			</Container>
		);
	}

	const ingredients = getIngredients(meal);
	const paragraphs = meal.strInstructions
		.split(/\r?\n/)
		.map((s) => s.trim())
		.filter(Boolean);

	return (
		<div className={styles.page}>
			<Container>
				<Row xsJustify={Justify.center}>
					<Col xs={12} xl={10}>
						<Link href="/my-recipes" className={styles.backLink}>
							<LuChevronLeft size={14} />
							{t("back")}
						</Link>

						<article className={styles.card}>
							<div className={styles.hero}>
								<Image
									src={meal.strMealThumb}
									alt={meal.strMeal}
									fill
									priority
									className={styles.heroImage}
									sizes="(max-width: 768px) 100vw, 90vw"
								/>
							</div>

							<div className={styles.content}>
								<header className={styles.header}>
									<div className={styles.titleRow}>
										<h1 className={`${styles.title} text--h-md text--strong`}>
											{meal.strMeal}
										</h1>

										<div className={styles.meta}>
											<div className={styles.tags}>
												{meal.strArea && (
													<Tag size="md">{meal.strArea}</Tag>
												)}
												{meal.strCategory && (
													<Tag size="md">{meal.strCategory}</Tag>
												)}
											</div>

											<div className={styles.actions}>
												<ShareButton
													label={t("share")}
													copied={t("shareCopied")}
												/>
												{meal.strSource && (
													<ExternalLink
														href={meal.strSource}
														icon={<LuExternalLink size={13} />}
													>
														{t("viewSource")}
													</ExternalLink>
												)}
												{meal.strYoutube && (
													<ExternalLink
														href={meal.strYoutube}
														icon={<LuYoutube size={14} />}
														variant="youtube"
													>
														{t("watchVideo")}
													</ExternalLink>
												)}
											</div>
										</div>
									</div>
								</header>

								<div className={styles.body}>
									<section aria-labelledby="ingredients-title">
										<h2
											id="ingredients-title"
											className={`${styles.sectionTitle} text--h-xs text--strong`}
										>
											{t("ingredients")}
										</h2>
										<IngredientList ingredients={ingredients} />
									</section>

									<section aria-labelledby="instructions-title">
										<h2
											id="instructions-title"
											className={`${styles.sectionTitle} text--h-xs text--strong`}
										>
											{t("instructions")}
										</h2>
										<div className={styles.instructionsParagraphs}>
											{paragraphs.map((para, i) => (
												<p key={i} className={styles.instructionParagraph}>
													{para}
												</p>
											))}
										</div>
									</section>
								</div>
							</div>
						</article>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

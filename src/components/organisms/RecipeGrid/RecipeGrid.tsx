"use client";

import { Col, Container, Row } from "@/components/atoms/Grid";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { HiOutlineChevronRight, HiOutlineHeart } from "react-icons/hi";
import styles from "./RecipeGrid.module.scss";
import Image from "next/image";

const RECIPES = [
	{
		id: 1,
		title: "Berry Blast Smoothie",
		subtitle: "5 mins • Easy",
		image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop",
		description: "A refreshing blend of seasonal berries and greek yogurt.",
	},
	{
		id: 2,
		title: "Avocado Toast Deluxe",
		subtitle: "10 mins • Beginner",
		image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop",
		description: "Creamy avocado on sourdough with poached egg and seeds.",
	},
	{
		id: 3,
		title: "Quinoa Buddha Bowl",
		subtitle: "25 mins • Medium",
		image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
		description: "Nutritious bowl with quinoa, roasted veggies, and tahini.",
	},
];

export const RecipeGrid = () => {
	return (
		<section className={styles.section}>
			<Container>
				<Row className={styles.headerRow}>
					<Col xs={12} md={8}>
						<h2 className="text--h-md">Trending Recipes</h2>
						<p className="text--p-md">
							Explore our community`s favorite healthy picks for this week.
						</p>
					</Col>
					<Col xs={12} md={4} className={styles.buttonCol}>
						<Button
							variant="outlined"
							icon={<HiOutlineChevronRight />}
							iconPosition="end"
						>
							See all recipes
						</Button>
					</Col>
				</Row>

				<Row>
					{RECIPES.map((recipe) => (
						<Col key={recipe.id} xs={12} md={6} lg={4}>
							<Card
								title={recipe.title}
								subtitle={recipe.subtitle}
								rightMenu={<HiOutlineHeart className={styles.favoriteIcon} />}
								className={styles.recipeCard}
							>
								<div className={styles.imageWrapper}>
									<Image
										src={recipe.image}
										alt={recipe.title}
										height={200}
										width={300}
										style={{ objectFit: "cover" }}
									/>
								</div>
								<p className={styles.description}>{recipe.description}</p>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		</section>
	);
};

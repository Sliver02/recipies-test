export interface MealSummary {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
}

export interface MealDetail {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	strCategory: string;
	strArea: string;
	strSource: string | null;
	strInstructions: string;
	strYoutube: string | null;
	// Ingredients: TheMealDB uses strIngredient1..20 + strMeasure1..20
	[key: string]: string | null;
}

export interface HistoryEntry {
	id: string;
	title: string;
	image: string;
	timestamp: number;
	area: string;
	category: string;
	status: "liked" | "disliked";
}

export interface SearchState {
	area: string;
	category: string;
	step: number;
}

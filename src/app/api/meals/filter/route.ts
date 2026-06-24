import { NextRequest, NextResponse } from "next/server";
import type { MealSummary } from "@/types/meal";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const area = searchParams.get("a");
	const category = searchParams.get("c");

	if (!area && !category) {
		return NextResponse.json(
			{ error: "Provide ?a= (area) or ?c= (category)" },
			{ status: 400 }
		);
	}

	const param = area ? `a=${encodeURIComponent(area)}` : `c=${encodeURIComponent(category!)}`;
	const res = await fetch(`${BASE}/filter.php?${param}`, { next: { revalidate: 3600 } });

	if (!res.ok) {
		return NextResponse.json({ error: "TheMealDB request failed" }, { status: 502 });
	}

	const data = await res.json();
	const meals: MealSummary[] = (data.meals ?? []).map(
		(m: { idMeal: string; strMeal: string; strMealThumb: string }) => ({
			idMeal: m.idMeal,
			strMeal: m.strMeal,
			strMealThumb: m.strMealThumb,
		})
	);

	return NextResponse.json(meals);
}

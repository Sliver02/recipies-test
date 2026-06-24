import { NextRequest, NextResponse } from "next/server";
import type { MealDetail } from "@/types/meal";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`, {
		next: { revalidate: 3600 },
	});

	if (!res.ok) {
		return NextResponse.json({ error: "TheMealDB request failed" }, { status: 502 });
	}

	const data = await res.json();
	const meal: MealDetail | null = data.meals?.[0] ?? null;

	if (!meal) {
		return NextResponse.json({ error: "Meal not found" }, { status: 404 });
	}

	return NextResponse.json(meal);
}

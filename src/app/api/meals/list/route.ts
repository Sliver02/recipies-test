import { NextRequest, NextResponse } from "next/server";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function GET(req: NextRequest) {
	const type = req.nextUrl.searchParams.get("type");

	if (type !== "areas" && type !== "categories") {
		return NextResponse.json(
			{ error: "type must be 'areas' or 'categories'" },
			{ status: 400 }
		);
	}

	const param = type === "areas" ? "a" : "c";
	const res = await fetch(`${BASE}/list.php?${param}=list`, { next: { revalidate: 3600 } });

	if (!res.ok) {
		return NextResponse.json({ error: "TheMealDB request failed" }, { status: 502 });
	}

	const data = await res.json();
	const key = type === "areas" ? "strArea" : "strCategory";
	const list: string[] = (data.meals ?? []).map((m: Record<string, string>) => m[key]);

	return NextResponse.json(list);
}

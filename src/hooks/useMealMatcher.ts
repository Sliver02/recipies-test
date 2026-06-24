"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MealDetail, MealSummary } from "@/types/meal";

interface UseMealMatcherInput {
	area: string;
	category: string;
	excludeIds: string[];
}

interface UseMealMatcherResult {
	meal: MealDetail | null;
	loading: boolean;
	error: string | null;
	next: () => void;
}

// Fisher-Yates shuffle in-place
function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

async function fetchSummaries(param: string): Promise<MealSummary[]> {
	const res = await fetch(`/api/meals/filter?${param}`);
	if (!res.ok) return [];
	return res.json();
}

async function fetchDetail(id: string): Promise<MealDetail | null> {
	const res = await fetch(`/api/meals/${id}`);
	if (!res.ok) return null;
	return res.json();
}

export function useMealMatcher({
	area,
	category,
	excludeIds,
}: UseMealMatcherInput): UseMealMatcherResult {
	const [meal, setMeal] = useState<MealDetail | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Holds the shuffled candidate list and current index across next() calls
	const candidates = useRef<string[]>([]);
	const index = useRef(0);

	const loadCandidate = useCallback(async () => {
		while (true) {
			if (candidates.current.length === 0 || index.current >= candidates.current.length) {
				setMeal(null);
				setError("No more recipes found for these criteria.");
				return;
			}

			setLoading(true);
			setError(null);

			const id = candidates.current[index.current];
			const detail = await fetchDetail(id);

			setLoading(false);

			if (detail) {
				setMeal(detail);
				return;
			}

			// skip broken entry and try the next one
			index.current += 1;
		}
	}, []);

	// Rebuild candidate list whenever area, category, or excludeIds change
	useEffect(() => {
		if (!area || !category) return;

		let cancelled = false;

		const run = async () => {
			await Promise.resolve(); // defer first setState out of the synchronous effect tick
			setLoading(true);
			setError(null);
			setMeal(null);

			const [areaResults, categoryResults] = await Promise.all([
				fetchSummaries(`a=${encodeURIComponent(area)}`),
				fetchSummaries(`c=${encodeURIComponent(category)}`),
			]);

			if (cancelled) return;

			const areaIds = new Set(areaResults.map((m) => m.idMeal));
			const categoryIds = new Set(categoryResults.map((m) => m.idMeal));

			// Intersection first; fall back to union if empty
			let pool = [...areaIds].filter((id) => categoryIds.has(id));
			if (pool.length === 0) {
				pool = [...new Set([...areaIds, ...categoryIds])];
			}

			// Remove already seen
			const filtered = pool.filter((id) => !excludeIds.includes(id));

			if (filtered.length === 0) {
				setLoading(false);
				setError("No new recipes found for these criteria.");
				return;
			}

			candidates.current = shuffle(filtered);
			index.current = 0;

			await loadCandidate();
		};

		run();

		return () => {
			cancelled = true;
		};
		// ponytail: excludeIds intentionally excluded — we don't re-fetch filters on every like/dislike;
		// next() advances the pre-built list instead. Re-include if you want live exclusion on every status change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [area, category, loadCandidate]);

	const next = useCallback(() => {
		index.current += 1;
		loadCandidate();
	}, [loadCandidate]);

	return { meal, loading, error, next };
}

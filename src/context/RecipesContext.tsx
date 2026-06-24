"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { HistoryEntry, SearchState } from "@/types/meal";

const STORAGE_KEY = "recipe-history";

interface RecipesContextValue {
	history: HistoryEntry[];
	currentSearch: SearchState | null;
	addEntry: (entry: HistoryEntry) => void;
	removeEntry: (id: string) => void;
	toggleStatus: (id: string) => void;
	setCurrentSearch: (search: SearchState) => void;
	clearSearch: () => void;
}

const RecipesContext = createContext<RecipesContextValue | null>(null);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [currentSearch, setCurrentSearchState] = useState<SearchState | null>(null);
	const hydrated = useRef(false);

	// Load from localStorage once on mount (client only)
	useEffect(() => {
		const loadHistory = () => {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) setHistory(JSON.parse(raw));
			} catch {
				// corrupt storage — start fresh
			}
		};

		loadHistory();

		hydrated.current = true;
	}, []);

	// Persist history to localStorage whenever it changes (after hydration)
	useEffect(() => {
		if (!hydrated.current) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
		} catch {
			// storage full or unavailable — silently skip
		}
	}, [history]);

	const addEntry = (entry: HistoryEntry) =>
		setHistory((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)]);

	const removeEntry = (id: string) => setHistory((prev) => prev.filter((e) => e.id !== id));

	const toggleStatus = (id: string) =>
		setHistory((prev) =>
			prev.map((e) =>
				e.id === id ? { ...e, status: e.status === "liked" ? "disliked" : "liked" } : e
			)
		);

	const setCurrentSearch = (search: SearchState) => setCurrentSearchState(search);
	const clearSearch = () => setCurrentSearchState(null);

	return (
		<RecipesContext.Provider
			value={{
				history,
				currentSearch,
				addEntry,
				removeEntry,
				toggleStatus,
				setCurrentSearch,
				clearSearch,
			}}
		>
			{children}
		</RecipesContext.Provider>
	);
}

export function useRecipes(): RecipesContextValue {
	const ctx = useContext(RecipesContext);
	if (!ctx) throw new Error("useRecipes must be used inside RecipesProvider");
	return ctx;
}

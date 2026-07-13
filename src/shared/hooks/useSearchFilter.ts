import { useMemo } from "react";

export function useSearchFilter<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string,
): T[] {
  return useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) => getSearchableText(item).toLowerCase().includes(normalizedQuery));
  }, [items, query, getSearchableText]);
}

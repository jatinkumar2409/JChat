import { useMemo } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

export function useDb() {
  const sqlite = useSQLiteContext();

  return useMemo(() => drizzle(sqlite), [sqlite]);
}
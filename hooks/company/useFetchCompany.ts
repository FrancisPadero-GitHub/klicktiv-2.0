import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/database.types"

// ─── Types ───────────────────────────────────────────────────────────────────

export type CompanyRow = Database["public"]["Tables"]["companies"]["Row"]

export interface CompanyColumns {
  id: string
  name: string | null
}

// ─── Query Key ────────────────────────────────────────────────────────────────

export const companyQueryKey = (companyId?: string) =>
  ["companies", "detail", companyId ?? null] as const

// ─── Query Fn ─────────────────────────────────────────────────────────────────

export async function fetchCompanyById(companyId: string): Promise<CompanyColumns> {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name")
    .eq("id", companyId)
    .single()

  if (error) {
    throw new Error(error.message || "Failed to fetch company")
  }

  return data as CompanyColumns
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFetchCompany(companyId?: string) {
  return useQuery<CompanyColumns, Error>({
    queryKey: companyQueryKey(companyId),
    queryFn: () => {
      if (!companyId) {
        throw new Error("Company ID is missing from user session")
      }
      return fetchCompanyById(companyId)
    },
    enabled: Boolean(companyId),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}

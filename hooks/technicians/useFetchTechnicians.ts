import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-context-provider";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianDetailRow =
  Database["public"]["Tables"]["technicians"]["Row"];

/** You might be asking why I don't put
 * .is("deleted_at", null) in the query to exclude deleted technicians.
 * The reason is that I want to fetch all technicians, including those that are soft-deleted,
 * so that I can determine which ones are deleted and show them differently in the UI.
 * 
 * UPDATED 5/27/25: I have new plans on this to also mark them as "deleted" in date filters also
 */

export const fetchTechnicians = async (
  companyId: string,
): Promise<TechnicianDetailRow[]> => {
  const { data: result, error } = await supabase
    .from("technicians")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch technicians");
  }

  return result as TechnicianDetailRow[];
};

export function useFetchTechnicians() {
  const { company_id } = useAuth();

  return useQuery<TechnicianDetailRow[], Error>({
    queryKey: ["technicians", "details", company_id ?? null],
    queryFn: () => {
      if (!company_id) {
        throw new Error("Company ID is missing from user session");
      }

      return fetchTechnicians(company_id);
    },
    enabled: Boolean(company_id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

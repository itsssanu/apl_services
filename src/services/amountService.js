import { supabase } from "../lib/supabase";

export async function getAmountSummary(filters, page, limit) {
  const { data, error } = await supabase.rpc(
    "get_amount_summary",
    {
      p_name: filters.name || "",
      p_start_date: filters.startDate || null,
      p_end_date: filters.endDate || null,
      p_page: page,
      p_limit: limit
    }
  );

  if (error) throw error;

  return {
    data: data || [],
    count: data?.length || 0
  };
}
import { supabase } from "../lib/supabase";

export async function getAmountSummary(filters, page, limit) {
  let query = supabase
    .from("work_items")
    .select("*", { count: "exact" });

  if (filters.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }

  if (filters.startDate) {
    query = query.gte("work_date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("work_date", filters.endDate);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query
    .order("work_date", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data,
    count
  };
}
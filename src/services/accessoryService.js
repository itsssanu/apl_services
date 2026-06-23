import { supabase } from "../lib/supabase";

export async function getAccessories(filters = {}, page = 1, limit = 50) {
  let query = supabase
    .from("accessories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.workType)
    query = query.eq("work_type", filters.workType);

  if (filters.name)
    query = query.ilike("product_name", `%${filters.name}%`);

  if (filters.startDate)
    query = query.gte("buy_date", filters.startDate);

  if (filters.endDate)
    query = query.lte("buy_date", filters.endDate);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data,
    count
  };
}

export async function createAccessory(item) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("accessories")
    .insert({
      user_id: user.id,
      work_type: item.workType,
      buy_date: item.buyDate,
      product_name: item.productName,
      amount: item.amount
    });

  if (error) throw error;
}

export async function updateAccessory(id, item) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("accessories")
    .update({
      work_type: item.workType,
      buy_date: item.buyDate,
      product_name: item.productName,
      amount: item.amount
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw error;
}

export async function deleteAccessory(id) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("accessories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw error;
}
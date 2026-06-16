import { supabase } from '../lib/supabase';

export async function getWorkItems(filters = {}, page = 1, limit = 20) {
  let query = supabase
    .from("work_items")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.workType) {
    query = query.eq("work_type", filters.workType);
  }

  if (filters.priority) {
    query = query.eq("priority", filters.priority);
  }

  if (filters.startDate) {
    query = query.gte("work_date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("work_date", filters.endDate);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data,
    count,
  };
}

export async function createWorkItem(item) {
  const { data, error } = await supabase
    .from('work_items')
    .insert([
      {
        name: item.name,
        phone: item.phone || null,
        city: item.city || null,
        status: item.status || null,
        work_type: item.workType || null,
        comments: item.comments || null,
        work_date: item.date || null,
        priority: item.priority || null,
        due_date: item.dueDate || null,
        reminder: item.reminder || null,
        service_amount: Number(item.serviceAmount) || 0,
        service_paid: Number(item.servicePaid) || 0,
        service_balance: Number(item.serviceBalance) || 0,

        accessories_amount: Number(item.accessoriesAmount) || 0,
        accessories_paid: Number(item.accessoriesPaid) || 0,
        accessories_balance: Number(item.accessoriesBalance) || 0,

        accessories: item.accessories
      }
    ])
    .select();

  if (error) throw error;

  return data[0];
}

export async function updateWorkItem(id, item) {
  const { data, error } = await supabase
    .from('work_items')
    .update({
      name: item.name,
      phone: item.phone || null,
      city: item.city || null,
      status: item.status || null,
      work_type: item.workType || null,
      comments: item.comments || null,
      work_date: item.date || null,
      priority: item.priority || null,
      due_date: item.dueDate || null,
      reminder: item.reminder || null,
      service_amount: Number(item.serviceAmount) || 0,
      service_paid: Number(item.servicePaid) || 0,
      service_balance: Number(item.serviceBalance) || 0,

      accessories_amount: Number(item.accessoriesAmount) || 0,
      accessories_paid: Number(item.accessoriesPaid) || 0,
      accessories_balance: Number(item.accessoriesBalance) || 0,
      accessories: item.accessories
    })
    .eq('id', id)
    .select();

  if (error) throw error;

  return data[0];
}

export async function deleteWorkItem(id) {
  const { error } = await supabase
    .from('work_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// export async function getFilteredWorkItems(filters) {
//   let query = supabase
//     .from("work_items")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (filters.name) {
//     query = query.ilike("name", `%${filters.name}%`);
//   }

//   if (filters.status) {
//     query = query.eq("status", filters.status);
//   }

//   if (filters.workType) {
//     query = query.eq("work_type", filters.workType);
//   }

//   if (filters.priority) {
//     query = query.eq("priority", filters.priority);
//   }

//   if (filters.startDate) {
//     query = query.gte("work_date", filters.startDate);
//   }

//   if (filters.endDate) {
//     query = query.lte("work_date", filters.endDate);
//   }

//   const { data, error } = await query;

//   if (error) throw error;

//   return data;
// }

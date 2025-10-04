'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Generic database operations as server actions
 * These can be called from client components
 */

export async function insertRecord(table: string, data: any) {
  try {
    const supabase = await createClient()
    const result = await supabase.from(table).insert([data])
    
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    
    // Revalidate relevant paths
    revalidatePath('/admin')
    revalidatePath(`/admin/${table}`)
    
    return { success: true, data: result.data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateRecord(table: string, id: string, data: any) {
  try {
    const supabase = await createClient()
    const result = await supabase.from(table).update(data).eq('id', id)
    
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    
    // Revalidate relevant paths
    revalidatePath('/admin')
    revalidatePath(`/admin/${table}`)
    revalidatePath(`/admin/${table}/${id}`)
    
    return { success: true, data: result.data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteRecord(table: string, id: string) {
  try {
    const supabase = await createClient()
    const result = await supabase.from(table).delete().eq('id', id)
    
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    
    // Revalidate relevant paths
    revalidatePath('/admin')
    revalidatePath(`/admin/${table}`)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function toggleFeatured(table: string, id: string, currentValue: boolean) {
  try {
    const supabase = await createClient()
    const result = await supabase
      .from(table)
      .update({ is_featured: !currentValue })
      .eq('id', id)
    
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    
    // Revalidate relevant paths
    revalidatePath('/admin')
    revalidatePath(`/admin/${table}`)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

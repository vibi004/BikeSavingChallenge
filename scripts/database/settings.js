import { supabase } from './supabase.js'

export async function getSettings() {
    const { data, error } = await supabase
        .from('Settings')
        .select('*')
        .single()

    if (error) {
        console.error('Fehler beim Laden der Settings:', error)
        return null
    }
    return data
}
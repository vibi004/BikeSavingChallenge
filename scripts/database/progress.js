import { supabase } from './supabase.js'

export async function getProgressByUser(user_id) {
    const { data, error } = await supabase
        .from('Progress')
        .select('*')
        .eq('user_id', user_id)
        .single()

    if (error) {
        console.error('Fehler getProgressByUser:', error)
        return null
    }
    return data
}

export async function updateProgress(km, user_id) {
    const { data: currentData, error: selectError } = await supabase
        .from('Progress')
        .select('km')
        .eq('user_id', user_id)
        .single()

    if (selectError) {
        console.error('Fehler beim Laden des aktuellen km-Werts:', selectError)
        return null
    }

    const newKm = (currentData.km || 0) + km

    const { data, error } = await supabase
        .from('Progress')
        .update({ km: newKm })
        .eq('user_id', user_id)
        .select()
        .single()

    if (error) {
        console.error('Fehler updateProgress:', error)
        return null
    }

    return data
}


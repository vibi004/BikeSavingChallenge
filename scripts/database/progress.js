import { supabase } from './supabase.js';

export async function getProgressByUser(user_id) {
    const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user_id)
        .maybeSingle();

    if (error) {
        console.error('Fehler getProgressByUser:', error);
        return null;
    }
    return data;
}

export async function updateProgress(deltaKm, user_id) {
    const { data: current, error: selErr } = await supabase
        .from('progress')
        .select('km')
        .eq('user_id', user_id)
        .maybeSingle();

    if (selErr) {
        return selErr;
    }
    const currentKm = Number(current?.km ?? 0);
    const newKm = currentKm + Number(deltaKm || 0);

    const { error: updErr } = await supabase
        .from('progress')
        .update({ km: newKm })
        .eq('user_id', user_id);

    if (updErr) {
        console.error('Fehler updateProgress:', updErr);
        return updErr;
    }
    return null;
}

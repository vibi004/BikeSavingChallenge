import { supabase } from './supabase.js'

export async function getUserByName(username) {
    const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .ilike('username', username)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('Fehler getUserByName:', error);
        return null;
    }
    return data;
}

export async function getUserById(id) {
    const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Fehler getUserById:', error);
        return null;
    }
    return data;
}

export async function getAllUsers() {
    const { data, error } = await supabase
        .from('Profile')
        .select('*');

    if (error) {
        console.error('Fehler beim Laden aller Profile:', error);
        return null;
    }
    return data;
}

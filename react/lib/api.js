import { createClient } from '@supabase/supabase-js';
import shortUUID from 'short-uuid';
import { NEXT_PUBLIC_SUPABASE_KEY, NEXT_PUBLIC_SUPABASE_URL } from './constants';

const DATABASE_TABLE = 'messages';
export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY);

export async function fetchMessages() {
  const { error, data = [] } = await supabase.from(DATABASE_TABLE).select().order('created_at', false);

  if (error) {
    throw error;
  }

  return data;
}

export async function sendMessage(user, content) {
  const message = {
    content,
    id: shortUUID.uuid(),
    created_at: new Date(),
    author: user.name,
    username: user.login,
  };

  const { error, data } = await supabase.from(DATABASE_TABLE).insert(message).single();

  if (error) {
    throw error;
  }

  return data;
}

export async function removeMessage(messageId) {
  await supabase.from(DATABASE_TABLE).delete().eq('id', messageId);
}

export async function fetchUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('User not found');
  }
}

import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { Tables, TableName } from './types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Tables>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Auth helpers
export const signUp = async (email: string, password: string, name: string, role: 'mentor' | 'mentee') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// User profile helpers
export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export const updateUser = async (userId: string, updates: Partial<Tables['users']>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Profile helpers
export const getMenteeProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('mentee_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export const getMentorProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export const updateMenteeProfile = async (userId: string, updates: Partial<Tables['mentee_profiles']>) => {
  const { data, error } = await supabase
    .from('mentee_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateMentorProfile = async (userId: string, updates: Partial<Tables['mentor_profiles']>) => {
  const { data, error } = await supabase
    .from('mentor_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Coffee chat helpers
export const createCoffeeChat = async (menteeId: string, mentorId: string) => {
  const { data, error } = await supabase
    .from('coffee_chats')
    .insert({
      mentee_id: menteeId,
      mentor_id: mentorId,
      status: 'Scheduled',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateCoffeeChatStatus = async (chatId: string, status: Tables['coffee_chats']['status']) => {
  const { data, error } = await supabase
    .from('coffee_chats')
    .update({ status })
    .eq('id', chatId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Bid helpers
export const createBid = async (coffeeChatId: string, amountBeans: number) => {
  const { data, error } = await supabase
    .from('bids')
    .insert({
      coffee_chat_id: coffeeChatId,
      amount_beans: amountBeans,
      status: 'active',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateBidStatus = async (bidId: string, status: Tables['bids']['status']) => {
  const { data, error } = await supabase
    .from('bids')
    .update({ status })
    .eq('id', bidId)
    .select()
    .single()
  if (error) throw error
  return data
}

// Rating helpers
export const createRating = async (
  coffeeChatId: string,
  fromUserId: string,
  toUserId: string,
  score: number,
  comment?: string
) => {
  const { data, error } = await supabase
    .from('ratings')
    .insert({
      coffee_chat_id: coffeeChatId,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      score,
      comment,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Wallet helpers
export const getWallet = async (userId: string) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export const createWalletTransaction = async (
  userId: string,
  amount: number,
  type: Tables['wallet_transactions']['type'],
  relatedTo?: string
) => {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      related_to: relatedTo,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Real-time subscriptions
export const subscribeToCoffeeChats = (
  userId: string,
  callback: (payload: { new: Tables['coffee_chats'] }) => void
): RealtimeChannel => {
  return supabase
    .channel('coffee_chats')
    .on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: 'coffee_chats',
        filter: `mentee_id=eq.${userId} OR mentor_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

export const subscribeToBids = (
  coffeeChatId: string,
  callback: (payload: { new: Tables['bids'] }) => void
): RealtimeChannel => {
  return supabase
    .channel('bids')
    .on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table: 'bids',
        filter: `coffee_chat_id=eq.${coffeeChatId}`,
      },
      callback
    )
    .subscribe()
}

// Types for our database tables
export type Profile = {
  id: string
  created_at: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'mentor' | 'mentee'
  bio?: string
  skills?: string[]
  experience_level?: 'beginner' | 'intermediate' | 'advanced'
  availability?: string[]
  timezone?: string
}

export type Mentorship = {
  id: string
  created_at: string
  mentor_id: string
  mentee_id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  start_date?: string
  end_date?: string
  goals?: string[]
  notes?: string
}

// Helper functions for common operations
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function createMentorship(mentorship: Omit<Mentorship, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('mentorships')
    .insert(mentorship)
    .select()
    .single()
  
  if (error) throw error
  return data as Mentorship
}

export async function getMentorships(userId: string, role: 'mentor' | 'mentee') {
  const { data, error } = await supabase
    .from('mentorships')
    .select('*')
    .eq(`${role}_id`, userId)
  
  if (error) throw error
  return data as Mentorship[]
} 
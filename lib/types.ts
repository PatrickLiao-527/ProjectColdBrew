export type User = {
  id: string
  name: string
  email: string
  linkedin_url?: string
  resume_url?: string
  role: 'mentor' | 'mentee'
  school?: string
  graduation_year?: number
  created_at: string
}

export type MenteeProfile = {
  user_id: string
  rating_avg: number
  rating_count: number
  interests?: string
  looking_for?: string
  intro?: string
  preferred_companies?: string
  preferred_roles?: string
  updated_at: string
}

export type MentorProfile = {
  user_id: string
  title?: string
  industry?: string
  company?: string
  position?: string
  years_experience?: number
  tags?: string
  bio?: string
  rating_avg: number
  rating_count: number
  status: 'pending' | 'approved' | 'rejected'
  updated_at: string
}

export type CoffeeChat = {
  id: string
  mentee_id: string
  mentor_id: string
  status: 'Scheduled' | 'Canceled' | 'Finished'
  scheduled_time?: string
  created_at: string
}

export type Bid = {
  id: string
  coffee_chat_id: string
  amount_beans: number
  status: 'active' | 'rejected' | 'expired'
  created_at: string
}

export type Rating = {
  id: string
  coffee_chat_id: string
  from_user_id: string
  to_user_id: string
  score: number
  comment?: string
  created_at: string
}

export type Wallet = {
  user_id: string
  balance: number
}

export type WalletTransaction = {
  id: string
  user_id: string
  amount: number
  type: 'topup' | 'spend' | 'reward'
  related_to?: string
  created_at: string
}

// Database helper types
export type Tables = {
  users: User
  mentee_profiles: MenteeProfile
  mentor_profiles: MentorProfile
  coffee_chats: CoffeeChat
  bids: Bid
  ratings: Rating
  wallets: Wallet
  wallet_transactions: WalletTransaction
}

export type TableName = keyof Tables 
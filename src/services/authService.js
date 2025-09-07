import { supabase } from '../config/supabase'
import { TABLES } from '../config/supabase'

// Sign up with email and password
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          subscription_tier: 'free'
        }
      }
    })

    if (error) throw error

    // Create user profile in database
    if (data.user) {
      const { error: profileError } = await supabase
        .from(TABLES.USERS)
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: userData.fullName,
            subscription_tier: 'free',
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }

    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to sign up')
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to sign in')
  }
}

// Sign in with OAuth provider
export const signInWithProvider = async (provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message || `Failed to sign in with ${provider}`)
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  } catch (error) {
    throw new Error(error.message || 'Failed to sign out')
  }
}

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    throw new Error(error.message || 'Failed to get session')
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    throw new Error(error.message || 'Failed to get user')
  }
}

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile')
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to send reset email')
  }
}

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to update password')
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Get user profile from database
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to get user profile')
  }
}

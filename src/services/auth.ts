/**
 * HydraFlow Authentication & Database Service
 * 
 * Provides robust client-side database management with persistent storage,
 * password hashing (SHA-256), session handling, and user profile management.
 */

export interface UserProfile {
  age?: number
  weight?: number // in kg
  height?: number // in cm
  gender?: 'Male' | 'Female' | 'Other'
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active'
  sweatRate: 'Low' | 'Moderate' | 'High' | 'Very High'
  baseTargetLiters: number
  locationEnabled: boolean
  calendarConnected: boolean
  notificationsEnabled: boolean
}

export interface UserAccount {
  id: string
  fullName: string
  username: string
  email: string
  passwordHash: string
  createdAt: string
  onboarded: boolean
  profile: UserProfile
}

const USERS_STORAGE_KEY = 'hydraflow_users_db'
const SESSION_STORAGE_KEY = 'hydraflow_active_session'

// Utility: Hash password using browser Web Crypto API (SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Calculate recommended baseline water intake based on weight and activity
export function calculateBaselineIntake(weightKg: number = 70, activityLevel: string = 'Moderate'): number {
  let baseMl = weightKg * 35
  switch (activityLevel) {
    case 'Sedentary':
      baseMl *= 0.9
      break
    case 'Light':
      baseMl *= 1.0
      break
    case 'Moderate':
      baseMl *= 1.15
      break
    case 'Active':
      baseMl *= 1.3
      break
    case 'Very Active':
      baseMl *= 1.45
      break
  }
  return Math.round((baseMl / 1000) * 10) / 10
}

class AuthService {
  private getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (e) {
      console.error('Failed to save users to database:', e)
    }
  }

  // Get currently active logged-in user
  public getCurrentUser(): UserAccount | null {
    try {
      const sessionUserId = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!sessionUserId) return null
      const users = this.getUsers()
      return users.find((u) => u.id === sessionUserId) || null
    } catch {
      return null
    }
  }

  // Create a new account
  public async signUp(
    fullName: string,
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    if (!fullName.trim()) return { success: false, error: 'Please enter your full name.' }
    if (!cleanUsername) return { success: false, error: 'Please enter a username.' }
    if (cleanUsername.length < 3) return { success: false, error: 'Username must be at least 3 characters.' }
    if (!cleanEmail || !cleanEmail.includes('@')) return { success: false, error: 'Please enter a valid email address.' }
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters long.' }

    const users = this.getUsers()

    // Check if username or email is already registered
    const existingUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    )
    if (existingUser) {
      if (existingUser.username.toLowerCase() === cleanUsername) {
        return { success: false, error: 'This username is already taken. Please choose another.' }
      }
      return { success: false, error: 'An account with this email already exists. Please log in.' }
    }

    const passwordHash = await hashPassword(password)
    const newUser: UserAccount = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      fullName: fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      onboarded: false,
      profile: {
        age: 28,
        weight: 72,
        height: 178,
        gender: 'Male',
        activityLevel: 'Moderate',
        sweatRate: 'Moderate',
        baseTargetLiters: calculateBaselineIntake(72, 'Moderate'),
        locationEnabled: true,
        calendarConnected: true,
        notificationsEnabled: true,
      },
    }

    users.push(newUser)
    this.saveUsers(users)
    this.setSession(newUser.id)

    return { success: true, user: newUser }
  }

  // Log in with username or email + password
  public async login(
    usernameOrEmail: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
    const cleanIdentifier = usernameOrEmail.trim().toLowerCase()
    if (!cleanIdentifier) return { success: false, error: 'Please enter your username or email.' }
    if (!password) return { success: false, error: 'Please enter your password.' }

    const users = this.getUsers()
    const user = users.find(
      (u) => u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier
    )

    if (!user) {
      return { success: false, error: 'No account found with this username or email.' }
    }

    const passwordHash = await hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }

    this.setSession(user.id)
    return { success: true, user }
  }

  // Log out current session
  public logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {}
  }

  private setSession(userId: string): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, userId)
    } catch {}
  }

  // Update password inside Settings
  public async updatePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!currentPass) return { success: false, error: 'Please enter your current password.' }
    if (newPass.length < 6) return { success: false, error: 'New password must be at least 6 characters.' }
    if (currentPass === newPass) return { success: false, error: 'New password must be different from current password.' }

    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return { success: false, error: 'User account not found.' }

    const currentHash = await hashPassword(currentPass)
    if (users[userIndex].passwordHash !== currentHash) {
      return { success: false, error: 'Current password is incorrect.' }
    }

    const newHash = await hashPassword(newPass)
    users[userIndex].passwordHash = newHash
    this.saveUsers(users)
    return { success: true }
  }

  // Update user profile settings
  public updateProfile(
    userId: string,
    updates: Partial<UserProfile> & { fullName?: string; email?: string }
  ): UserAccount | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    const user = users[userIndex]
    if (updates.fullName) user.fullName = updates.fullName.trim()
    if (updates.email) user.email = updates.email.trim()

    user.profile = {
      ...user.profile,
      ...updates,
    }

    if (updates.weight || updates.activityLevel) {
      user.profile.baseTargetLiters = calculateBaselineIntake(
        user.profile.weight,
        user.profile.activityLevel
      )
    }

    users[userIndex] = user
    this.saveUsers(users)
    return user
  }

  // Mark onboarding completed for user
  public completeOnboarding(userId: string, activityLevel?: string): UserAccount | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    users[userIndex].onboarded = true
    if (activityLevel) {
      users[userIndex].profile.activityLevel = activityLevel as any
      users[userIndex].profile.baseTargetLiters = calculateBaselineIntake(
        users[userIndex].profile.weight || 72,
        activityLevel
      )
    }
    this.saveUsers(users)
    return users[userIndex]
  }

  // Reset onboarding for current user
  public resetOnboarding(userId: string): void {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      users[userIndex].onboarded = false
      this.saveUsers(users)
    }
  }
}

export const authService = new AuthService()

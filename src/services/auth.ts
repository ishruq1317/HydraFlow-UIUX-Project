/**
 * HydraFlow Authentication & Comprehensive Database Service
 * 
 * Provides persistent database management with SHA-256 encryption,
 * detailed user biometrics, customizable schedule blocks, and
 * scientifically calibrated hydration formulas.
 */

export interface ScheduleBlock {
  id: string
  time: string
  title: string
  category: 'lecture' | 'workout' | 'commute' | 'work' | 'sport' | 'study' | 'other'
  impactLevel: 'Low' | 'Moderate' | 'High'
  fluidDemandMl: number
  enabled: boolean
}

export interface UserProfile {
  age: number
  weight: number // in kg
  height: number // in cm
  gender: 'Male' | 'Female' | 'Other'
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active'
  workType: 'desk' | 'standing' | 'outdoor' | 'athlete'
  exerciseMins: number
  outdoorHours: number
  caffeineCups: number
  sweatRate: 'Low' | 'Moderate' | 'High' | 'Very High'
  schedule: ScheduleBlock[]
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

// Default schedule blocks
export const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  { id: 'sch_1', time: '10:00 AM', title: 'Lecture / Focus Work', category: 'lecture', impactLevel: 'Low', fluidDemandMl: 200, enabled: true },
  { id: 'sch_2', time: '1:00 PM', title: 'Gym & Fitness Session', category: 'workout', impactLevel: 'High', fluidDemandMl: 350, enabled: true },
  { id: 'sch_3', time: '3:30 PM', title: 'Outdoor Commute / Transit', category: 'commute', impactLevel: 'Moderate', fluidDemandMl: 250, enabled: true },
  { id: 'sch_4', time: '6:00 PM', title: 'Evening Study / Project', category: 'study', impactLevel: 'Low', fluidDemandMl: 200, enabled: true },
]

// Utility: Hash password using browser Web Crypto API (SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Scientifically comprehensive fluid need calculation
 * Combines weight baseline, work type, exercise duration, sweat rate,
 * and scheduled high-demand periods.
 */
export function calculateComprehensiveIntake(params: {
  weightKg?: number
  heightCm?: number
  age?: number
  gender?: string
  activityLevel?: string
  workType?: string
  exerciseMins?: number
  caffeineCups?: number
  sweatRate?: string
  schedule?: ScheduleBlock[]
}): {
  baseLiters: number
  activitySurgeLiters: number
  sweatMultiplier: number
  totalRecommendedLiters: number
} {
  const weight = params.weightKg || 70
  // Standard physiological formula: 35 mL per kg body weight
  let baselineMl = weight * 35

  // Work type adjustment
  if (params.workType === 'standing') baselineMl += 200
  else if (params.workType === 'outdoor') baselineMl += 450
  else if (params.workType === 'athlete') baselineMl += 700

  // Exercise duration adjustment
  const exerciseMins = params.exerciseMins ?? 45
  let exerciseMl = 0
  if (exerciseMins > 0) {
    exerciseMl = Math.round((exerciseMins / 30) * 250) // ~250 mL per 30 mins exercise
  }

  // Caffeine diuretic compensation (~80 mL per cup over 1 cup)
  const caffeineCups = params.caffeineCups ?? 1
  let caffeineMl = 0
  if (caffeineCups > 1) {
    caffeineMl = (caffeineCups - 1) * 80
  }

  // Sweat tendency multiplier
  let sweatMult = 1.0
  if (params.sweatRate === 'Low') sweatMult = 0.95
  else if (params.sweatRate === 'Moderate') sweatMult = 1.05
  else if (params.sweatRate === 'High') sweatMult = 1.15
  else if (params.sweatRate === 'Very High') sweatMult = 1.25

  // Active schedule surge
  const enabledSchedule = params.schedule?.filter((s) => s.enabled) || []
  const scheduleExtraMl = enabledSchedule.reduce((acc, curr) => acc + (curr.fluidDemandMl || 0), 0)

  const rawTotal = (baselineMl + exerciseMl + caffeineMl + scheduleExtraMl * 0.5) * sweatMult
  const totalLiters = Math.max(1.8, Math.min(5.0, Math.round((rawTotal / 1000) * 10) / 10))

  return {
    baseLiters: Math.round((baselineMl / 1000) * 10) / 10,
    activitySurgeLiters: Math.round(((exerciseMl + scheduleExtraMl) / 1000) * 10) / 10,
    sweatMultiplier: sweatMult,
    totalRecommendedLiters: totalLiters,
  }
}

// Fallback simpler calculation helper
export function calculateBaselineIntake(weightKg: number = 70, activityLevel: string = 'Moderate'): number {
  const res = calculateComprehensiveIntake({ weightKg, activityLevel })
  return res.totalRecommendedLiters
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
    passwordPlain: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedUsername = username.trim().toLowerCase()
    const trimmedEmail = email.trim().toLowerCase()

    if (!fullName.trim() || !trimmedUsername || !trimmedEmail || !passwordPlain) {
      return { success: false, error: 'All fields are required.' }
    }

    if (passwordPlain.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' }
    }

    const users = this.getUsers()

    if (users.some((u) => u.username.toLowerCase() === trimmedUsername)) {
      return { success: false, error: 'Username already taken. Please choose another.' }
    }

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'Email already registered. Please log in.' }
    }

    const passwordHash = await hashPassword(passwordPlain)

    const defaultProfile: UserProfile = {
      age: 26,
      weight: 70,
      height: 175,
      gender: 'Male',
      activityLevel: 'Moderate',
      workType: 'desk',
      exerciseMins: 45,
      outdoorHours: 1.5,
      caffeineCups: 1,
      sweatRate: 'Moderate',
      schedule: DEFAULT_SCHEDULE,
      baseTargetLiters: 2.8,
      locationEnabled: true,
      calendarConnected: true,
      notificationsEnabled: true,
    }

    const newUser: UserAccount = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      fullName: fullName.trim(),
      username: trimmedUsername,
      email: trimmedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      onboarded: false,
      profile: defaultProfile,
    }

    users.push(newUser)
    this.saveUsers(users)

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, newUser.id)
    } catch {}

    return { success: true, user: newUser }
  }

  // Sign In with username/email and password
  public async login(
    identifier: string,
    passwordPlain: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedIdentifier = identifier.trim().toLowerCase()
    const users = this.getUsers()

    const user = users.find(
      (u) =>
        u.username.toLowerCase() === trimmedIdentifier ||
        u.email.toLowerCase() === trimmedIdentifier
    )

    if (!user) {
      return { success: false, error: 'Account not found. Check username or sign up.' }
    }

    const passwordHash = await hashPassword(passwordPlain)
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, user.id)
    } catch {}

    return { success: true, user }
  }

  // Sign Out
  public logout(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {}
  }

  // Update password in database
  public async updatePassword(
    userId: string,
    currentPasswordPlain: string,
    newPasswordPlain: string
  ): Promise<{ success: boolean; error?: string }> {
    if (newPasswordPlain.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' }
    }

    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' }
    }

    const currentHash = await hashPassword(currentPasswordPlain)
    if (users[userIndex].passwordHash !== currentHash) {
      return { success: false, error: 'Current password does not match.' }
    }

    users[userIndex].passwordHash = await hashPassword(newPasswordPlain)
    this.saveUsers(users)
    return { success: true }
  }

  // Update user profile details
  public updateProfile(userId: string, updates: Partial<UserProfile>): UserAccount | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    const existing = users[userIndex].profile
    const updatedProfile: UserProfile = {
      ...existing,
      ...updates,
    }

    // Recalculate target
    const calculated = calculateComprehensiveIntake({
      weightKg: updatedProfile.weight,
      heightCm: updatedProfile.height,
      age: updatedProfile.age,
      gender: updatedProfile.gender,
      activityLevel: updatedProfile.activityLevel,
      workType: updatedProfile.workType,
      exerciseMins: updatedProfile.exerciseMins,
      caffeineCups: updatedProfile.caffeineCups,
      sweatRate: updatedProfile.sweatRate,
      schedule: updatedProfile.schedule,
    })

    updatedProfile.baseTargetLiters = calculated.totalRecommendedLiters

    users[userIndex].profile = updatedProfile
    this.saveUsers(users)
    return users[userIndex]
  }

  // Complete detailed onboarding
  public completeDetailedOnboarding(
    userId: string,
    detailedData: Partial<UserProfile>
  ): UserAccount | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    const current = users[userIndex].profile
    const mergedProfile: UserProfile = {
      ...current,
      ...detailedData,
    }

    const calculated = calculateComprehensiveIntake({
      weightKg: mergedProfile.weight,
      heightCm: mergedProfile.height,
      age: mergedProfile.age,
      gender: mergedProfile.gender,
      activityLevel: mergedProfile.activityLevel,
      workType: mergedProfile.workType,
      exerciseMins: mergedProfile.exerciseMins,
      caffeineCups: mergedProfile.caffeineCups,
      sweatRate: mergedProfile.sweatRate,
      schedule: mergedProfile.schedule,
    })

    mergedProfile.baseTargetLiters = calculated.totalRecommendedLiters

    users[userIndex].onboarded = true
    users[userIndex].profile = mergedProfile
    this.saveUsers(users)
    return users[userIndex]
  }

  // Quick fallback onboarding complete
  public completeOnboarding(userId: string, activityLevel: string = 'Moderate'): UserAccount | null {
    return this.completeDetailedOnboarding(userId, {
      activityLevel: activityLevel as any,
    })
  }
}

export const authService = new AuthService()

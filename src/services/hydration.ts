/**
 * HydraFlow Hydration Engine & Storage Service
 * 
 * Manages real-time water logging, dynamic target adjustments, 
 * drink history, and smart bottle synchronization.
 */

export interface DrinkLogItem {
  id: string
  amountMl: number
  type: 'water' | 'electrolyte' | 'bottle' | 'coffee' | 'tea'
  timestamp: string
  timeLabel: string
  note: string
}

export interface SmartBottleState {
  levelMl: number
  capacityMl: number
  batteryPct: number
  temperatureC: number
  isConnected: boolean
  lastSync: string
}

export interface HydrationState {
  date: string
  consumedLiters: number
  targetLiters: number
  drinks: DrinkLogItem[]
  bottle: SmartBottleState
}

const HYDRATION_STORAGE_KEY = 'hydraflow_hydration_state'

type Listener = (state: HydrationState) => void

class HydrationService {
  private listeners: Listener[] = []

  private getTodayKey(): string {
    return new Date().toISOString().split('T')[0]
  }

  // Get initial state for today
  public getState(defaultTarget: number = 2.8): HydrationState {
    const today = this.getTodayKey()
    try {
      const raw = localStorage.getItem(HYDRATION_STORAGE_KEY)
      if (raw) {
        const parsed: HydrationState = JSON.parse(raw)
        if (parsed.date === today) {
          return parsed
        }
      }
    } catch {}

    // Default initial mock state for today if fresh
    const initialState: HydrationState = {
      date: today,
      consumedLiters: 1.4,
      targetLiters: defaultTarget,
      drinks: [
        { id: 'd1', amountMl: 220, type: 'water', timestamp: '2026-08-25T07:12:00', timeLabel: '7:12 AM', note: 'Morning wake-up glass' },
        { id: 'd2', amountMl: 180, type: 'water', timestamp: '2026-08-25T09:03:00', timeLabel: '9:03 AM', note: 'Pre-lecture hydration' },
        { id: 'd3', amountMl: 200, type: 'water', timestamp: '2026-08-25T11:15:00', timeLabel: '11:15 AM', note: 'Mid-morning hydration' },
        { id: 'd4', amountMl: 800, type: 'bottle', timestamp: '2026-08-25T12:58:00', timeLabel: '12:58 PM', note: 'HydraFlow smart bottle sync' },
      ],
      bottle: {
        levelMl: 420,
        capacityMl: 750,
        batteryPct: 82,
        temperatureC: 18,
        isConnected: true,
        lastSync: '2 min ago',
      },
    }

    this.saveState(initialState)
    return initialState
  }

  private saveState(state: HydrationState): void {
    try {
      localStorage.setItem(HYDRATION_STORAGE_KEY, JSON.stringify(state))
      this.notify(state)
    } catch (e) {
      console.error('Failed to save hydration state:', e)
    }
  }

  // Subscribe to real-time changes
  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify(state: HydrationState): void {
    this.listeners.forEach((l) => l(state))
  }

  // Log a new drink intake
  public logDrink(
    amountMl: number,
    type: DrinkLogItem['type'] = 'water',
    note: string = 'Quick log'
  ): HydrationState {
    const state = this.getState()
    const now = new Date()
    const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    const newDrink: DrinkLogItem = {
      id: 'drk_' + Date.now(),
      amountMl,
      type,
      timestamp: now.toISOString(),
      timeLabel,
      note,
    }

    const updatedDrinks = [newDrink, ...state.drinks]
    const updatedConsumed = Math.round((state.consumedLiters + amountMl / 1000) * 100) / 100

    const updatedState: HydrationState = {
      ...state,
      consumedLiters: updatedConsumed,
      drinks: updatedDrinks,
    }

    this.saveState(updatedState)
    return updatedState
  }

  // Drink from smart bottle (deducts from bottle, logs to daily intake)
  public drinkFromBottle(amountMl: number = 200): HydrationState {
    const state = this.getState()
    const currentBottleLevel = state.bottle.levelMl
    const actualDrinkMl = Math.min(currentBottleLevel, amountMl)

    if (actualDrinkMl <= 0) {
      return state // Bottle is empty
    }

    const newBottleLevel = Math.max(0, currentBottleLevel - actualDrinkMl)
    const now = new Date()
    const timeLabel = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    const newDrink: DrinkLogItem = {
      id: 'drk_' + Date.now(),
      amountMl: actualDrinkMl,
      type: 'bottle',
      timestamp: now.toISOString(),
      timeLabel,
      note: 'HydraFlow Bottle sip',
    }

    const updatedState: HydrationState = {
      ...state,
      consumedLiters: Math.round((state.consumedLiters + actualDrinkMl / 1000) * 100) / 100,
      drinks: [newDrink, ...state.drinks],
      bottle: {
        ...state.bottle,
        levelMl: newBottleLevel,
        lastSync: 'just now',
      },
    }

    this.saveState(updatedState)
    return updatedState
  }

  // Refill smart bottle to full capacity
  public refillBottle(capacityMl: number = 750): HydrationState {
    const state = this.getState()
    const updatedState: HydrationState = {
      ...state,
      bottle: {
        ...state.bottle,
        levelMl: capacityMl,
        lastSync: 'just now',
      },
    }

    this.saveState(updatedState)
    return updatedState
  }

  // Sync smart bottle
  public syncBottle(): HydrationState {
    const state = this.getState()
    const updatedState: HydrationState = {
      ...state,
      bottle: {
        ...state.bottle,
        lastSync: 'just now',
      },
    }
    this.saveState(updatedState)
    return updatedState
  }

  // Reset today's logs for fresh testing
  public resetToday(target: number = 2.8): HydrationState {
    const today = this.getTodayKey()
    const freshState: HydrationState = {
      date: today,
      consumedLiters: 0,
      targetLiters: target,
      drinks: [],
      bottle: {
        levelMl: 750,
        capacityMl: 750,
        batteryPct: 95,
        temperatureC: 18,
        isConnected: true,
        lastSync: 'just now',
      },
    }
    this.saveState(freshState)
    return freshState
  }
}

export const hydrationService = new HydrationService()

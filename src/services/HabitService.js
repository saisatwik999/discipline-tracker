import { StorageService } from './StorageService';
import { SYSTEMS, FREQUENCY, HABIT_TYPES } from './models';
import { DSA_QUESTIONS_FULL } from './DSAQuestions_Full';

// Seeded Random Helper (Deprecated for Question selection, but kept if needed elsewhere)
const seededRandom = (seed) => {
    let value = 0;
    for (let i = 0; i < seed.length; i++) {
        value += seed.charCodeAt(i);
    }
    const x = Math.sin(value) * 10000;
    return x - Math.floor(x);
};

export const HabitService = {
    getHabitsForSystem: (system) => {
        const data = StorageService.getData();
        const allHabits = data.habits?.[system] || [];
        return allHabits;
    },

    getDailyHabits: (system) => {
        const habits = HabitService.getHabitsForSystem(system);
        return habits.filter(h => h.frequency === FREQUENCY.DAILY);
    },

    getMonthlyHabits: (system) => {
        const habits = HabitService.getHabitsForSystem(system);
        return habits.filter(h => h.frequency === FREQUENCY.MONTHLY);
    },

    getDailyQuestion: (dateFilter = null) => {
        const dateStr = dateFilter || StorageService.getToday();

        // Calculate Day of Year (1-366) to ensure no repeats for a year
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const start = new Date(y, 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        // Use Day of Year to select from the 366+ question bank
        // Jan 1st is Day 1 -> index 0.
        const idx = (dayOfYear - 1) % DSA_QUESTIONS_FULL.length;

        return DSA_QUESTIONS_FULL[idx] || DSA_QUESTIONS_FULL[0];
    },

    getDSAHistory: () => {
        const logs = StorageService.getLogs(SYSTEMS.STUDY);
        const history = [];

        // We need to find the DSA habit ID first. 
        // Assuming there is only one "DSA System" habit type active or we filter by it.
        // For simplicity, we search logs where the details look like DSA answers or habit type matches.
        // Since logs are by Date -> HabitId, we iterate dates.

        const habits = HabitService.getHabitsForSystem(SYSTEMS.STUDY);
        const dsaHabit = habits.find(h => h.type === HABIT_TYPES.DSA_SYSTEM);

        if (!dsaHabit) return [];

        Object.keys(logs).forEach(date => {
            if (logs[date][dsaHabit.id]) {
                const log = logs[date][dsaHabit.id];
                // We need to reconstruct which question was asked on that date!
                // Since getDailyQuestion is deterministic based on date, we can do this.
                const question = HabitService.getDailyQuestion(date);

                history.push({
                    date,
                    status: log.status,
                    details: log.details,
                    question: question
                });
            }
        });

        return history;
    },

    // Mark a habit as completed/failed/etc
    toggleHabit: (system, habitId, status, details = null, dateOverride = null) => {
        const date = dateOverride || StorageService.getToday();
        StorageService.logHabit(system, date, habitId, status, details);
    },

    getTodayStatus: (system) => {
        const today = StorageService.getToday();
        const logs = StorageService.getLogs(system);
        return logs[today] || {};
    },

    getLogForDate: (system, date) => {
        const logs = StorageService.getLogs(system);
        return logs[date] || {};
    },

    // Monthly habit helper
    incrementMonthlyHabit: (habitId) => {
        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        StorageService.updateMonthlyCount(monthKey, habitId, 1);
    },

    getMonthlyUsage: (habitId) => {
        const data = StorageService.getData();
        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        return data.monthlyUsage?.[monthKey]?.[habitId] || 0;
    },

    // CRUD for Habits
    addHabit: (system, habitCtx) => {
        const data = StorageService.getData();
        if (!data.habits[system]) data.habits[system] = [];

        const newHabit = {
            id: crypto.randomUUID(),
            system,
            ...habitCtx
        };

        data.habits[system].push(newHabit);
        StorageService.saveData(data);
    },

    updateHabit: (system, habitId, updates) => {
        const data = StorageService.getData();
        const idx = data.habits[system].findIndex(h => h.id === habitId);
        if (idx !== -1) {
            data.habits[system][idx] = { ...data.habits[system][idx], ...updates };
            StorageService.saveData(data);
        }
    },

    deleteHabit: (system, habitId) => {
        const data = StorageService.getData();
        data.habits[system] = data.habits[system].filter(h => h.id !== habitId);
        StorageService.saveData(data);
    }
};

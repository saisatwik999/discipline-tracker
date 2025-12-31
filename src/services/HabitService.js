import { StorageService } from './StorageService';
import { SYSTEMS, FREQUENCY, HABIT_TYPES } from './models';
import { DSA_QUESTIONS } from './DSAQuestionBank';

// Seeded Random Helper
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

        // Use the date string as a seed to randomly select a question
        // This ensures the same question appears for the same date for everyone (or at least consistent per user/day)
        const rand = seededRandom(dateStr);
        const idx = Math.floor(rand * DSA_QUESTIONS.length);

        return DSA_QUESTIONS[idx];
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

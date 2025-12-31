import { INITIAL_DATA } from './models';

const STORAGE_KEY = 'discipline_tracker_v1';

export const StorageService = {
    initialize: () => {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        } else {
            // Migration: Check if 'habits' exists, if not, add it
            const data = JSON.parse(existing);
            if (!data.habits) {
                data.habits = INITIAL_DATA.habits;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        }
    },

    getData: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : INITIAL_DATA;
        } catch (e) {
            console.error("Data corruption", e);
            return INITIAL_DATA;
        }
    },

    saveData: (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // Helper to get formatted today date YYYY-MM-DD
    getToday: () => {
        return new Date().toISOString().split('T')[0];
    },

    // Get logs for a specific system
    getLogs: (system) => {
        const data = StorageService.getData();
        return data.logs?.[system] || {};
    },

    // Update a specific log entry
    logHabit: (system, date, habitId, status, details = null) => {
        const data = StorageService.getData();

        if (!data.logs[system][date]) {
            data.logs[system][date] = {};
        }

        data.logs[system][date][habitId] = {
            status,
            details,
            timestamp: new Date().toISOString()
        };

        StorageService.saveData(data);
        return data;
    },

    // Update monthly count
    updateMonthlyCount: (monthKey, habitId, delta) => {
        const data = StorageService.getData();
        if (!data.monthlyUsage) data.monthlyUsage = {};
        if (!data.monthlyUsage[monthKey]) data.monthlyUsage[monthKey] = {};

        const current = data.monthlyUsage[monthKey][habitId] || 0;
        data.monthlyUsage[monthKey][habitId] = Math.max(0, current + delta);

        StorageService.saveData(data);
        return data;
    }
};

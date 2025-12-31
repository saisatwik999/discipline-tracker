import { INITIAL_DATA } from './models';

const STORAGE_KEY = 'discipline_tracker_v1';

export const StorageService = {

    currentUser: null,
    currentKey: null,

    initialize: (username) => {
        if (!username) return;

        StorageService.currentUser = username;
        StorageService.currentKey = `discipline_tracker_user_${username.toLowerCase()}`;

        console.log(`Initializing storage for user: ${username} with key: ${StorageService.currentKey}`);

        const existing = localStorage.getItem(StorageService.currentKey);
        if (!existing) {
            localStorage.setItem(StorageService.currentKey, JSON.stringify(INITIAL_DATA));
        } else {
            // Migration/Validation
            try {
                const data = JSON.parse(existing);
                if (!data.habits || !data.logs || !data.monthlyUsage) {
                    // Shallow merge if structure is incomplete, or reset if corrupt
                    const merged = { ...INITIAL_DATA, ...data };
                    if (!merged.habits) merged.habits = INITIAL_DATA.habits;
                    localStorage.setItem(StorageService.currentKey, JSON.stringify(merged));
                }
            } catch (e) {
                console.error("Data corruption during init, resetting", e);
                localStorage.setItem(StorageService.currentKey, JSON.stringify(INITIAL_DATA));
            }
        }
    },

    getData: () => {
        if (!StorageService.currentKey) {
            console.warn("StorageService accessed before initialization!");
            return INITIAL_DATA;
        }
        try {
            const data = localStorage.getItem(StorageService.currentKey);
            return data ? JSON.parse(data) : INITIAL_DATA;
        } catch (e) {
            console.error("Data corruption", e);
            return INITIAL_DATA;
        }
    },

    saveData: (data) => {
        if (!StorageService.currentKey) {
            console.error("Cannot save data: No user logged in.");
            return;
        }
        try {
            localStorage.setItem(StorageService.currentKey, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save data to localStorage", e);
            alert("Warning: Storage limit reached or disabled. Data may not persist.");
        }
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

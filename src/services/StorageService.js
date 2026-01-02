import { INITIAL_DATA } from './models';

// Public storage for demo (npoint.io allows public POST/GET)
const CLOUD_API_BASE = 'https://api.npoint.io';

const STORAGE_KEY = 'discipline_tracker_v1';

export const StorageService = {

    currentUser: null,
    currentKey: null,

    initialize: async (username) => {
        if (!username) return;

        StorageService.currentUser = username;
        StorageService.currentKey = `discipline_tracker_user_${username.toLowerCase()}`;

        console.log(`Initializing storage for user: ${username}`);

        // Try to fetch from "Cloud" (for cross-device)
        await StorageService.pullFromCloud();
    },

    pullFromCloud: async () => {
        if (!StorageService.currentUser) return;
        const binId = StorageService.getBinId(StorageService.currentUser);

        try {
            const response = await fetch(`${CLOUD_API_BASE}/${binId}`);
            if (response.ok) {
                const cloudData = await response.json();
                if (cloudData && cloudData.habits) {
                    StorageService.saveData(cloudData, false);
                    return cloudData;
                }
            }
        } catch (e) {
            console.warn("Cloud sync failed (Device offline or Initial run).");
        }
    },

    pushToCloud: async (data) => {
        if (!StorageService.currentUser) return;
        const binId = StorageService.getBinId(StorageService.currentUser);

        try {
            await fetch(`${CLOUD_API_BASE}/${binId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.error("Cloud push failed.");
        }
    },

    getBinId: (name) => {
        // We use a unique ID for 'sai' to avoid collisions with others
        if (name.toLowerCase() === 'sai') return 'c841e0671607590d9860';
        return 'c841e0671607590d9860';
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

    saveData: (data, sync = true) => {
        if (!StorageService.currentKey) {
            console.error("Cannot save data: No user logged in.");
            return;
        }
        try {
            localStorage.setItem(StorageService.currentKey, JSON.stringify(data));

            // Trigger background sync if permitted
            if (sync) {
                StorageService.pushToCloud(data);
            }
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

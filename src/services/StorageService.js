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
            const response = await fetch(`${CLOUD_API_BASE}/${binId}?t=${Date.now()}`, {
                cache: 'no-store'
            }).catch(() => null);

            if (response && response.ok) {
                const cloudData = await response.json();
                if (cloudData && cloudData.habits) {
                    const localData = StorageService.getData();
                    const mergedData = StorageService.mergeData(localData, cloudData);

                    console.log("Sync: Data merged successfully.");
                    StorageService.saveData(mergedData, true); // Save and push the merged result
                    return mergedData;
                }
            }
        } catch (e) {
            console.warn("Sync: Pull failed.");
        }
    },

    // Deep merge logic to combine device states
    mergeData: (local, cloud) => {
        if (!cloud || !cloud.logs) return local;
        if (!local || !local.logs) return cloud;

        const merged = { ...local };

        // Merge logs for each system (study, normal)
        ['study', 'normal'].forEach(system => {
            const localLogs = local.logs[system] || {};
            const cloudLogs = cloud.logs[system] || {};

            // Collect all dates from both sources
            const allDates = new Set([...Object.keys(localLogs), ...Object.keys(cloudLogs)]);

            allDates.forEach(date => {
                if (!merged.logs[system][date]) merged.logs[system][date] = {};

                const localDay = localLogs[date] || {};
                const cloudDay = cloudLogs[date] || {};

                // Merge habits for this day
                const allHabits = new Set([...Object.keys(localDay), ...Object.keys(cloudDay)]);

                allHabits.forEach(habitId => {
                    const localEntry = localDay[habitId];
                    const cloudEntry = cloudDay[habitId];

                    if (!localEntry) {
                        merged.logs[system][date][habitId] = cloudEntry;
                    } else if (cloudEntry) {
                        // Conflict: Choose latest based on timestamp
                        const localTime = new Date(localEntry.timestamp || 0).getTime();
                        const cloudTime = new Date(cloudEntry.timestamp || 0).getTime();

                        if (cloudTime > localTime) {
                            merged.logs[system][date][habitId] = cloudEntry;
                        }
                    }
                });
            });
        });

        // Merge monthly usage (simple max for now)
        if (cloud.monthlyUsage) {
            if (!merged.monthlyUsage) merged.monthlyUsage = {};
            Object.keys(cloud.monthlyUsage).forEach(month => {
                if (!merged.monthlyUsage[month]) merged.monthlyUsage[month] = {};
                Object.keys(cloud.monthlyUsage[month]).forEach(habitId => {
                    const localVal = merged.monthlyUsage[month][habitId] || 0;
                    const cloudVal = cloud.monthlyUsage[month][habitId] || 0;
                    merged.monthlyUsage[month][habitId] = Math.max(localVal, cloudVal);
                });
            });
        }

        return merged;
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
        const user = name.toLowerCase();
        // Updated to a private-looking slug to avoid conflicts
        if (user === 'sai') return '6c382103f5ec28641db1';
        return 'c841e0671607590d9861'; // Different bin for others
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

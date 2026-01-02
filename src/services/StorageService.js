import { INITIAL_DATA } from './models';

// Public demo API for cloud sync (JSONBin.io public bin or equivalent)
// For a real app, you would use Firebase/Supabase with private keys.
const CLOUD_API_BASE = 'https://api.jsonbin.io/v3/b';
const MASTER_KEY = '$2a$10$DEMO_KEY_REPLACE_IF_NEEDED'; // Mock key or public access

const STORAGE_KEY = 'discipline_tracker_v1';

export const StorageService = {

    currentUser: null,
    currentKey: null,

    initialize: async (username, onComplete) => {
        if (!username) return;

        StorageService.currentUser = username;
        StorageService.currentKey = `discipline_tracker_user_${username.toLowerCase()}`;

        console.log(`Initializing storage for user: ${username}`);

        // 1. Load from local first for speed
        const localData = localStorage.getItem(StorageService.currentKey);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                // Basic migration check
                if (parsed.habits) {
                    // Update state even if local exists, but we'll sync from cloud next
                }
            } catch (e) { }
        } else {
            localStorage.setItem(StorageService.currentKey, JSON.stringify(INITIAL_DATA));
        }

        // 2. Try to fetch from "Cloud" (for cross-device)
        await StorageService.pullFromCloud();

        if (onComplete) onComplete();
    },

    pullFromCloud: async () => {
        if (!StorageService.currentUser) return;

        const binId = StorageService.getBinId(StorageService.currentUser);
        console.log(`Pulling cloud data for bin: ${binId}`);

        try {
            // Using a simple public bin approach for demo
            // In a real app, this would be a secure authenticated fetch
            const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
                headers: { 'X-Bin-Meta': 'false' }
            });

            if (response.ok) {
                const cloudData = await response.json();
                console.log("Cloud sync successful:", cloudData);

                // Merge logic: Simple "Latest wins" based on timestamps if we had them, 
                // but for demo, cloud data (most recent sync from any device) takes priority.
                StorageService.saveData(cloudData, false); // save locally without triggering another sync
                return cloudData;
            }
        } catch (e) {
            console.warn("Cloud sync failed (Network or Bin not found). Using local data.", e);
        }
    },

    pushToCloud: async (data) => {
        if (!StorageService.currentUser) return;

        const binId = StorageService.getBinId(StorageService.currentUser);
        console.log(`Pushing data to cloud bin: ${binId}`);

        try {
            await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Bin-Meta': 'false'
                },
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.error("Failed to push to cloud", e);
        }
    },

    getBinId: (name) => {
        // We'll use a fixed bin for "Sai" or generate one.
        // For the demo, we map specific names to specific public bin IDs.
        // In reality, you'd store this in a real user database.
        const bins = {
            'sai': '6776269cad19ca34f8e56dc8', // Example public bin ID
            'default': '6776269cad19ca34f8e56dc8'
        };
        return bins[name.toLowerCase()] || bins['default'];
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

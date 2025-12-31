import { StorageService } from './StorageService';

export const GracePeriodService = {
    isGraceDay: (system, date) => {
        const data = StorageService.getData();
        const systemGrace = data.graceDays?.[system] || [];
        return systemGrace.includes(date);
    },

    canApplyGrace: (system) => {
        const data = StorageService.getData();
        const systemGrace = data.graceDays?.[system] || [];

        const today = new Date();
        const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        // Check if any date in systemGrace starts with currentMonthPrefix
        const usedThisMonth = systemGrace.some(date => date.startsWith(currentMonthPrefix));

        return !usedThisMonth;
    },

    applyGrace: (system) => {
        const today = StorageService.getToday();

        if (!GracePeriodService.canApplyGrace(system)) {
            throw new Error("Grace limit reached for this month.");
        }

        const data = StorageService.getData();
        if (!data.graceDays) data.graceDays = {};
        if (!data.graceDays[system]) data.graceDays[system] = [];

        if (!data.graceDays[system].includes(today)) {
            data.graceDays[system].push(today);
            StorageService.saveData(data);
        }
    },

    logMissedReason: (system, date, habitId, reason) => {
        // We store this in the normal log, but with status 'failed' or 'missed' and reason in details
        StorageService.logHabit(system, date, habitId, 'failed', reason);
    },

    removeGrace: (system, date) => {
        const data = StorageService.getData();
        if (data.graceDays && data.graceDays[system]) {
            data.graceDays[system] = data.graceDays[system].filter(d => d !== date);
            StorageService.saveData(data);
        }
    }
};

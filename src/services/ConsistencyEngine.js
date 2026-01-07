import { SYSTEMS } from './models';
import { StorageService } from './StorageService';

// Helper to get all dates between start and end
const getDateRange = (startDate, endDate) => {
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export const ConsistencyEngine = {
    // Get list of mandatory IDs for a system based on current config
    // Note: This calculates consistency based on CURRENT settings.
    // If a habit was deleted, it's removed from legacy calcs too unless we do strict historical snapshotting (complex).
    // Requirement: "Consistency calculations must Respect habit’s Include in Consistency flag"
    // "Editing habits should NOT break past history" -> usually implies old scores stay same?
    // But if we recalc on the fly ("Till Now"), we usually use current rules or logs.
    // Simplest approach for "Till Now":
    // Iterate dates. For each date, what SHOULD have been done?
    // If we lack historical metadata of "what was active on date X", we can only use "what is active now".
    // Or, we count "Completed / Mandatory". If a habit is deleted, it's gone from Mandatory.
    // If we want "History Safety" meaning "If I deleted a habit I did last year, my score shouldn't drop", 
    // actually, removing a mandatory habit INCREASES consistency (less denominator).
    // Risk: Removing a habit I did makes detailed history look empty, but score might go up.
    // User says: "Old records must remain intact".
    // This implies if I look at Jan 1st, I see the habits I had then.
    // This requires versioning or storing the expected schema per day. 
    // Given constraints, I will calculate based on "Habits currently existing in DB" + "Legacy Logs".
    // Actually, Till-Now Consistency usually means:
    // (Total Valid Completions in History) / (Total Mandatory Opportunities in History)
    // If I assume `User` has `startDate`. 
    // Let's stick to: Denominator = (Days * CurrentMandatoryCount). This is standard for simple apps.
    // Refined: Denominator = Sum over days of (Mandatory Count). 
    // Without historical config, we use Current Mandatory Count.

    getMandatoryHabits: (system, frequencyFilter = null) => {
        const data = StorageService.getData();
        const habits = data.habits[system] || [];
        return habits
            .filter(h => {
                if (h.includeInConsistency === false) return false;
                if (h.mandatory === false) return false;
                if (frequencyFilter && h.frequency !== frequencyFilter) return false;
                return true;
            })
            .map(h => h.id);
    },

    calculateDailyConsistency: (system, date, logs) => {
        const dayLog = logs[date] || {};
        // Only count DAILY habits for daily consistency
        const mandatoryIds = ConsistencyEngine.getMandatoryHabits(system, 'daily');

        if (mandatoryIds.length === 0) return 0;

        let completed = 0;
        mandatoryIds.forEach(id => {
            // Logic: A habit is done if it is in logs and status is completed.
            if (dayLog[id] && dayLog[id].status === 'completed') {
                completed++;
            }
        });

        return (completed / mandatoryIds.length) * 100;
    },

    calculateTillNow: (system) => {
        const data = StorageService.getData();
        const logs = data.logs[system];
        const systemGrace = data.graceDays?.[system] || [];

        // Only count DAILY habits for Till-Now consistency (exclude monthly)
        const mandatoryIds = ConsistencyEngine.getMandatoryHabits(system, 'daily');

        if (mandatoryIds.length === 0) return 0; // Avoid divide by zero

        // Get all dates that have logs (only count days where user actually tracked)
        const loggedDates = Object.keys(logs);

        if (loggedDates.length === 0) return 0; // No data logged yet

        let totalPossible = 0;
        let totalCompleted = 0;

        loggedDates.forEach(date => {
            // Skip grace days
            if (systemGrace.includes(date)) return;

            totalPossible += mandatoryIds.length;

            const dayLog = logs[date] || {};
            mandatoryIds.forEach(id => {
                if (dayLog[id] && dayLog[id].status === 'completed') {
                    totalCompleted++;
                }
            });
        });

        return totalPossible === 0 ? 0 : (totalCompleted / totalPossible) * 100;
    },

    calculateStreak: (system) => {
        const data = StorageService.getData();
        const today = StorageService.getToday();
        const logs = data.logs[system];
        const systemGrace = data.graceDays?.[system] || [];

        let streak = 0;
        let current = new Date(today);

        while (true) {
            const dateStr = current.toISOString().split('T')[0];
            const consistency = ConsistencyEngine.calculateDailyConsistency(system, dateStr, logs);
            const isGrace = systemGrace.includes(dateStr);

            if (consistency === 100 || isGrace) {
                streak++;
            } else {
                if (dateStr === today) {
                    // If today is not done, ignore it for streak purposes (unless we want strict)
                    // If we ignore today, we don't break, but we don't add.
                } else {
                    break;
                }
            }

            current.setDate(current.getDate() - 1);
            if (dateStr < data.userProfile.startDate) break;
        }

        return streak;
    }
};

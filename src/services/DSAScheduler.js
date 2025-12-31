import { StorageService } from './StorageService';

const DIFFICULTY = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard'
};

const WEEKLY_DISTRIBUTION = [
    DIFFICULTY.EASY, DIFFICULTY.EASY,
    DIFFICULTY.MEDIUM, DIFFICULTY.MEDIUM, DIFFICULTY.MEDIUM,
    DIFFICULTY.HARD, DIFFICULTY.HARD
];

export const DSAScheduler = {
    getWeekKey: (date) => {
        // Get start of week (Monday)
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().split('T')[0];
    },

    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    ensureSchedule: () => {
        const data = StorageService.getData();
        const today = StorageService.getToday();
        const weekKey = DSAScheduler.getWeekKey(today);

        if (!data.dsaSchedule || data.dsaSchedule.weekStart !== weekKey) {
            // New week or first run
            // Requirement: 2 Easy, 3 Medium, 2 Hard
            const weeklyPool = [
                DIFFICULTY.EASY, DIFFICULTY.EASY,
                DIFFICULTY.MEDIUM, DIFFICULTY.MEDIUM, DIFFICULTY.MEDIUM,
                DIFFICULTY.HARD, DIFFICULTY.HARD
            ];

            const plan = DSAScheduler.shuffleArray([...weeklyPool]);
            data.dsaSchedule = {
                weekStart: weekKey,
                plan: plan
            };
            StorageService.saveData(data);
        }
        return data.dsaSchedule;
    },

    getDifficultyForDate: (dateStr) => {
        const schedule = DSAScheduler.ensureSchedule();
        const targetDate = new Date(dateStr);
        // Map to 0-6 relative to week start
        const start = new Date(schedule.weekStart);

        // Simple day of week fallback if week logic is complex:
        // WeekStart is Monday.
        const day = targetDate.getDay();
        const idx = day === 0 ? 6 : day - 1;
        return schedule.plan[idx] || DIFFICULTY.MEDIUM;
    },

    getTodayDifficulty: () => {
        const today = StorageService.getToday();
        return DSAScheduler.getDifficultyForDate(today);
    }
};

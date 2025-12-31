export const SYSTEMS = {
    STUDY: 'study',
    NORMAL: 'normal'
};

export const HABIT_TYPES = {
    // Legacy/Internal types for special components
    DSA_SYSTEM: 'dsa_system',
    COUNT: 'count', // For monthly limits

    // Generic types for user-created habits
    GENERIC: 'generic'
};

export const COMPLETION_TYPES = {
    TICK: 'tick',
    DETAILS: 'details',
    BOTH: 'both',
    DSA_SYSTEM_LOGIC: 'dsa_system_logic' // Special case for the MCQ card
};

export const FREQUENCY = {
    DAILY: 'daily',
    MONTHLY: 'monthly'
};

// Initial Seed Data
export const INITIAL_HABITS = {
    [SYSTEMS.STUDY]: [
        {
            id: 'dsa_system',
            label: 'Daily DSA Question',
            type: HABIT_TYPES.DSA_SYSTEM, // Triggers special card UI
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.DSA_SYSTEM_LOGIC,
            includeInConsistency: true,
            mandatory: true,
            system: SYSTEMS.STUDY
        },
        {
            id: 'dsa_self',
            label: 'DSA Solved (Self)',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.BOTH, // "Tick + Description"
            includeInConsistency: true,
            mandatory: true,
            placeholder: 'Problem name / details',
            system: SYSTEMS.STUDY
        },
        {
            id: 'dsa_rev',
            label: 'DSA Revision',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.BOTH, // Changed to BOTH to allow tick + text? Or user just said "description box". 
            // User said: "Description box... What was revised"
            // "Habit Completion UI Logic... If Description only -> show text area"
            // Let's use DETAILS for "Notes" maybe? 
            // For revision, usually you want to say "I did it" AND "Here is what".
            // User said: "DSA Self-Solved & Revision... Always show a description box".
            // Let's us DETAILS for now or BOTH. BOTH gives a satisfying checkbox.
            includeInConsistency: true,
            mandatory: true,
            placeholder: 'What problem did you revise?',
            system: SYSTEMS.STUDY
        },
        {
            id: 'study_time',
            label: 'Study 2 Hours (Full Stack/Java)',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.TICK,
            includeInConsistency: true,
            mandatory: true,
            system: SYSTEMS.STUDY
        },
        {
            id: 'notes',
            label: 'Read Notes / PDF',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.DETAILS, // Requirement: "PDF / Notes must ALWAYS have description box"
            includeInConsistency: true,
            mandatory: true,
            placeholder: 'What did you study / write in PDF today?',
            system: SYSTEMS.STUDY
        }
    ],
    [SYSTEMS.NORMAL]: [
        {
            id: 'god_slokam',
            label: 'Read 1 God Slokam',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.TICK,
            includeInConsistency: true,
            mandatory: true,
            system: SYSTEMS.NORMAL
        },
        {
            id: 'insta_limit',
            label: 'Instagram ≤ 30 mins',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.TICK,
            includeInConsistency: true,
            mandatory: true,
            system: SYSTEMS.NORMAL
        },
        {
            id: 'skin_care',
            label: 'Skin Care',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.TICK,
            includeInConsistency: true,
            mandatory: true,
            system: SYSTEMS.NORMAL
        },
        {
            id: 'hair_care',
            label: 'Hair Care',
            type: HABIT_TYPES.GENERIC,
            frequency: FREQUENCY.DAILY,
            completionType: COMPLETION_TYPES.TICK,
            includeInConsistency: true,
            mandatory: true,
            system: SYSTEMS.NORMAL
        },
        {
            id: 'food_order',
            label: 'Outside Food (≤ 1/month)',
            type: HABIT_TYPES.COUNT,
            frequency: FREQUENCY.MONTHLY,
            limit: 1,
            includeInConsistency: true, // Monthly habits included? User said "Monthly Habits (Included)"
            system: SYSTEMS.NORMAL
        },
        {
            id: 'soft_drink',
            label: 'Soft Drinks (≤ 1/month)',
            type: HABIT_TYPES.COUNT,
            frequency: FREQUENCY.MONTHLY,
            limit: 1,
            includeInConsistency: true,
            system: SYSTEMS.NORMAL
        }
    ]
};

export const INITIAL_DATA = {
    userProfile: {
        name: 'User',
        startDate: new Date().toISOString().split('T')[0]
    },
    settings: {
        graceDaysPerMonth: 1
    },
    // Habits are now stored in data to be editable
    habits: INITIAL_HABITS,
    logs: {
        [SYSTEMS.STUDY]: {},
        [SYSTEMS.NORMAL]: {}
    },
    monthlyUsage: {},
    graceDays: {}
};

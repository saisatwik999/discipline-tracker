// Test script to verify consistency calculation fix
// Run this in the browser console after logging in

console.log('=== Consistency Calculation Test ===');

const data = JSON.parse(localStorage.getItem('discipline_tracker_user_sai'));

console.log('\n1. User Profile:');
console.log('   Start Date:', data.userProfile.startDate);
console.log('   Username:', data.userProfile.username);

console.log('\n2. Study System:');
const studyLogs = data.logs.study;
const studyLogDates = Object.keys(studyLogs);
console.log('   Logged Dates:', studyLogDates);
console.log('   Number of logged days:', studyLogDates.length);

console.log('\n3. Study Habits:');
const studyHabits = data.habits.study.filter(h =>
    h.includeInConsistency !== false &&
    h.mandatory !== false &&
    h.frequency === 'daily'
);
console.log('   Mandatory Daily Habits:', studyHabits.map(h => h.title));
console.log('   Count:', studyHabits.length);

console.log('\n4. Grace Days:');
const graceDays = data.graceDays?.study || [];
console.log('   Grace Days:', graceDays);

console.log('\n5. Detailed Log Analysis:');
studyLogDates.forEach(date => {
    const dayLog = studyLogs[date];
    const habitIds = Object.keys(dayLog);
    const completed = habitIds.filter(id => dayLog[id].status === 'completed').length;
    console.log(`   ${date}: ${completed}/${studyHabits.length} completed`);
});

console.log('\n6. Expected Calculation:');
let totalPossible = 0;
let totalCompleted = 0;

studyLogDates.forEach(date => {
    if (graceDays.includes(date)) {
        console.log(`   ${date}: GRACE DAY (skipped)`);
        return;
    }

    totalPossible += studyHabits.length;

    const dayLog = studyLogs[date] || {};
    studyHabits.forEach(habit => {
        if (dayLog[habit.id] && dayLog[habit.id].status === 'completed') {
            totalCompleted++;
        }
    });
});

const expectedConsistency = totalPossible === 0 ? 0 : (totalCompleted / totalPossible) * 100;

console.log(`   Total Possible: ${totalPossible}`);
console.log(`   Total Completed: ${totalCompleted}`);
console.log(`   Expected Consistency: ${expectedConsistency.toFixed(2)}%`);

console.log('\n7. Actual UI Consistency:');
console.log('   Check the "Till-Now Consistency" panel in the UI');
console.log('   It should match the expected value above');

console.log('\n=== Test Complete ===');


import { DSA_QUESTIONS_FULL } from './src/services/DSA_QUESTIONS_FULL.js';

function verify() {
    const questions = DSA_QUESTIONS_FULL;
    const seenNames = new Set();
    const duplicates = [];

    questions.forEach((q, idx) => {
        if (seenNames.has(q.question)) {
            duplicates.push({ id: q.id, question: q.question });
        }
        seenNames.add(q.question);
    });

    console.log(`Verified ${questions.length} questions.`);
    if (duplicates.length > 0) {
        console.error(`Found ${duplicates.length} duplicates!`);
        console.table(duplicates);
    } else {
        console.log("No duplicate question strings found. All 366 days are unique!");
    }
}

// Check for correct number of questions
if (DSA_QUESTIONS_FULL.length < 365) {
    console.error(`Insufficient questions: ${DSA_QUESTIONS_FULL.length}`);
} else {
    console.log(`Question count check passed: ${DSA_QUESTIONS_FULL.length}`);
}

// verify(); // Uncomment and adapt path if running via node

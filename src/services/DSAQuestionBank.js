export const DSA_QUESTIONS = [
    {
        id: 1,
        question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correct: 1,
        explanation: "In a balanced BST, the height of the tree is logarithmic relative to the number of nodes. Therefore, searching for an element involves traversing down the height of the tree.",
        optionExplanations: [
            "O(n): This is the worst-case time complexity for a degenerate (unbalanced) BST or a linear search.",
            "O(log n): Correct. A balanced BST reduces the search operations by half at every step.",
            "O(1): This is the time complexity for a Hash Map (average case), not a BST.",
            "O(n log n): This is the time complexity for efficient sorting algorithms like Merge Sort, not searching in a BST."
        ],
        difficulty: "Easy"
    },
    {
        id: 2,
        question: "Which data structure follows the LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1,
        explanation: "A Stack adds and removes elements from the same 'top' end, meaning the last element inserted is the first one to be removed.",
        optionExplanations: [
            "Queue: Follows FIFO (First In First Out).",
            "Stack: Correct. It uses LIFO.",
            "Array: Elements can be accessed randomly by index.",
            "Linked List: Elements are accessed sequentially; it doesn't strictly enforce LIFO or FIFO unless used as such."
        ],
        difficulty: "Easy"
    },
    {
        id: 3,
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
        correct: 1,
        explanation: "Quick Sort's worst case occurs when the pivot selection is poor (e.g., always picking the smallest or largest element in a sorted array), leading to unbalanced partitions.",
        optionExplanations: [
            "O(n log n): This is the average-case time complexity, or the worst-case for Merge Sort.",
            "O(n^2): Correct. This happens when the pivot divides the array into size 1 and n-1 repeatedly.",
            "O(n): This is the time complexity for linear algorithms like Counting Sort (under specific constraints).",
            "O(log n): This is the time complexity for Binary Search."
        ],
        difficulty: "Medium"
    },
    {
        id: 4,
        question: "Which of the following is NOT a stable sorting algorithm?",
        options: ["Merge Sort", "Insertion Sort", "Quick Sort", "Bubble Sort"],
        correct: 2,
        explanation: "A stable sort preserves the relative order of equal elements. Quick Sort swaps elements across partitions, which can disrupt this order.",
        optionExplanations: [
            "Merge Sort: Stable. It merges equal elements from the left subarray first.",
            "Insertion Sort: Stable. It shifts elements but doesn't swap equal ones past each other.",
            "Quick Sort: Correct. It is inherently unstable due to long-distance swaps.",
            "Bubble Sort: Stable. It only swaps adjacent elements if they are in the wrong order."
        ],
        difficulty: "Medium"
    },
    {
        id: 5,
        question: "In a Hash Map, what is the primary purpose of a hash function?",
        options: ["To sort the keys", "To map keys to array indices", "To encrypt the data", "To compress the data"],
        correct: 1,
        explanation: "The hash function takes a key input and returns an integer (hash code) which is then mapped to an index in the underlying array (bucket).",
        optionExplanations: [
            "To sort the keys: Hash Maps do not maintain order.",
            "To map keys to array indices: Correct. This allows for O(1) average access time.",
            "To encrypt the data: Hashing for security is different (cryptographic hashing) than data structure hashing.",
            "To compress the data: While some hashing can be used in compression, it's not the purpose in a Hash Map."
        ],
        difficulty: "Easy"
    },
    {
        id: 6,
        question: "What is the space complexity of a recursive Depth First Search (DFS) on a tree?",
        options: ["O(n)", "O(h)", "O(1)", "O(n^2)"],
        correct: 1,
        explanation: "The space complexity is determined by the maximum depth of the function call stack, which corresponds to the height (h) of the tree.",
        optionExplanations: [
            "O(n): This would be the case for a skewed tree where h = n.",
            "O(h): Correct. h is the height of the tree. In a balanced tree, h = log n.",
            "O(1): This is the space complexity for iterative algorithms that don't use a stack.",
            "O(n^2): Incorrect. DFS does not store quadratic data."
        ],
        difficulty: "Easy"
    },
    {
        id: 7,
        question: "Which graph traversal algorithm uses a Queue?",
        options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Dijkstra's Algorithm", "Prim's Algorithm"],
        correct: 1,
        explanation: "BFS explores neighbors layer by layer, so it needs a FIFO structure (Queue) to track the order of visitation.",
        optionExplanations: [
            "Depth First Search (DFS): Uses a Stack (or recursion).",
            "Breadth First Search (BFS): Correct. It uses a Queue.",
            "Dijkstra's Algorithm: Uses a Priority Queue.",
            "Prim's Algorithm: Uses a Priority Queue."
        ],
        difficulty: "Easy"
    },
    {
        id: 8,
        question: "In algorithm analysis, what does 'Big O' notation primarily describe?",
        options: ["Exact execution time", "Lower bound of growth", "Upper bound of growth rate", "Average case scenario"],
        correct: 2,
        explanation: "Big O notation describes the worst-case scenario or the upper bound of how the algorithm's runtime/space grows as input size increases.",
        optionExplanations: [
            "Exact execution time: No, that depends on hardware.",
            "Lower bound of growth: That's Big Omega (Ω).",
            "Upper bound of growth rate: Correct. It puts a ceiling on the growth.",
            "Average case scenario: That's usually denote by Theta (Θ) if it matches, but Big O is strictly Upper Bound."
        ],
        difficulty: "Medium"
    },
    {
        id: 9,
        question: "What is the primary advantage of a Linked List over an Array?",
        options: ["Random access", "Memory locality", "Dynamic size and efficient insertions/deletions", "Lower memory overhead"],
        correct: 2,
        explanation: "Linked Lists do not require a contiguous block of memory. Nodes can be added or removed by changing pointers (O(1) if location is known), unlike arrays which may need resizing or shifting.",
        optionExplanations: [
            "Random access: Arrays simplify this (O(1)). Linked Lists are O(n).",
            "Memory locality: Arrays have better cache locality.",
            "Dynamic size and efficient insertions/deletions: Correct. No resizing or shifting needed.",
            "Lower memory overhead: Incorrect. Linked lists use extra memory for pointers."
        ],
        difficulty: "Easy"
    },
    {
        id: 10,
        question: "Which problem class consists of problems verifiable in polynomial time?",
        options: ["P", "NP", "NP-Complete", "NP-Hard"],
        correct: 1,
        explanation: "NP stands for Nondeterministic Polynomial time. It refers to problems where a solution, if given, can be *verified* quickly (polynomial time).",
        optionExplanations: [
            "P: Problems *solvable* in polynomial time.",
            "NP: Correct. Verifiable in polynomial time.",
            "NP-Complete: The hardest problems in NP; if one is in P, all are.",
            "NP-Hard: Depending on definition, at least as hard as NP, maybe harder (and not necessarily in NP)."
        ],
        difficulty: "Hard"
    },
    {
        id: 11,
        question: "What is the result of applying a bitwise AND (&) between 1010 and 1100?",
        options: ["1000", "1110", "1010", "1100"],
        correct: 0,
        explanation: "1010 (binary) & 1100 (binary): 1&1=1, 0&1=0, 1&0=0, 0&0=0. Result: 1000.",
        optionExplanations: [
            "1000: Correct.",
            "1110: Result of OR (|).",
            "1010: Incorrect.",
            "1100: Incorrect."
        ],
        difficulty: "Easy"
    },
    {
        id: 12,
        question: "Which data structure is most efficient for implementing a priority queue?",
        options: ["Array", "Linked List", "Binary Heap", "Hash Map"],
        correct: 2,
        explanation: "A Binary Heap allows for extraction of the minimum/maximum element in O(log n) time and insertion in O(log n).",
        optionExplanations: [
            "Array: Insertion or deletion would be O(n) to maintain order.",
            "Linked List: Similar O(n) issues.",
            "Binary Heap: Correct. Specifically designed for priority.",
            "Hash Map: Cannot easily find min/max."
        ],
        difficulty: "Medium"
    },
    {
        id: 13,
        question: "What is the main characteristic of a Greedy Algorithm?",
        options: ["It tries all possibilities", "It makes the locally optimal choice at each step", "It divides the problem into subproblems", "It uses backtracking"],
        correct: 1,
        explanation: "Greedy algorithms make the best choice available at the current moment, hoping it leads to a globally optimal solution.",
        optionExplanations: [
            "It tries all possibilities: That's Brute Force.",
            "It makes the locally optimal choice at each step: Correct.",
            "It divides the problem into subproblems: That's Divide and Conquer or Dynamic Programming.",
            "It uses backtracking: That's Backtracking."
        ],
        difficulty: "Medium"
    },
    {
        id: 14,
        question: "In a Directed Acyclic Graph (DAG), what does a topological sort produce?",
        options: ["A cycle", "A shortest path", "A linear ordering of vertices", "A minimum spanning tree"],
        correct: 2,
        explanation: "Topological sort generates a linear ordering where for every directed edge u -> v, vertex u comes before v.",
        optionExplanations: [
            "A cycle: DAGs have no cycles. Topo sort detects cycles if it fails.",
            "A shortest path: No.",
            "A linear ordering of vertices: Correct.",
            "A minimum spanning tree: Applies to weighted graphs, produces a tree."
        ],
        difficulty: "Medium"
    },
    {
        id: 15,
        question: "Which traversal orders nodes left-root-right in a binary tree?",
        options: ["Pre-order", "In-order", "Post-order", "Level-order"],
        correct: 1,
        explanation: "In-order traversal visits the Left subtree, then the Root, then the Right subtree.",
        optionExplanations: [
            "Pre-order: Root-Left-Right.",
            "In-order: Correct. Left-Root-Right.",
            "Post-order: Left-Right-Root.",
            "Level-order: Breadth-first, level by level."
        ],
        difficulty: "Easy"
    },
    {
        id: 16,
        question: "Memoization is a technique primarily associated with which algorithmic paradigm?",
        options: ["Greedy", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
        correct: 2,
        explanation: "Dynamic Programming solves problems by breaking them into overlapping subproblems. Memoization caches the results of these subproblems to avoid redundant work.",
        optionExplanations: [
            "Greedy: Rarely uses caching.",
            "Divide and Conquer: Subproblems are usually disjoint (like Merge Sort).",
            "Dynamic Programming: Correct. Top-down DP uses memoization.",
            "Backtracking: Sometimes uses pruning, but memoization is DP core."
        ],
        difficulty: "Medium"
    },
    {
        id: 17,
        question: "What is the worst-case lookup time for a Trie (Prefix Tree) with string capability?",
        options: ["O(n)", "O(L) where L is string length", "O(log n)", "O(1)"],
        correct: 1,
        explanation: "To looks up a string of length L, you traverse L nodes. The complexity is proportional to the key length, not the total number of keys (n).",
        optionExplanations: [
            "O(n): No, it doesn't check all stored keys.",
            "O(L): Correct. L is the length of the string being searched.",
            "O(log n): No.",
            "O(1): No, must process characters."
        ],
        difficulty: "Medium"
    },
    {
        id: 18,
        question: "Which of the following problems is unsolvable?",
        options: ["Sorting in O(n)", "The Halting Problem", "Travelling Salesman Problem", "Knapsack Problem"],
        correct: 1,
        explanation: "The Halting Problem (determining if a program will stop or run forever) was proven undecidable by Alan Turing.",
        optionExplanations: [
            "Sorting in O(n): Possible with constraints (Radix/Bucket sort).",
            "The Halting Problem: Correct. It is undecidable.",
            "Travelling Salesman Problem: Solvable, just computationally expensive (NP-Hard).",
            "Knapsack Problem: Solvable (NP-Complete/Weakly NP-Hard)."
        ],
        difficulty: "Hard"
    },
    {
        id: 19,
        question: "What prevents a standard Binary Search Tree from being efficient in worst-case?",
        options: ["Cycles", "Duplication", "Imbalance (skewing)", "Memory usage"],
        correct: 2,
        explanation: "If a BST becomes skewed (e.g., inserting 1, 2, 3, 4, 5 in order), it effectively becomes a Linked List with O(n) height.",
        optionExplanations: [
            "Cycles: Trees don't have cycles.",
            "Duplication: Can be handled.",
            "Imbalance (skewing): Correct. Makes operations O(n).",
            "Memory usage: Standard overhead."
        ],
        difficulty: "Easy"
    },
    {
        id: 20,
        question: "Which shortest path algorithm handles negative edge weights?",
        options: ["Dijkstra's", "Bellman-Ford", "BFS", "Prim's"],
        correct: 1,
        explanation: "Bellman-Ford can handle negative weights and can also detect negative weight cycles.",
        optionExplanations: [
            "Dijkstra's: Fails with negative weights (assumes once visited, shortest path is found).",
            "Bellman-Ford: Correct.",
            "BFS: Only for unweighted graphs.",
            "Prim's: For Minimum Spanning Trees."
        ],
        difficulty: "Medium"
    },
    {
        id: 21,
        question: "What is the height of a Red-Black Tree with n nodes?",
        options: ["O(n)", "O(log n)", "O(sqrt n)", "O(1)"],
        correct: 1,
        explanation: "Red-Black Trees satisfy properties that ensure the tree remains approximately balanced, guaranteeing O(log n) height.",
        optionExplanations: [
            "O(n): Only for unbalanced trees.",
            "O(log n): Correct. It guarantees logarithmic height.",
            "O(sqrt n): No.",
            "O(1): No."
        ],
        difficulty: "Hard"
    }
];

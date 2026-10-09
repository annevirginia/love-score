"""
Scoring module for Love Score Quiz
Calculates compatibility score based on couple answers across all 20 questions.
"""

from typing import List, Dict, Any

CATEGORY_MAPPING = {
    # 0-indexed indices for 20 questions (4 questions per dimension):
    "💖 Romantic Passion & Chemistry": [0, 3, 10, 17],    # Q1, Q4, Q11, Q18
    "🥰 Emotional Intimacy & Empathy": [1, 9, 14, 16],    # Q2, Q10, Q15, Q17
    "😂 Playful Connection & Humor": [2, 6, 13, 15],     # Q3, Q7, Q14, Q16
    "🌹 Future Vision & Life Goals": [5, 7, 18, 19],     # Q6, Q8, Q19, Q20
    "✨ Daily Devotion & Couple Rhythm": [4, 8, 11, 12]   # Q5, Q9, Q12, Q13
}

CATEGORY_WEIGHTS = {
    "💖 Romantic Passion & Chemistry": 0.20,
    "🥰 Emotional Intimacy & Empathy": 0.20,
    "😂 Playful Connection & Humor": 0.20,
    "🌹 Future Vision & Life Goals": 0.20,
    "✨ Daily Devotion & Couple Rhythm": 0.20
}

TIERS = [
    (71, 100, "Perfect Match! 💍", "Perfect Match! You two are amazing together!"),
    (40, 70, "Good Connection! 🌷", "Good Connection! Keep understanding each other."),
    (0, 39, "Get Lost! 😂", "Get Lost! 😂 Maybe you both need more quality time!")
]


def calculate_love_score(answers1: List[int], answers2: List[int]) -> Dict[str, Any]:
    """
    answers1 and answers2 are lists of integer option numbers.
    Evaluates matches across question types:
      - who_is_more_likely
      - this_or_that
      - love_scale (1-5)
      - scenario & perspective (4 choices)
    """
    total_questions = min(len(answers1), len(answers2), 20)
    
    who_likely_indices = {2, 6, 11, 15}
    this_or_that_indices = {3, 7, 12, 14}
    scale_indices = {4, 8, 13, 17}

    question_matches = []
    for i in range(total_questions):
        a1 = answers1[i]
        a2 = answers2[i]

        if i in who_likely_indices:
            if a1 == a2:
                match = 1.0
            elif a1 == 3 or a2 == 3:
                match = 0.70
            else:
                match = 0.30
        elif i in this_or_that_indices:
            match = 1.0 if a1 == a2 else 0.40
        elif i in scale_indices:
            diff = abs(a1 - a2)
            match = max(0.0, min(1.0, 1.0 - (diff / 4.0)))
        else:
            diff = abs(a1 - a2)
            match = max(0.0, min(1.0, 1.0 - (diff / 3.0)))

        question_matches.append(match)
        
    categories_scores = {}
    weighted_sum = 0.0

    for cat, indices in CATEGORY_MAPPING.items():
        cat_matches = [
            question_matches[idx]
            for idx in indices
            if idx < len(question_matches)
        ]
        if cat_matches:
            avg_cat_match = sum(cat_matches) / len(cat_matches)
        else:
            avg_cat_match = 0.0
            
        cat_score = round(avg_cat_match * 100)
        categories_scores[cat] = cat_score
        weighted_sum += cat_score * CATEGORY_WEIGHTS.get(cat, 0.20)

    final_score = int(round(weighted_sum))
    final_score = max(0, min(100, final_score))

    tier_name = "Growing Together 🌷"
    tier_message = "A resilient, beautiful bond with sweet affection."

    for min_val, max_val, t_name, t_msg in TIERS:
        if min_val <= final_score <= max_val:
            tier_name = t_name
            tier_message = t_msg
            break

    return {
        "score": final_score,
        "tier": tier_name,
        "message": tier_message,
        "categories": categories_scores,
        "question_matches": [round(m * 100) for m in question_matches]
    }

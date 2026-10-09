// Script to build comprehensive 72-question bank covering all 9 required categories
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const questions = [
  // ==========================================
  // CATEGORY 1: 💖 Love and Relationship (8 Qs)
  // ==========================================
  {
    id: 1,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What is the single most romantic moment that would melt your heart completely?",
    prompt_p2: "What is the single most romantic moment that would melt your heart completely?",
    description: "Discover the exact romantic frequency that gives you both butterfly chills.",
    options: [
      { value: 1, text: "Slow dancing barefoot in the living room under fairy lights to our song 🎶" },
      { value: 2, text: "A surprise candlelit dinner on a quiet moonlit beach with whispered secrets 🌊" },
      { value: 3, text: "Waking up together on a rainy Sunday with cozy cuddles and breakfast in bed ☕" },
      { value: 4, text: "A breathtaking mountain road trip watching the sunset from the hood of the car 🌄" }
    ]
  },
  {
    id: 2,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How deeply do you believe in soulmates and destiny bringing you two together?",
    prompt_p2: "How deeply do you believe in soulmates and destiny bringing you two together?",
    description: "Rate your belief that the universe conspired to make your paths cross.",
    scaleMinLabel: "1 Heart: Practical & Rational",
    scaleMaxLabel: "5 Hearts: Written in the Stars ✨",
    options: [
      { value: 1, text: "1 Heart - We met by coincidence and choose each other daily" },
      { value: 2, text: "2 Hearts - A lucky timing, made stronger with effort" },
      { value: 3, text: "3 Hearts - A wonderful balance of choice and serendipity" },
      { value: 4, text: "4 Hearts - A powerful spiritual connection from day one" },
      { value: 5, text: "5 Hearts - 100% Cosmic Destiny! Soulmates across lifetimes 💍" }
    ]
  },
  {
    id: 3,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Which way of feeling loved means more to you?",
    prompt_p2: "Which way of feeling loved means more to you?",
    description: "Heartfelt spoken reassurance versus sweet physical presence.",
    options: [
      { value: 1, text: "🗣️ Hearing heartfelt words of affirmation and deep compliments" },
      { value: 2, text: "🫂 Gentle, quiet physical affection like holding hands and hugs" }
    ]
  },
  {
    id: 4,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What does unconditional love look like in your daily relationship?",
    prompt_p2: "What does unconditional love look like in your daily relationship?",
    description: "The deepest foundation of staying devoted through every season.",
    options: [
      { value: 1, text: "Forgiving mistakes quickly and never holding grudges 🕊️" },
      { value: 2, text: "Being each other's safest emotional sanctuary on hard days 🛡️" },
      { value: 3, text: "Cheering loudly for each other's wildest personal ambitions 🏆" },
      { value: 4, text: "Choosing each other every single morning, even during disagreements 💍" }
    ]
  },
  {
    id: 5,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who falls harder and loves more intensely every single day?",
    prompt_p2: "Who falls harder and loves more intensely every single day?",
    description: "Who wears their whole heart on their sleeve without hesitation?",
    options: [
      { value: 1, text: "{name1} is head-over-heels completely enchanted! 💕" },
      { value: 2, text: "{name2} loves with endless sweetness and passion! 🌹" },
      { value: 3, text: "Both of us are equally and hopelessly devoted! 💍" }
    ]
  },
  {
    id: 6,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How often do you feel grateful to have your partner in your life?",
    prompt_p2: "How often do you feel grateful to have your partner in your life?",
    description: "Rate the frequency of gratitude warming your heart.",
    scaleMinLabel: "1 Heart: On special occasions",
    scaleMaxLabel: "5 Hearts: Every breath & waking hour 💖",
    options: [
      { value: 1, text: "1 Heart - On birthdays and anniversaries" },
      { value: 2, text: "2 Hearts - When they do something extra sweet" },
      { value: 3, text: "3 Hearts - A couple of times each week" },
      { value: 4, text: "4 Hearts - At least once every single day" },
      { value: 5, text: "5 Hearts - Constantly! Life feels blessed with them by my side 🌹" }
    ]
  },
  {
    id: 7,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "partner_perspective",
    typeLabel: "🥰 Empathy Perspective",
    prompt_p1: "What is your partner's primary love language?",
    prompt_p2: "What is {name1}'s primary love language?",
    description: "Discover how well you decode each other's love frequency.",
    options: [
      { value: 1, text: "Quality Time — Uninterrupted, focused couple hours ⏳" },
      { value: 2, text: "Words of Affirmation — Sweet notes and genuine compliments 💌" },
      { value: 3, text: "Physical Touch — Cuddles, holding hands, and kisses 🫂" },
      { value: 4, text: "Acts of Service — Thoughtful help, morning coffee & care ☕" }
    ]
  },
  {
    id: 8,
    category: "💖 Love and Relationship",
    categoryIcon: "💖",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Which romantic milestone feels most magical?",
    prompt_p2: "Which romantic milestone feels most magical?",
    description: "The sparkling spark of beginnings vs the unbreakable bond of time.",
    options: [
      { value: 1, text: "🦋 The electric butterfly stage of first realizing you're in love" },
      { value: 2, text: "🏰 The cozy, unbreakable security of years of deep trust" }
    ]
  },

  // ==========================================
  // CATEGORY 2: 🥰 Understanding Each Other (8 Qs)
  // ==========================================
  {
    id: 9,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "partner_perspective",
    typeLabel: "🥰 Empathy Perspective",
    prompt_p1: "When you are stressed or overwhelmed, what is your secret craving for comfort?",
    prompt_p2: "When {name1} is stressed or overwhelmed, what do they secretly crave most?",
    description: "Tests how intimately you read your partner's unspoken emotional cravings.",
    options: [
      { value: 1, text: "A long, tight, silent hug without needing to explain anything 🫂" },
      { value: 2, text: "Their favorite comfort food, snacks, and sweet treats delivered softly 🍫" },
      { value: 3, text: "30 minutes of undisturbed peaceful alone time to decompress 🧘" },
      { value: 4, text: "Deep listening where they can vent freely without unsolicited advice 🗣️" }
    ]
  },
  {
    id: 10,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "partner_perspective",
    typeLabel: "🥰 Empathy Perspective",
    prompt_p1: "What is the fastest way to instantly make YOU smile when you're feeling grumpy?",
    prompt_p2: "What is the fastest way to instantly make {name1} smile when they're grumpy?",
    description: "The secret cheat-code to unlocking your partner's bright grin.",
    options: [
      { value: 1, text: "Whispering silly jokes and doing funny goofy dances 🤪" },
      { value: 2, text: "Surprising them with their favorite iced drink or sweet dessert 🧋" },
      { value: 3, text: "Gentle forehead kisses and playing softly with their hair 💆" },
      { value: 4, text: "Admitting they were right and making them laugh about it 😇" }
    ]
  },
  {
    id: 11,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "When solving couple misunderstandings, which is more important?",
    prompt_p2: "When solving couple misunderstandings, which is more important?",
    description: "Emotional resonance vs practical problem-solving.",
    options: [
      { value: 1, text: "🫂 Validating emotions and feeling deeply understood first" },
      { value: 2, text: "💡 Finding a clear, calm, practical step-by-step solution" }
    ]
  },
  {
    id: 12,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "How do you know when your partner is quietly upset without them saying a word?",
    prompt_p2: "How do you know when {name1} is quietly upset without them saying a word?",
    description: "The subtle micro-signals that reveal inner emotional storms.",
    options: [
      { value: 1, text: "They become unusually quiet and stop sharing little details 🤫" },
      { value: 2, text: "Their texting tone shifts from playful emojis to short replies 📱" },
      { value: 3, text: "They start sighing gently and fidget with their hands 💭" },
      { value: 4, text: "They withdraw physically and need extra gentle reassurance 🫂" }
    ]
  },
  {
    id: 13,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How accurately can you predict your partner's reaction before it even happens?",
    prompt_p2: "How accurately can you predict {name1}'s reaction before it even happens?",
    description: "Rate your telepathic couple prediction accuracy.",
    scaleMinLabel: "1 Heart: Often surprised",
    scaleMaxLabel: "5 Hearts: Telepathic Mind Reader! 🧠✨",
    options: [
      { value: 1, text: "1 Heart - I still get surprised often" },
      { value: 2, text: "2 Hearts - I get it right about half the time" },
      { value: 3, text: "3 Hearts - I can guess their general mood accurately" },
      { value: 4, text: "4 Hearts - I usually finish their sentences and thoughts" },
      { value: 5, text: "5 Hearts - 100% Telepathic! We think with one single brain 💕" }
    ]
  },
  {
    id: 14,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "partner_perspective",
    typeLabel: "🥰 Empathy Perspective",
    prompt_p1: "What is your biggest unspoken fear in life?",
    prompt_p2: "What do you think is {name1}'s biggest unspoken vulnerability?",
    description: "Treading gently into the deepest, tender chambers of the heart.",
    options: [
      { value: 1, text: "Not reaching their full potential or letting loved ones down 🌠" },
      { value: 2, text: "Losing the people they cherish most in the world 💔" },
      { value: 3, text: "Being misunderstood or judged unfairly by others 🥀" },
      { value: 4, text: "Uncertainty about what the distant future holds 🌫️" }
    ]
  },
  {
    id: 15,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "After a long exhausting day, how do you recharge together?",
    prompt_p2: "After a long exhausting day, how do you recharge together?",
    description: "Quiet companionable silence vs lively conversation.",
    options: [
      { value: 1, text: "🛋️ Companionable silence — cuddling on the couch in peace" },
      { value: 2, text: "🗣️ Pouring tea and talking through every funny moment of the day" }
    ]
  },
  {
    id: 16,
    category: "🥰 Understanding Each Other",
    categoryIcon: "🥰",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What makes you feel most profoundly respected by your partner?",
    prompt_p2: "What makes {name1} feel most profoundly respected by you?",
    description: "The core pillars of mutual honor and psychological safety.",
    options: [
      { value: 1, text: "Seeking their opinion before making important life decisions 🤝" },
      { value: 2, text: "Never interrupting when they are sharing something vulnerable 👂" },
      { value: 3, text: "Bragging about their talents and accomplishments to others 🌟" },
      { value: 4, text: "Respecting their boundaries and personal space without pushback 🛡️" }
    ]
  },

  // ==========================================
  // CATEGORY 3: 📸 Memories (8 Qs)
  // ==========================================
  {
    id: 17,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who remembers the exact dates and little details of your anniversary and milestones?",
    prompt_p2: "Who remembers the exact dates and little details of your anniversary and milestones?",
    description: "The official couple historian and memory vault keeper!",
    options: [
      { value: 1, text: "{name1} remembers every minute, outfit, and timestamp! 📅" },
      { value: 2, text: "{name2} has an encyclopedic calendar memory for us! 🧠" },
      { value: 3, text: "Both of us cherish every single anniversary equally! 💕" }
    ]
  },
  {
    id: 18,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "Which memory of the two of you gives you the warmest butterfly feeling?",
    prompt_p2: "Which memory of the two of you gives you the warmest butterfly feeling?",
    description: "Revisiting the golden frames of your personal fairytale.",
    options: [
      { value: 1, text: "The very first time our eyes locked and hearts skipped a beat 💓" },
      { value: 2, text: "Our first long late-night phone call that lasted until sunrise 🌅" },
      { value: 3, text: "That unexpected trip or adventure when everything went off script 🗺️" },
      { value: 4, text: "The quiet moment when you whispered 'I love you' for the first time 💌" }
    ]
  },
  {
    id: 19,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who was more nervous and had bigger butterflies on your very first date?",
    prompt_p2: "Who was more nervous and had bigger butterflies on your very first date?",
    description: "Looking back at the awkward, sweet beginning of your journey!",
    options: [
      { value: 1, text: "{name1} had sweating palms and stuttered sweetly 🦋" },
      { value: 2, text: "{name2} was blushing red and overthinking every outfit 👗" },
      { value: 3, text: "Both of us were so nervous our hearts were pounding! 💓" }
    ]
  },
  {
    id: 20,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How often do you look through old photos or reminisce about early dates?",
    prompt_p2: "How often do you look through old photos or reminisce about early dates?",
    description: "Rate how frequently you revisit your memory museum.",
    scaleMinLabel: "1 Heart: Rarely look back",
    scaleMaxLabel: "5 Hearts: Constant nostalgia & smiles 📸",
    options: [
      { value: 1, text: "1 Heart - We focus mainly on the present moment" },
      { value: 2, text: "2 Hearts - When a social media throwback pops up" },
      { value: 3, text: "3 Hearts - A couple times every month" },
      { value: 4, text: "4 Hearts - Weekly, smiling at cute old photos" },
      { value: 5, text: "5 Hearts - Constantly! Our photo album is my happy place 💖" }
    ]
  },
  {
    id: 21,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "How would you rather preserve your couple memories?",
    prompt_p2: "How would you rather preserve your couple memories?",
    description: "Physical vintage scrapbook vs digital video diary.",
    options: [
      { value: 1, text: "📖 A physical handcrafted scrapbook with tickets, notes & polaroids" },
      { value: 2, text: "🎥 A private aesthetic digital video album with our favorite soundtrack" }
    ]
  },
  {
    id: 22,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What was your favorite spontaneous, unplanned memory together?",
    prompt_p2: "What was your favorite spontaneous, unplanned memory together?",
    description: "The unplanned magic moments that became legend.",
    options: [
      { value: 1, text: "Getting caught in unexpected rain and dancing/laughing through it 🌧️" },
      { value: 2, text: "Driving late at night just to find midnight ice cream or snacks 🍦" },
      { value: 3, text: "An impulsive road trip where we decided to go on a whim 🚗" },
      { value: 4, text: "Staying up all night talking under the blankets until dawn 🌄" }
    ]
  },
  {
    id: 23,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who has kept more sentimental souvenirs, movie tickets, or little gifts?",
    prompt_p2: "Who has kept more sentimental souvenirs, movie tickets, or little gifts?",
    description: "Who holds on to the sweet physical relics of your love story?",
    options: [
      { value: 1, text: "{name1} keeps every single wrapper, card, and ticket stub 🎟️" },
      { value: 2, text: "{name2} has a secret keepsake box filled with memories 🎁" },
      { value: 3, text: "Both of us are total sentimental hoarders! 🥰" }
    ]
  },
  {
    id: 24,
    category: "📸 Memories",
    categoryIcon: "📸",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How vividly can you recall the exact outfit and vibe of your partner on your first date?",
    prompt_p2: "How vividly can you recall {name1}'s exact outfit and vibe on your first date?",
    description: "Testing the photographic sharpness of your romantic memory.",
    scaleMinLabel: "1 Heart: A bit hazy",
    scaleMaxLabel: "5 Hearts: Burned into memory forever! 🌟",
    options: [
      { value: 1, text: "1 Heart - General blur of emotions" },
      { value: 2, text: "2 Hearts - I remember the color, not the full outfit" },
      { value: 3, text: "3 Hearts - Good recall of the place and overall look" },
      { value: 4, text: "4 Hearts - Can picture the hair, smile, and shoes clearly" },
      { value: 5, text: "5 Hearts - Crystal clear! Every detail was etched into my soul 💕" }
    ]
  },

  // ==========================================
  // CATEGORY 4: 🌟 Personality (8 Qs)
  // ==========================================
  {
    id: 25,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is the bigger social butterfly at parties versus the cozy homebody?",
    prompt_p2: "Who is the bigger social butterfly at parties versus the cozy homebody?",
    description: "Extroverted party magnet or introverted blanket cocoon?",
    options: [
      { value: 1, text: "{name1} wants to meet everyone and stay out late 🎉" },
      { value: 2, text: "{name2} is the life of the room with endless energy 🦋" },
      { value: 3, text: "Both of us just want to escape the party and cuddle at home 🏡" }
    ]
  },
  {
    id: 26,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How deeply can you be your 100% silly, unmasked, goofy self around your partner?",
    prompt_p2: "How deeply can you be your 100% silly, unmasked, goofy self around your partner?",
    description: "Rate the psychological and emotional safety you share together.",
    scaleMinLabel: "1 Heart: Still slightly polite",
    scaleMaxLabel: "5 Hearts: Total goofball freedom! 🌈",
    options: [
      { value: 1, text: "1 Heart - I keep a small degree of polish and manners" },
      { value: 2, text: "2 Hearts - Open mostly, still careful sometimes" },
      { value: 3, text: "3 Hearts - Very comfortable and natural" },
      { value: 4, text: "4 Hearts - 95% goofy without any embarrassment" },
      { value: 5, text: "5 Hearts - Total freedom! Weird, silly, vulnerable & beloved 💖" }
    ]
  },
  {
    id: 27,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "When making a big decision, what leads your thought process?",
    prompt_p2: "When making a big decision, what leads your thought process?",
    description: "Intuitive gut feeling versus structured analytical logic.",
    options: [
      { value: 1, text: "💖 Heart & Gut Feeling — trusting intuition and emotions" },
      { value: 2, text: "🧠 Head & Logic — pros/cons list and calculated facts" }
    ]
  },
  {
    id: 28,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What quirky personality trait of your partner makes you adore them most?",
    prompt_p2: "What quirky personality trait of {name1} makes you adore them most?",
    description: "The adorable, unique eccentricities that make them uniquely them.",
    options: [
      { value: 1, text: "Their cute little victory dance when food arrives or something goes right 💃" },
      { value: 2, text: "How passionately they nerd out explaining their favorite hobbies 🤓" },
      { value: 3, text: "The funny sleepy voices and yawns they make when waking up 🥱" },
      { value: 4, text: "Their fierce loyalty and protectiveness over the people they love 🦁" }
    ]
  },
  {
    id: 29,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is more stubborn during a playful debate and refuses to admit defeat?",
    prompt_p2: "Who is more stubborn during a playful debate and refuses to admit defeat?",
    description: "Who will argue with Wikipedia to defend their quirky point?",
    options: [
      { value: 1, text: "{name1} will defend their point until the end of time! 🛡️" },
      { value: 2, text: "{name2} is impossible to sway once their mind is made up! 😤" },
      { value: 3, text: "Both of us are equally stubborn debaters! ⚖️" }
    ]
  },
  {
    id: 30,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Are you more spontaneous or a detailed planner?",
    prompt_p2: "Are you more spontaneous or a detailed planner?",
    description: "Impulsive spontaneity versus organized color-coded itineraries.",
    options: [
      { value: 1, text: "⚡ Spontaneous thrill-seeker — let's go where the wind blows!" },
      { value: 2, text: "📋 Structured planner — spreadsheet, bookings & peace of mind" }
    ]
  },
  {
    id: 31,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What is your secret superpower in this relationship?",
    prompt_p2: "What is your secret superpower in this relationship?",
    description: "The unique strength you bring to elevate the partnership.",
    options: [
      { value: 1, text: "Calm groundedness — being the anchor during emotional storms ⚓" },
      { value: 2, text: "Endless enthusiasm — bringing excitement and playful joy ✨" },
      { value: 3, text: "Deep empathy — understanding emotional nuances instantly 🫂" },
      { value: 4, text: "Unwavering loyalty — having their back no matter what happens 🤝" }
    ]
  },
  {
    id: 32,
    category: "🌟 Personality",
    categoryIcon: "🌟",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How patient are you with each other during minor daily delays or stress?",
    prompt_p2: "How patient are you with each other during minor daily delays or stress?",
    description: "Rate the reservoir of gentle grace you give one another.",
    scaleMinLabel: "1 Heart: Easily flustered",
    scaleMaxLabel: "5 Hearts: Saintly Zen patience 🌸",
    options: [
      { value: 1, text: "1 Heart - Short fuse when running late" },
      { value: 2, text: "2 Hearts - We sometimes snap then apologize" },
      { value: 3, text: "3 Hearts - Generally calm with occasional eye rolls" },
      { value: 4, text: "4 Hearts - Very gentle and understanding" },
      { value: 5, text: "5 Hearts - Infinite calm! We laugh through all delays together 💕" }
    ]
  },

  // ==========================================
  // CATEGORY 5: 🌹 Future Plans (8 Qs)
  // ==========================================
  {
    id: 33,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "If you could pick your dream home together anywhere in the world, what would it be?",
    prompt_p2: "If you could pick your dream home together anywhere in the world, what would it be?",
    description: "Explore the physical sanctuary where your love will bloom for decades.",
    options: [
      { value: 1, text: "A modern glass penthouse in a vibrant, dazzling city skyline 🏙️" },
      { value: 2, text: "A rustic wood cabin surrounded by pine trees, snow, and a fireplace 🪵" },
      { value: 3, text: "A breezy seaside villa with an infinity pool and palm trees 🌴" },
      { value: 4, text: "A warm suburban cottage with a huge lush garden and golden retriever 🏡" }
    ]
  },
  {
    id: 34,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Which dream vacation together sounds more heavenly?",
    prompt_p2: "Which dream vacation together sounds more heavenly?",
    description: "Choosing your ultimate romantic getaway across the globe.",
    options: [
      { value: 1, text: "🏖️ Overwater Bungalow in Maldives with turquoise waves & sunsets" },
      { value: 2, text: "🏰 European Castle Tour with snowy mountains & cozy bakeries" }
    ]
  },
  {
    id: 35,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What couple milestone are you most excited to experience next together?",
    prompt_p2: "What couple milestone are you most excited to experience next together?",
    description: "Anticipating the next magical milestone in your shared journey.",
    options: [
      { value: 1, text: "Taking our dream international holiday to a bucket-list country ✈️" },
      { value: 2, text: "Moving in together and decorating our dream living space 🛋️" },
      { value: 3, text: "Adopting a sweet fluffy puppy or kitten together 🐾" },
      { value: 4, text: "Tying the knot and celebrating with all our beloved friends & family 💍" }
    ]
  },
  {
    id: 36,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How aligned are your long-term dreams for career, home, and lifestyle?",
    prompt_p2: "How aligned are your long-term dreams for career, home, and lifestyle?",
    description: "Rate the harmony of your future compass directions.",
    scaleMinLabel: "1 Heart: Still exploring",
    scaleMaxLabel: "5 Hearts: Identical shared blueprint! 🏰",
    options: [
      { value: 1, text: "1 Heart - We take it one day at a time" },
      { value: 2, text: "2 Hearts - Broadly similar, figuring out details" },
      { value: 3, text: "3 Hearts - Aligned on values, flexible on timeline" },
      { value: 4, text: "4 Hearts - Very compatible vision for life and home" },
      { value: 5, text: "5 Hearts - 100% In Sync! Walking hand-in-hand into our dream future 💍" }
    ]
  },
  {
    id: 37,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "When you picture the two of you in 30 years, what is the scene?",
    prompt_p2: "When you picture the two of you in 30 years, what is the scene?",
    description: "Envisioning growing gracefully old together with deep love.",
    options: [
      { value: 1, text: "Sitting on a porch swing, drinking coffee, still giggling like teenagers ☕" },
      { value: 2, text: "Traveling the globe with passports full of stamps and memories 🗺️" },
      { value: 3, text: "Hosting big warm family dinners in a house filled with laughter 🍲" },
      { value: 4, text: "Running a cute cozy business or garden sanctuary together 🌺" }
    ]
  },
  {
    id: 38,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is the master financial saver who will build your future empire?",
    prompt_p2: "Who is the master financial saver who will build your future empire?",
    description: "Who watches the savings grow vs who finds cute things on sale?",
    options: [
      { value: 1, text: "{name1} is the master budget guru and smart investor 📈" },
      { value: 2, text: "{name2} meticulously tracks every coin for our dreams 💰" },
      { value: 3, text: "Both of us are brilliant financial partners building our castle 🏰" }
    ]
  },
  {
    id: 39,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "For our future anniversary celebrations, what's the dream style?",
    prompt_p2: "For our future anniversary celebrations, what's the dream style?",
    description: "Intimate private hideaway vs grand luxurious party.",
    options: [
      { value: 1, text: "🕯️ An intimate, secluded cabin hideaway just the two of us" },
      { value: 2, text: "🥂 A grand party or Michelin-star rooftop dining in style" }
    ]
  },
  {
    id: 40,
    category: "🌹 Future Plans",
    categoryIcon: "🌹",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How confident are you that your love will weather any storms in the decades ahead?",
    prompt_p2: "How confident are you that your love will weather any storms in the decades ahead?",
    description: "Rate the unshakable rock-solid trust in your forever journey.",
    scaleMinLabel: "1 Heart: Hopeful",
    scaleMaxLabel: "5 Hearts: Unbreakable & Eternal ❤️",
    options: [
      { value: 1, text: "1 Heart - We focus on building trust day by day" },
      { value: 2, text: "2 Hearts - Confident that we can work through bumps" },
      { value: 3, text: "3 Hearts - Very solid with strong mutual commitment" },
      { value: 4, text: "4 Hearts - A deeply anchored foundation" },
      { value: 5, text: "5 Hearts - Unbreakable! Nothing in this world could tear us apart 💍" }
    ]
  },

  // ==========================================
  // CATEGORY 6: 😂 Funny Couple Questions (8 Qs)
  // ==========================================
  {
    id: 41,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is more likely to accidentally burn the toast or set off the smoke detector?",
    prompt_p2: "Who is more likely to accidentally burn the toast or set off the smoke detector?",
    description: "Let's settle the kitchen chaos debate once and for all!",
    options: [
      { value: 1, text: "{name1} is an absolute danger in the kitchen! 🔥" },
      { value: 2, text: "{name2} gets easily distracted and burns dinner 🍳" },
      { value: 3, text: "Both of us are master chefs with zero kitchen drama 👨‍🍳" }
    ]
  },
  {
    id: 42,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is more dramatic when they get a minor cold or papercut?",
    prompt_p2: "Who is more dramatic when they get a minor cold or papercut?",
    description: "Who turns into a tragic Shakespearean actor over a slight sneeze?",
    options: [
      { value: 1, text: "{name1} acts like their final will must be drafted immediately 📜" },
      { value: 2, text: "{name2} demands 24/7 pampered royal treatment 👑" },
      { value: 3, text: "Both of us suffer with utmost poise and dignity 😇" }
    ]
  },
  {
    id: 43,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who takes longer to get ready before going out for dinner?",
    prompt_p2: "Who takes longer to get ready before going out for dinner?",
    description: "The 'I will be ready in 5 minutes' lie debunked!",
    options: [
      { value: 1, text: "{name1} tries on 7 outfits and styles hair forever 👗" },
      { value: 2, text: "{name2} takes a 45-minute shower and loses their keys 🚿" },
      { value: 3, text: "Both of us are miraculously ready at the exact same minute ⏱️" }
    ]
  },
  {
    id: 44,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "In a Zombie Apocalypse, which role are you taking?",
    prompt_p2: "In a Zombie Apocalypse, which role are you taking?",
    description: "Brave tactical survivalist vs the one who hides in the snack closet.",
    options: [
      { value: 1, text: "🗡️ The badass warrior hero fighting zombies on the front lines" },
      { value: 2, text: "🥫 The strategic bunker organizer protecting the snacks & blankets" }
    ]
  },
  {
    id: 45,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who steals all the blankets and leaves their partner shivering in the middle of the night?",
    prompt_p2: "Who steals all the blankets and leaves their partner shivering in the middle of the night?",
    description: "The midnight blanket burglary mystery!",
    options: [
      { value: 1, text: "{name1} rolls into a human burrito leaving zero duvet! 🌯" },
      { value: 2, text: "{name2} pulls the blanket with superhuman strength! 🥶" },
      { value: 3, text: "Both of us share blankets with saintly geometric perfection 😇" }
    ]
  },
  {
    id: 46,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What is the funniest argument you two have ever had?",
    prompt_p2: "What is the funniest argument you two have ever had?",
    description: "The silly trivial matters couples debate passionately about.",
    options: [
      { value: 1, text: "The impossible decision of 'What do you want to eat for dinner?' 🍕" },
      { value: 2, text: "Who was actually right about directions or GPS navigation 🗺️" },
      { value: 3, text: "Which movie, show, or fictional character was better 📺" },
      { value: 4, text: "Who said 'I love you more' or who started the fight first 😜" }
    ]
  },
  {
    id: 47,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is guilty of stealing food or fries from the other person's plate?",
    prompt_p2: "Who is guilty of stealing food or fries from the other person's plate?",
    description: "Said 'I am not hungry', then immediately ate half your meal!",
    options: [
      { value: 1, text: "{name1} claims they aren't hungry then devours my fries! 🍟" },
      { value: 2, text: "{name2} has an unstoppable fork that raids my dessert 🍰" },
      { value: 3, text: "Both of us peacefully divide every single bite 50/50 🤝" }
    ]
  },
  {
    id: 48,
    category: "😂 Funny Couple Questions",
    categoryIcon: "😂",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "If one of you sings horribly off-key in the car, what's the reaction?",
    prompt_p2: "If one of you sings horribly off-key in the car, what's the reaction?",
    description: "Supportive scream-singing vs playful teasing.",
    options: [
      { value: 1, text: "🎤 Scream-sing along even louder and completely off-key together!" },
      { value: 2, text: "🤣 Film a secret funny video and laugh hysterically at the high notes" }
    ]
  },

  // ==========================================
  // CATEGORY 7: ✨ Romantic Questions (8 Qs)
  // ==========================================
  {
    id: 49,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Which romantic escape would you choose this Friday night?",
    prompt_p2: "Which romantic escape would you choose this Friday night?",
    description: "Pick your favorite romantic vibe for an unforgettable evening.",
    options: [
      { value: 1, text: "🥂 Fancy Cocktail Lounge & Dressing Up to Kill" },
      { value: 2, text: "🍿 Pajamas, Blankets & Binge-Watching Cozy Movies" }
    ]
  },
  {
    id: 50,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What is your favorite way to express deep affection during ordinary daily life?",
    prompt_p2: "What is your favorite way to express deep affection during ordinary daily life?",
    description: "The subtle micro-habits of devotion that keep love incandescent.",
    options: [
      { value: 1, text: "Leaving cute sticky notes or sweet surprise text messages 💌" },
      { value: 2, text: "Reaching out to hold hands while walking or driving together 🤝" },
      { value: 3, text: "Making their coffee or completing chores without being asked ☕" },
      { value: 4, text: "Random long embraces and kissing them softly out of nowhere 💋" }
    ]
  },
  {
    id: 51,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How important are spontaneous forehead kisses, random hugs, and surprise touches?",
    prompt_p2: "How important are spontaneous forehead kisses, random hugs, and surprise touches?",
    description: "Rate the power of unexpected daily physical gestures in keeping love alive.",
    scaleMinLabel: "1 Heart: Occasional",
    scaleMaxLabel: "5 Hearts: Absolute Oxygen! ❤️",
    options: [
      { value: 1, text: "1 Heart - Nice once in a while" },
      { value: 2, text: "2 Hearts - Appreciated on weekends" },
      { value: 3, text: "3 Hearts - Love them a few times a week" },
      { value: 4, text: "4 Hearts - Brightens my whole day every time" },
      { value: 5, text: "5 Hearts - Essential! Spontaneous romance makes life beautiful 🌹" }
    ]
  },
  {
    id: 52,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Which romantic gesture means more to your heart?",
    prompt_p2: "Which romantic gesture means more to your heart?",
    description: "Handmade emotional vulnerability vs sparkling physical tokens.",
    options: [
      { value: 1, text: "📜 A handwritten, heartfelt love letter straight from the soul" },
      { value: 2, text: "🎁 A thoughtful, luxurious surprise gift you've secretly longed for" }
    ]
  },
  {
    id: 53,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "partner_perspective",
    typeLabel: "🥰 Empathy Perspective",
    prompt_p1: "What is your favorite bedtime habit with your partner?",
    prompt_p2: "What do you think is {name1}'s favorite bedtime habit with you?",
    description: "The sweetest micro-moments right before drifting off to sleep.",
    options: [
      { value: 1, text: "Late-night pillow talk whispering about life and secrets 🌙" },
      { value: 2, text: "Tightly cuddling like spoons until falling asleep 🛌" },
      { value: 3, text: "Holding hands across the bed in gentle silence 🤝" },
      { value: 4, text: "Watching a funny show together until our eyes drift shut 📺" }
    ]
  },
  {
    id: 54,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is the bigger flirt and sends more cheeky or cute texts during the workday?",
    prompt_p2: "Who is the bigger flirt and sends more cheeky or cute texts during the workday?",
    description: "Who keeps the cheeky daytime sparks and chemistry flying?",
    options: [
      { value: 1, text: "{name1} is always teasing and texting sweet chaos 💌" },
      { value: 2, text: "{name2} sends the cutest cheeky messages and selfies 💋" },
      { value: 3, text: "Both of us are equally flirty and obsessed with each other! 🔥" }
    ]
  },
  {
    id: 55,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "If you could freeze one moment in time to live in forever with your partner, what is it?",
    prompt_p2: "If you could freeze one moment in time to live in forever with your partner, what is it?",
    description: "The timeless, unforgettable snapshot of your eternal love.",
    options: [
      { value: 1, text: "Under starry skies, wrapped in one warm blanket, whispering dreams ✨" },
      { value: 2, text: "Right after a passionate kiss when both of our smiles meet in the dark 💋" },
      { value: 3, text: "Laughing so hard until our bellies hurt over an inside joke 🤣" },
      { value: 4, text: "Quietly resting our heads together, feeling each other's steady heartbeat 💓" }
    ]
  },
  {
    id: 56,
    category: "✨ Romantic Questions",
    categoryIcon: "✨",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How often do you still get butterflies when your partner walks into the room looking amazing?",
    prompt_p2: "How often do you still get butterflies when {name1} walks into the room looking amazing?",
    description: "Rate the ongoing electric chemistry you feel.",
    scaleMinLabel: "1 Heart: Comfortable routine",
    scaleMaxLabel: "5 Hearts: Jaw-dropping butterflies every time! 🔥",
    options: [
      { value: 1, text: "1 Heart - We are deeply comfortable and familiar" },
      { value: 2, text: "2 Hearts - On date nights when all dressed up" },
      { value: 3, text: "3 Hearts - Pretty often throughout the week" },
      { value: 4, text: "4 Hearts - My heart skips a beat on regular days" },
      { value: 5, text: "5 Hearts - Constant fireworks! I fall in love all over again daily 🌹" }
    ]
  },

  // ==========================================
  // CATEGORY 8: 🔮 Compatibility (8 Qs)
  // ==========================================
  {
    id: 57,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How easily do you bounce back and reconnect after an argument or bad day?",
    prompt_p2: "How easily do you bounce back and reconnect after an argument or bad day?",
    description: "Rate the emotional resilience and elasticity of your bond.",
    scaleMinLabel: "1 Heart: Takes long cool-down",
    scaleMaxLabel: "5 Hearts: Hugs & repair within minutes! 🕊️",
    options: [
      { value: 1, text: "1 Heart - We need a day of cool-down space" },
      { value: 2, text: "2 Hearts - Usually a few hours to process" },
      { value: 3, text: "3 Hearts - We talk it out before going to sleep" },
      { value: 4, text: "4 Hearts - Quick apologies and warm hugs" },
      { value: 5, text: "5 Hearts - Instant repair! Love always wins over stubbornness 💕" }
    ]
  },
  {
    id: 58,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What is the secret ingredient that makes your relationship work so smoothly?",
    prompt_p2: "What is the secret ingredient that makes your relationship work so smoothly?",
    description: "The special alchemy that binds your two hearts.",
    options: [
      { value: 1, text: "Unbreakable mutual trust and complete transparency 💎" },
      { value: 2, text: "Constant laughter and never taking life too seriously 😂" },
      { value: 3, text: "Deep intellectual respect and listening to each other's views 🧠" },
      { value: 4, text: "Strong romantic and physical attraction that never fades 🔥" }
    ]
  },
  {
    id: 59,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "In your relationship dynamics, do you feel more like:",
    prompt_p2: "In your relationship dynamics, do you feel more like:",
    description: "Harmonious identical twins vs thrilling magnetic opposites.",
    options: [
      { value: 1, text: "👯 Two peas in a pod — identical brains, tastes, and rhythms" },
      { value: 2, text: "☯️ Yin and Yang — complementary opposites that balance each other" }
    ]
  },
  {
    id: 60,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How well do your core moral, ethical, and family values match?",
    prompt_p2: "How well do your core moral, ethical, and family values match?",
    description: "Rate the structural alignment of your philosophical compass.",
    scaleMinLabel: "1 Heart: Different perspectives",
    scaleMaxLabel: "5 Hearts: Perfect harmony & shared beliefs 🧭",
    options: [
      { value: 1, text: "1 Heart - We navigate significant differences" },
      { value: 2, text: "2 Hearts - Similar on some, different on others" },
      { value: 3, text: "3 Hearts - Aligned on major principles" },
      { value: 4, text: "4 Hearts - Very harmonious worldviews" },
      { value: 5, text: "5 Hearts - 100% In Tune! Our moral compasses point to the same star 🌟" }
    ]
  },
  {
    id: 61,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who is the voice of reason when making high-stress emergency choices?",
    prompt_p2: "Who is the voice of reason when making high-stress emergency choices?",
    description: "Who steps up as the calm captain in stormy seas?",
    options: [
      { value: 1, text: "{name1} stays calm, focused, and problem-solves instantly 🧭" },
      { value: 2, text: "{name2} takes charge and protects everyone with poise 🛡️" },
      { value: 3, text: "Both of us form an invincible tag-team under pressure 🤝" }
    ]
  },
  {
    id: 62,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "partner_perspective",
    typeLabel: "🥰 Empathy Perspective",
    prompt_p1: "What area of personal growth has your partner helped you improve most?",
    prompt_p2: "What area of personal growth has {name1} improved most with you?",
    description: "How your love sharpens and elevates each other into your best self.",
    options: [
      { value: 1, text: "Being more patient, compassionate, and understanding with people 🕊️" },
      { value: 2, text: "Believing in my dreams and having bigger self-confidence 🌟" },
      { value: 3, text: "Learning to slow down, relax, and savor the present moment 🌿" },
      { value: 4, text: "Communicating feelings openly instead of keeping things inside 🗣️" }
    ]
  },
  {
    id: 63,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "When experiencing life achievements, what brings you the greatest satisfaction?",
    prompt_p2: "When experiencing life achievements, what brings you the greatest satisfaction?",
    description: "Sharing the spotlight together vs watching your partner shine.",
    options: [
      { value: 1, text: "🥂 Accomplishing a shared milestone together as an unstoppable duo" },
      { value: 2, text: "👏 Cheering proudly in the audience while your partner shines" }
    ]
  },
  {
    id: 64,
    category: "🔮 Compatibility",
    categoryIcon: "🔮",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "How do you handle each other's bad moods or low-energy days?",
    prompt_p2: "How do you handle each other's bad moods or low-energy days?",
    description: "Holding space for each other without taking things personally.",
    options: [
      { value: 1, text: "Offer endless hugs, snacks, and sweet cuddles with zero demands 🍫" },
      { value: 2, text: "Give them respectful breathing space and check in gently 🌿" },
      { value: 3, text: "Crack silly jokes and do anything to coax a warm smile out 😂" },
      { value: 4, text: "Take over their chores and make their evening totally effortless 🧹" }
    ]
  },

  // ==========================================
  // CATEGORY 9: ⚡ Preferences (8 Qs)
  // ==========================================
  {
    id: 65,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "What is your ultimate Sunday morning vibe?",
    prompt_p2: "What is your ultimate Sunday morning vibe?",
    description: "Early morning brunch adventure vs lazy bed cuddles.",
    options: [
      { value: 1, text: "🥐 Waking up early for fancy café breakfast, pastries & a sunny walk" },
      { value: 2, text: "☕ Staying in bed until noon, tangled in blankets with zero alarms" }
    ]
  },
  {
    id: 66,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "What is your ideal temperature and bedroom climate at night?",
    prompt_p2: "What is your ideal temperature and bedroom climate at night?",
    description: "The classic couple thermostat battle!",
    options: [
      { value: 1, text: "❄️ Ice cold arctic room with thick heavy blankets" },
      { value: 2, text: "🔥 Cozy warm room with light breeze and soft sheets" }
    ]
  },
  {
    id: 67,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "If you could pick one couple hobby to master together, what would it be?",
    prompt_p2: "If you could pick one couple hobby to master together, what would it be?",
    description: "Discovering new creative passions to share as partners.",
    options: [
      { value: 1, text: "Learning salsa or ballroom dancing in private lessons 💃🕺" },
      { value: 2, text: "Mastering gourmet cooking, wine tasting, and pasta making 🍝🍷" },
      { value: 3, text: "Outdoor adventures: rock climbing, hiking, and scuba diving 🧗‍♀️🌊" },
      { value: 4, text: "Art & music: pottery, acoustic guitar, and painting canvases 🎨🎸" }
    ]
  },
  {
    id: 68,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "love_scale",
    typeLabel: "⭐ Love Scale (1–5 Hearts)",
    prompt_p1: "How important is keeping a dedicated weekly 'Date Night' without phones or work?",
    prompt_p2: "How important is keeping a dedicated weekly 'Date Night' without phones or work?",
    description: "Rate how sacred protected couple quality time is to your relationship.",
    scaleMinLabel: "1 Heart: Flexible as it happens",
    scaleMaxLabel: "5 Hearts: Non-negotiable sacred ritual! 💖",
    options: [
      { value: 1, text: "1 Heart - We hang out casually anytime, no formal plan needed" },
      { value: 2, text: "2 Hearts - Once or twice a month is good enough" },
      { value: 3, text: "3 Hearts - Nice to have when schedule permits" },
      { value: 4, text: "4 Hearts - Very important to preserve romantic spark" },
      { value: 5, text: "5 Hearts - Sacred relationship priority! Always on the calendar 🌹" }
    ]
  },
  {
    id: 69,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "Which pet would you rather adopt together as your relationship mascot?",
    prompt_p2: "Which pet would you rather adopt together as your relationship mascot?",
    description: "Bouncing energetic puppy vs calm cuddly purring kitten.",
    options: [
      { value: 1, text: "🐶 A golden happy puppy who wags their tail at everything" },
      { value: 2, text: "🐱 A calm, fluffy purring kitten who sleeps on our laps" }
    ]
  },
  {
    id: 70,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "who_is_more_likely",
    typeLabel: "🎭 Who's More Likely?",
    prompt_p1: "Who gets to control the car music playlist and AUX cord on road trips?",
    prompt_p2: "Who gets to control the car music playlist and AUX cord on road trips?",
    description: "Who is the undisputed couple road trip DJ?",
    options: [
      { value: 1, text: "{name1} is the supreme DJ with curated vibey bangers 🎵" },
      { value: 2, text: "{name2} has unhinged guilty pleasure throwback hits 🎶" },
      { value: 3, text: "Both of us trade songs seamlessly like radio pros 📻" }
    ]
  },
  {
    id: 71,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "scenario_choice",
    typeLabel: "🌹 Romantic Scenario",
    prompt_p1: "What is your favorite kind of surprise to receive from your partner?",
    prompt_p2: "What is {name1}'s favorite kind of surprise to receive from you?",
    description: "Unwrapping the subtle keys to delighting each other's soul.",
    options: [
      { value: 1, text: "A surprise planned date where I don't have to think or choose anything 🗺️" },
      { value: 2, text: "My favorite comfort food or sweet dessert brought home unexpectedly 🧋" },
      { value: 3, text: "A random heartfelt love letter hidden where I'll find it 💌" },
      { value: 4, text: "A sweet surprise gift I mentioned casually weeks ago 🎁" }
    ]
  },
  {
    id: 72,
    category: "⚡ Preferences",
    categoryIcon: "⚡",
    type: "this_or_that",
    typeLabel: "⚡ This or That",
    prompt_p1: "When watching TV series together, what's the sacred rule?",
    prompt_p2: "When watching TV series together, what's the sacred rule?",
    description: "The ultimate couple test of streaming loyalty!",
    options: [
      { value: 1, text: "🤝 Absolute Loyalty: NEVER watching ahead without the other person" },
      { value: 2, text: "🤫 Sneaky Binging: Watching ahead secretly and pretending you didn't" }
    ]
  }
];

// Verify integrity:
console.log(`Total questions: ${questions.length}`);
const categories = [...new Set(questions.map(q => q.category))];
console.log("Categories found:", categories);

const targetPath = path.resolve(__dirname, "../frontend/data/questions.json");
fs.writeFileSync(targetPath, JSON.stringify(questions, null, 2), "utf-8");
console.log("Successfully wrote questions.json to:", targetPath);

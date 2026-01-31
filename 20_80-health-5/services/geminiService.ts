
import { GoogleGenAI, Type } from "@google/genai";
import { MoodEntry, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Global tracker for rate limiting
let last429Timestamp = 0;
const COOLDOWN_DURATION = 60000; // 1 minute cooldown

function isCoolingDown() {
  return Date.now() - last429Timestamp < COOLDOWN_DURATION;
}

function getCooldownRemaining() {
  return Math.max(0, Math.ceil((COOLDOWN_DURATION - (Date.now() - last429Timestamp)) / 1000));
}

// Helper for exponential backoff with global cooldown awareness
async function callGeminiWithRetry(fn: () => Promise<any>, retries = 2, delay = 3000): Promise<any> {
  if (isCoolingDown()) {
    throw new Error(`Quota exhausted. Cooling down (${getCooldownRemaining()}s remaining).`);
  }

  try {
    return await fn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error);
    const is429 = errorStr.includes('429') || error?.message?.includes('429') || error?.status === 429;
    
    if (is429) {
      last429Timestamp = Date.now();
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiWithRetry(fn, retries - 1, delay * 2);
      }
    }
    throw error;
  }
}

/** 
 * Stable Cache Keys
 */
const getCacheKey = (prefix: string, avg: number, count: number) => {
  const stableAvg = Math.round(avg);
  const stableCount = Math.floor(count / 2); // Only refresh every 2 entries
  return `gemini_cache_${prefix}_${stableAvg}_${stableCount}`;
};

export async function generateAIRecommendations(avg: number, recentEntries: MoodEntry[]): Promise<string> {
  const cacheKey = getCacheKey('recs', avg, recentEntries.length);
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  const model = 'gemini-3-flash-preview';
  const context = recentEntries.map(e => `${e.date}: Mood ${e.mood}/10. Note: ${e.note || 'None'}`).join('\n');

  const prompt = `Analyze this person's mood data from the past week:
${context}
7-day average mood score: ${avg}/10

Provide 4 personalized, actionable recommendations to support their wellbeing.
Format your response in clean Markdown with an appropriate emoji heading.
Guidelines:
- If average is 7-10: Focus on maintaining positive habits.
- If average is 4-6: Suggest practical coping strategies.
- If average is 1-3: Emphasize urgent professional support resources.`;

  try {
    const result = await callGeminiWithRetry(() => ai.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.7 }
    }));
    const text = result.text || "Keep reflecting on your journey.";
    localStorage.setItem(cacheKey, text);
    return text;
  } catch (error: any) {
    console.error("Gemini Recommendations Error:", error);
    throw error; 
  }
}

export async function getChatbotResponse(userMessage: string, history: ChatMessage[], recentEntries: MoodEntry[]): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const context = recentEntries.length > 0 
    ? `User's recent mood history: ${recentEntries.slice(0, 5).map(e => `${e.date}: ${e.mood}/10`).join(', ')}` 
    : "User is new to tracking.";

  const systemInstruction = `You are a compassionate mental wellness assistant.
Your role:
- Listen empathetically and validate feelings.
- Provide supportive, non-judgmental responses.
- Offer practical coping strategies (breathing, grounding, journaling).
- Suggest professional help if mood is low.
- Context: ${context}
Keep responses warm and concise (2-4 sentences).`;

  try {
    const chat = ai.chats.create({
      model,
      config: { systemInstruction }
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text || "I'm here for you. Can you tell me more about that?";
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    if (JSON.stringify(error).includes('429')) {
      return "I'm receiving a lot of messages right now. Can we talk again in a minute?";
    }
    return "I'm having a little trouble connecting right now, but I'm still listening. How else can I help?";
  }
}

export async function generateImprovementPlan(avg: number, entries: MoodEntry[]): Promise<string> {
  const cacheKey = getCacheKey('plan', avg, entries.length);
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  const model = 'gemini-3-flash-preview';
  const context = entries.slice(-14).map(e => `${e.date}: ${e.mood}/10`).join(', ');

  const prompt = `Based on this 30-day mood data (average: ${avg}/10), recent entries: ${context}, create a personalized 2-week improvement plan.
Provide:
1. One main goal.
2. Three specific weekly action items.
3. One mindset shift.
Format with Markdown headers.`;

  try {
    const result = await callGeminiWithRetry(() => ai.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.6 }
    }));
    const text = result.text || "Continue your wellness journey with small daily steps.";
    localStorage.setItem(cacheKey, text);
    return text;
  } catch (error) {
    console.error("Gemini Plan Error:", error);
    throw error;
  }
}

export async function analyzeMoodFromImage(base64Image: string): Promise<any> {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `You are an expert facial expression analyst for a mental health mood tracking application. Analyze this photograph with extreme precision.

FACIAL ANALYSIS PROTOCOL:

Step 1 - Examine Individual Features:
- EYES: Wide/bright (alert, positive), relaxed (calm), narrowed (skeptical), tired/droopy (low energy), watery (sad)
- EYEBROWS: Raised (surprised/worried), furrowed deeply (stressed/angry), slightly furrowed (concerned), relaxed (calm), raised inner corners (sad)
- MOUTH: Full smile with teeth (very happy), closed smile (content), neutral/straight (calm/serious), slight downturn (sad), tight-lipped (tense/stressed)
- FOREHEAD: Deeply wrinkled (very stressed), slightly wrinkled (concerned), smooth (relaxed)
- CHEEKS: Raised (genuine smile - Duchenne), neutral, hollow/sunken (tired/sad)
- JAW: Clenched/tight (stressed), relaxed (calm)
- OVERALL FACE: Tense muscles vs relaxed, bright vs dull

Step 2 - Determine Primary Emotion:
Based on feature combination, identify ONE primary emotion: happy, content, neutral, serious, tired, stressed, anxious, sad, or frustrated.

Step 3 - Assign Mood Score (1-10) Using This EXACT Mapping:
VERY POSITIVE (8-10):
- 10: Huge genuine smile, crinkled eyes (Duchenne), raised cheeks, bright expression, very relaxed
- 9: Clear genuine smile, positive eye contact, relaxed and bright
- 8: Moderate smile, warm expression, clearly positive but not ecstatic

POSITIVE (6-7):
- 7: Slight smile OR very relaxed neutral face with no tension, calm eyes
- 6: Neutral face with relaxed features, no smile but no negative signs

NEUTRAL/SLIGHTLY LOW (5):
- 5: Completely neutral expression, slight seriousness, or minimal/unclear expression

STRUGGLING (3-4):
- 4: Neutral but WITH tension (tight jaw, slight frown, worried eyes)
- 3: Clear stress indicators (furrowed brow, tense face, tired eyes, slight frown)

VERY LOW (1-2):
- 2: Obvious sadness (downturned mouth, sad eyes, slumped posture)
- 1: Severe distress (crying, extreme tension, very sad)

Step 4 - Critical Rules:
- A person taking a mood selfie who looks NEUTRAL/SERIOUS = score 5-6 (NOT 7-8)
- No smile + relaxed face = 5-6
- No smile + tense face = 3-4
- Only score 7+ if positive indicators are CLEARLY present
- Default to 5 if uncertain
- Be conservative - better to underestimate than overestimate

Step 5 - Confidence Assessment:
- High (80-100%): Face clearly visible, good lighting, obvious expression
- Medium (50-79%): Face visible but subtle expression or unclear features
- Low (0-49%): Poor lighting, unclear face, ambiguous expression, or no face visible

Provide ONLY this JSON structure.`;

  try {
    const result = await callGeminiWithRetry(() => ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.NUMBER, description: "Mood score from 1 to 10 based on mapping" },
            emotion: { type: Type.STRING, description: "Primary emotion from the allowed list" },
            confidence: { type: Type.NUMBER, description: "Confidence score percentage" },
            description: { type: Type.STRING, description: "2 sentences: feature description and score explanation" },
            facialFeatures: {
              type: Type.OBJECT,
              properties: {
                eyes: { type: Type.STRING },
                mouth: { type: Type.STRING },
                eyebrows: { type: Type.STRING },
                overallTension: { type: Type.STRING }
              },
              required: ["eyes", "mouth", "eyebrows", "overallTension"]
            },
            suggestions: { type: Type.STRING, description: "One actionable suggestion" }
          },
          required: ["mood", "emotion", "confidence", "description", "facialFeatures", "suggestions"]
        }
      }
    }));

    let rawText = result.text || "{}";
    rawText = rawText.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
    
    const json = JSON.parse(rawText);
    return {
      mood: Number(json.mood) || 5,
      emotion: json.emotion || "Unknown",
      confidence: Number(json.confidence) || 0,
      description: json.description || "",
      facialFeatures: json.facialFeatures || {},
      suggestions: json.suggestions || ""
    };
  } catch (error: any) {
    console.error("Mood Analysis Error:", error);
    throw error;
  }
}

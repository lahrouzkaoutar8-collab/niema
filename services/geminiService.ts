
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { Question, AssessmentResult, Language } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.models;

export const getInitialAssessmentQuestions = async (lang: Language): Promise<Question[]> => {
  let prompt = "";
  switch (lang) {
    case Language.AR:
      prompt = "أنشئ 12 سؤالًا متعدد الخيارات للفحص الأولي للصحة النفسية. يجب أن تكون الأسئلة لطيفة ومصممة للكشف عن الحالات الشائعة، وتغطي مجموعة أوسع من الموضوعات بما في ذلك المزاج (الاكتئاب)، وفقدان الاهتمام، والقلق، والهم، والأداء اليومي، والشعور بالوحدة، وتقدير الذات، وأنماط النوم. قدم 4 خيارات بسيطة قائمة على التكرار لكل سؤال، مثل 'إطلاقًا'، 'عدة أيام'، 'أكثر من نصف الأيام'، 'كل يوم تقريبًا'.";
      break;
    case Language.FR:
      prompt = "Générez 12 questions à choix multiples pour un dépistage préliminaire de la santé mentale. Les questions doivent être douces et conçues pour dépister des conditions courantes, en couvrant un plus large éventail de sujets, y compris l'humeur (dépression), l'anhédonie, l'anxiété, l'inquiétude, le fonctionnement quotidien, la solitude, l'estime de soi et les habitudes de sommeil. Fournissez 4 options simples basées sur la fréquence pour chaque question, comme 'Pas du tout', 'Plusieurs jours', 'Plus de la moitié des jours', 'Presque tous les jours'.";
      break;
    case Language.EN:
    default:
      prompt = "Generate 12 multiple-choice questions for a preliminary mental health screening. The questions should be gentle and designed to screen for common conditions, covering a wider range of topics including mood (depression), anhedonia, anxiety, worry, daily functioning, loneliness, self-esteem, and sleep patterns. Provide 4 simple, frequency-based options for each question, such as 'Not at all', 'Several days', 'More than half the days', 'Nearly every day'.";
      break;
  }
  
  try {
    const response = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['question', 'options'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data.questions as Question[];
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    throw new Error("Failed to generate assessment questions.");
  }
};

export const analyzeAssessmentAnswers = async (answers: { [key: number]: string }, lang: Language): Promise<AssessmentResult> => {
  let prompt = "";
  const answersJson = JSON.stringify(answers);
  const commonInstructions = `Based on these answers, provide a brief, supportive, non-clinical summary of their potential emotional state. Then, identify the primary concern (e.g., 'Depression', 'Anxiety', 'Trauma', 'General Stress'). Finally, recommend one or more of the following chat room IDs based on the primary concern: ['depression', 'anxiety', 'trauma', 'general']. The 'recommendedRoomIds' must be in English from that list.`;

  switch (lang) {
    case Language.AR:
      prompt = `أكمل مستخدم فحصًا أوليًا للصحة النفسية. إليك إجاباته: ${answersJson}. بناءً على هذه الإجابات، قدم ملخصًا موجزًا وداعمًا وغير سريري لحالته العاطفية المحتملة. بعد ذلك، حدد الشاغل الرئيسي (على سبيل المثال، 'الاكتئاب'، 'القلق'، 'الصدمة'، 'التوتر العام'). أخيرًا، أوصي بمعرف واحد أو أكثر من معرفات غرف الدردشة التالية بناءً على الشاغل الرئيسي: ['depression', 'anxiety', 'trauma', 'general']. يجب أن يكون الملخص والشاغل الرئيسي باللغة العربية. معرفات الغرف يجب أن تبقى كما هي بالإنجليزية.`;
      break;
    case Language.FR:
      prompt = `Un utilisateur a terminé un dépistage préliminaire de santé mentale. Voici ses réponses : ${answersJson}. Sur la base de ces réponses, fournissez un résumé bref, encourageant et non clinique de son état émotionnel potentiel. Ensuite, identifiez la préoccupation principale (par exemple, 'Dépression', 'Anxiété', 'Traumatisme', 'Stress général'). Enfin, recommandez un ou plusieurs des identifiants de salon de discussion suivants en fonction de la préoccupation principale : ['depression', 'anxiety', 'trauma', 'general']. Le résumé et la préoccupation principale doivent être en français. Les identifiants de salon doivent rester en anglais.`;
      break;
    case Language.EN:
    default:
      prompt = `A user has completed a preliminary mental health screening. Here are their answers: ${answersJson}. ${commonInstructions} The summary and primary concern should be in English.`;
      break;
  }
  
  try {
    const response = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            primaryConcern: { type: Type.STRING },
            recommendedRoomIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'primaryConcern', 'recommendedRoomIds'],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AssessmentResult;
  } catch (error) {
    console.error("Error analyzing assessment answers:", error);
    throw new Error("Failed to analyze assessment answers.");
  }
};

let chat: Chat | null = null;

export const startChat = (): Chat => {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are NafsiBot, a compassionate and supportive AI mental health companion. Your primary language for interaction is Moroccan Darija, but you are also fluent in Modern Standard Arabic, French, and English. Your main purpose is to provide a safe, non-judgmental space for users to express their feelings and experiences. You are NOT a licensed therapist. If a user asks for a medical diagnosis, a treatment plan, or discusses severe crisis situations (like self-harm), you must gently decline to provide medical advice and strongly encourage them to connect with a professional therapist through the app's 'Therapists' section or contact emergency services. Be warm, empathetic, and use supportive language.`,
      },
    });
  }
  return chat;
};

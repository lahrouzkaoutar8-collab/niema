import { Therapist, ChatRoom, Language, User } from './types';

export const THERAPISTS_DATA: Therapist[] = [
  { id: 1, name: "Dr. Fatima El Fassi", specialty: { [Language.EN]: "Cognitive Behavioral Therapy", [Language.AR]: "العلاج السلوكي المعرفي", [Language.FR]: "Thérapie Cognitivo-Comportementale" }, city: "Casablanca", avatar: "https://picsum.photos/seed/fatima/200" },
  { id: 2, name: "Dr. Youssef Amrani", specialty: { [Language.EN]: "Anxiety & Stress Management", [Language.AR]: "إدارة القلق والتوتر", [Language.FR]: "Gestion de l'Anxiété et du Stress" }, city: "Rabat", avatar: "https://picsum.photos/seed/youssef/200" },
  { id: 3, name: "Dr. Sofia Benjelloun", specialty: { [Language.EN]: "Trauma & PTSD", [Language.AR]: "الصدمات واضطراب ما بعد الصدمة", [Language.FR]: "Traumatisme et TSPT" }, city: "Marrakech", avatar: "https://picsum.photos/seed/sofia/200" },
  { id: 4, name: "Dr. Karim Alaoui", specialty: { [Language.EN]: "Depression Therapy", [Language.AR]: "علاج الاكتئاب", [Language.FR]: "Thérapie de la Dépression" }, city: "Fes", avatar: "https://picsum.photos/seed/karim/200" },
  { id: 5, name: "Dr. Leila Tazi", specialty: { [Language.EN]: "Family Counseling", [Language.AR]: "الاستشارات الأسرية", [Language.FR]: "Conseil Familial" }, city: "Tangier", avatar: "https://picsum.photos/seed/leila/200" },
  { id: 6, name: "Dr. Omar Cherkaoui", specialty: { [Language.EN]: "Adolescent Psychology", [Language.AR]: "علم نفس المراهقين", [Language.FR]: "Psychologie de l'Adolescent" }, city: "Casablanca", avatar: "https://picsum.photos/seed/omar/200" },
];

export const CHAT_ROOMS_DATA: ChatRoom[] = [
  { 
    id: "depression", 
    name: { [Language.EN]: "Navigating Depression", [Language.AR]: "التغلب على الاكتئاب", [Language.FR]: "Naviguer la Dépression" }, 
    description: { [Language.EN]: "A space for sharing and support for those feeling down.", [Language.AR]: "مساحة للمشاركة والدعم لمن يشعرون بالإحباط.", [Language.FR]: "Un espace de partage et de soutien pour ceux qui se sentent déprimés." }, 
    icon: "☁️" 
  },
  { 
    id: "anxiety", 
    name: { [Language.EN]: "Anxiety Alliance", [Language.AR]: "تحالف ضد القلق", [Language.FR]: "Alliance Anxiété" }, 
    description: { [Language.EN]: "Find calm and coping strategies with others who understand.", [Language.AR]: "ابحث عن الهدوء واستراتيجيات التأقلم مع الآخرين الذين يفهمونك.", [Language.FR]: "Trouvez le calme et des stratégies d'adaptation avec d'autres qui comprennent." }, 
    icon: "🌬️" 
  },
  { 
    id: "trauma", 
    name: { [Language.EN]: "Healing from Trauma", [Language.AR]: "الشفاء من الصدمة", [Language.FR]: "Guérir du Traumatisme" }, 
    description: { [Language.EN]: "A safe place to process and heal from traumatic experiences.", [Language.AR]: "مكان آمن لمعالجة والشفاء من التجارب المؤلمة.", [Language.FR]: "Un lieu sûr pour traiter et guérir des expériences traumatisantes." }, 
    icon: "❤️‍🩹" 
  },
  { 
    id: "general", 
    name: { [Language.EN]: "General Wellness", [Language.AR]: "العافية العامة", [Language.FR]: "Bien-être Général" }, 
    description: { [Language.EN]: "For daily check-ins and general mental health discussions.", [Language.AR]: "للمتابعة اليومية ومناقشات الصحة النفسية العامة.", [Language.FR]: "Pour les bilans quotidiens et les discussions générales sur la santé mentale." }, 
    icon: "☀️" 
  },
];

export const USERS_DATA: User[] = [
    {
        id: 'user-1',
        name: 'Amine',
        avatar: 'https://picsum.photos/seed/amine/200',
        assessmentResult: null,
        posts: [
            {
                id: 101,
                authorId: 'user-1',
                text: 'Feeling a bit overwhelmed with work this week, but trying to take it one day at a time. A walk in the park helped clear my head.',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                likes: ['user-3'],
            }
        ],
        friends: ['user-2'],
    },
    {
        id: 'user-2',
        name: 'Khadija',
        avatar: 'https://picsum.photos/seed/khadija/200',
        assessmentResult: null,
        posts: [
            {
                id: 201,
                authorId: 'user-2',
                text: 'Today I tried a new recipe for tagine and it turned out great! Small victories like this make me happy. 😊',
                imageUrl: 'https://picsum.photos/seed/tagine/400/300',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
                likes: ['user-1'],
            },
            {
                id: 202,
                authorId: 'user-2',
                text: 'The sunset in Rabat was absolutely breathtaking today.',
                timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), // 28 hours ago
                likes: [],
            }
        ],
        friends: ['user-1'],
    },
    {
        id: 'user-3',
        name: 'Mehdi',
        avatar: 'https://picsum.photos/seed/mehdi/200',
        assessmentResult: null,
        posts: [
            {
                id: 301,
                authorId: 'user-3',
                text: 'Has anyone read any good books lately? Looking for recommendations to help me disconnect from screens.',
                timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
                likes: [],
            }
        ],
        friends: [],
    }
];
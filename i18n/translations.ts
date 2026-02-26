export type Language = 'uz' | 'ru';

export const translations = {
  uz: {
    // Header
    greeting: 'Salom! 👋',
    myTasks: 'Mening vazifalarim',
    todayResult: 'Bugungi natija',
    completed: 'bajarildi',
    searchPlaceholder: 'Vazifalarni qidirish...',

    // Categories
    all: 'Hammasi',
    personal: 'Shaxsiy',
    work: 'Ish',
    shopping: 'Xarid',
    health: 'Salomatlik',
    study: "O'qish",
    other: 'Boshqa',

    // Priority
    low: 'Past',
    medium: "O'rta",
    high: 'Yuqori',

    // Add modal
    newTask: 'Yangi vazifa',
    writeTask: 'Vazifani yozing...',
    category: 'Kategoriya',
    priority: 'Muhimlik',
    cancel: 'Bekor',
    add: "Qo'shish",

    // Empty state
    noTasks: "Vazifalar yo'q",
    noTasksHint: "Yangi vazifa qo'shish uchun\npastdagi \"+\" tugmasini bosing",

    // Time
    now: 'Hozir',
    minutesShort: 'daq',
    hoursShort: 'soat',
    daysShort: 'kun',

    // Stats
    statistics: 'Statistika',
    statsSubtitle: "Vazifalar haqida umumiy ma'lumot",
    total: 'Jami',
    done: 'Bajarildi',
    pending: 'Kutilmoqda',
    completionRate: 'Bajarish darajasi',
    byCategory: "Kategoriya bo'yicha",
    byPriority: "Muhimlik bo'yicha",
    clearCompleted: 'Bajarilganlarni tozalash',
    rateExcellent: 'Ajoyib! Barcha vazifalar bajarildi! 🎉',
    rateGood: 'Yaxshi natija! Davom eting! 💪',
    rateOkay: 'Yaxshi boshlangansiz! 👍',
    rateNoTasks: "Hali vazifalar qo'shilmagan",
    rateKeepGoing: "Ko'proq harakat qiling! 🚀",

    // Settings
    settings: 'Sozlamalar',
    settingsSubtitle: 'Ilova sozlamalari',
    appearance: 'Ko\'rinish',
    lightTheme: 'Yorug\'',
    darkTheme: 'Qorong\'u',
    systemTheme: 'Tizim',
    language: 'Til',
    uzbek: "O'zbekcha",
    russian: 'Ruscha',

    // Profile
    profile: 'Profil',
    profileSubtitle: 'Shaxsiy ma\'lumotlaringiz',
    firstName: 'Ism',
    lastName: 'Familiya',
    email: 'Email',
    firstNamePlaceholder: 'Ismingizni kiriting',
    lastNamePlaceholder: 'Familiyangizni kiriting',
    emailPlaceholder: 'Email manzilingiz',
    save: 'Saqlash',
    saved: 'Saqlandi!',
    changePhoto: 'Rasmni o\'zgartirish',
    personalInfo: 'Shaxsiy ma\'lumotlar',

    // Auth
    login: 'Kirish',
    register: "Ro'yxatdan o'tish",
    emailLabel: 'Email',
    passwordLabel: 'Parol',
    loginButton: 'Kirish',
    registerButton: "Ro'yxatdan o'tish",
    noAccount: "Hisobingiz yo'qmi?",
    haveAccount: 'Hisobingiz bormi?',
    authError: 'Xatolik yuz berdi',
    signOut: 'Chiqish',
    loginTitle: 'Xush kelibsiz!',
    loginSubtitle: 'Hisobingizga kiring',
    registerTitle: 'Yangi hisob',
    registerSubtitle: "Ro'yxatdan o'ting",

    // Loading
    loading: 'Yuklanmoqda...',
  },
  ru: {
    // Header
    greeting: 'Привет! 👋',
    myTasks: 'Мои задачи',
    todayResult: 'Результат за сегодня',
    completed: 'выполнено',
    searchPlaceholder: 'Поиск задач...',

    // Categories
    all: 'Все',
    personal: 'Личное',
    work: 'Работа',
    shopping: 'Покупки',
    health: 'Здоровье',
    study: 'Учёба',
    other: 'Другое',

    // Priority
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',

    // Add modal
    newTask: 'Новая задача',
    writeTask: 'Напишите задачу...',
    category: 'Категория',
    priority: 'Приоритет',
    cancel: 'Отмена',
    add: 'Добавить',

    // Empty state
    noTasks: 'Задач нет',
    noTasksHint: 'Нажмите кнопку "+" внизу,\nчтобы добавить новую задачу',

    // Time
    now: 'Сейчас',
    minutesShort: 'мин',
    hoursShort: 'ч',
    daysShort: 'дн',

    // Stats
    statistics: 'Статистика',
    statsSubtitle: 'Общая информация о задачах',
    total: 'Всего',
    done: 'Выполнено',
    pending: 'Ожидает',
    completionRate: 'Степень выполнения',
    byCategory: 'По категориям',
    byPriority: 'По приоритету',
    clearCompleted: 'Очистить выполненные',
    rateExcellent: 'Отлично! Все задачи выполнены! 🎉',
    rateGood: 'Хороший результат! Продолжайте! 💪',
    rateOkay: 'Хорошее начало! 👍',
    rateNoTasks: 'Задачи ещё не добавлены',
    rateKeepGoing: 'Старайтесь больше! 🚀',

    // Settings
    settings: 'Настройки',
    settingsSubtitle: 'Настройки приложения',
    appearance: 'Оформление',
    lightTheme: 'Светлая',
    darkTheme: 'Тёмная',
    systemTheme: 'Система',
    language: 'Язык',
    uzbek: 'Узбекский',
    russian: 'Русский',

    // Profile
    profile: 'Профиль',
    profileSubtitle: 'Ваши личные данные',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Email',
    firstNamePlaceholder: 'Введите имя',
    lastNamePlaceholder: 'Введите фамилию',
    emailPlaceholder: 'Ваш email адрес',
    save: 'Сохранить',
    saved: 'Сохранено!',
    changePhoto: 'Изменить фото',
    personalInfo: 'Личные данные',

    // Auth
    login: 'Вход',
    register: 'Регистрация',
    emailLabel: 'Email',
    passwordLabel: 'Пароль',
    loginButton: 'Войти',
    registerButton: 'Зарегистрироваться',
    noAccount: 'Нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?',
    authError: 'Произошла ошибка',
    signOut: 'Выйти',
    loginTitle: 'Добро пожаловать!',
    loginSubtitle: 'Войдите в свой аккаунт',
    registerTitle: 'Новый аккаунт',
    registerSubtitle: 'Зарегистрируйтесь',

    // Loading
    loading: 'Загрузка...',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['uz'];

// Category emoji mapping (shared, not translated)
export const CATEGORY_EMOJI: Record<string, string> = {
  personal: '👤',
  work: '💼',
  shopping: '🛒',
  health: '💪',
  study: '📚',
  other: '📌',
};

export const CATEGORY_COLORS: Record<string, string> = {
  personal: '#6C5CE7',
  work: '#0984E3',
  shopping: '#00B894',
  health: '#E17055',
  study: '#FDCB6E',
  other: '#636E72',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#00B894',
  medium: '#FDCB6E',
  high: '#E17055',
};

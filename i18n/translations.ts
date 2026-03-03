export type Language = 'uz' | 'ru' | 'en';

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

    // Actions
    edit: 'Tahrirlash',
    delete: "O'chirish",
    editTask: 'Vazifani tahrirlash',
    deleteConfirm: 'Haqiqatan ham bu vazifani o\'chirishni xohlaysizmi?',
    yes: 'Ha',
    no: 'Yo\'q',

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

    // Auth validation
    validationEmailRequired: 'Email kiritish shart',
    validationEmailInvalid: "Email formati noto'g'ri",
    validationPasswordRequired: 'Parol kiritish shart',
    validationPasswordMin: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
    userNotFound: 'Foydalanuvchi topilmadi',
    wrongPassword: "Parol noto'g'ri",
    emailAlreadyRegistered: "Bu email allaqachon ro'yxatdan o'tgan",
    signInError: 'Kirish xatosi yuz berdi',
    signUpError: "Ro'yxatdan o'tish xatosi yuz berdi",

    // Settings
    english: 'Inglizcha',

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

    // Actions
    edit: 'Редактировать',
    delete: 'Удалить',
    editTask: 'Редактировать задачу',
    deleteConfirm: 'Вы действительно хотите удалить эту задачу?',
    yes: 'Да',
    no: 'Нет',

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

    // Auth validation
    validationEmailRequired: 'Введите email',
    validationEmailInvalid: 'Неверный формат email',
    validationPasswordRequired: 'Введите пароль',
    validationPasswordMin: 'Пароль должен содержать минимум 6 символов',
    userNotFound: 'Пользователь не найден',
    wrongPassword: 'Неверный пароль',
    emailAlreadyRegistered: 'Этот email уже зарегистрирован',
    signInError: 'Ошибка при входе',
    signUpError: 'Ошибка при регистрации',

    // Settings
    english: 'Английский',

    // Loading
    loading: 'Загрузка...',
  },
  en: {
    // Header
    greeting: 'Hello! 👋',
    myTasks: 'My Tasks',
    todayResult: "Today's Result",
    completed: 'completed',
    searchPlaceholder: 'Search tasks...',

    // Categories
    all: 'All',
    personal: 'Personal',
    work: 'Work',
    shopping: 'Shopping',
    health: 'Health',
    study: 'Study',
    other: 'Other',

    // Priority
    low: 'Low',
    medium: 'Medium',
    high: 'High',

    // Add modal
    newTask: 'New Task',
    writeTask: 'Write a task...',
    category: 'Category',
    priority: 'Priority',
    cancel: 'Cancel',
    add: 'Add',

    // Empty state
    noTasks: 'No tasks',
    noTasksHint: 'Press the "+" button below\nto add a new task',

    // Actions
    edit: 'Edit',
    delete: 'Delete',
    editTask: 'Edit Task',
    deleteConfirm: 'Are you sure you want to delete this task?',
    yes: 'Yes',
    no: 'No',

    // Time
    now: 'Now',
    minutesShort: 'min',
    hoursShort: 'h',
    daysShort: 'd',

    // Stats
    statistics: 'Statistics',
    statsSubtitle: 'Overview of your tasks',
    total: 'Total',
    done: 'Done',
    pending: 'Pending',
    completionRate: 'Completion Rate',
    byCategory: 'By Category',
    byPriority: 'By Priority',
    clearCompleted: 'Clear Completed',
    rateExcellent: 'Excellent! All tasks completed! 🎉',
    rateGood: 'Great result! Keep going! 💪',
    rateOkay: 'Good start! 👍',
    rateNoTasks: 'No tasks added yet',
    rateKeepGoing: 'Keep pushing! 🚀',

    // Settings
    settings: 'Settings',
    settingsSubtitle: 'App settings',
    appearance: 'Appearance',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    language: 'Language',
    uzbek: 'Uzbek',
    russian: 'Russian',
    english: 'English',

    // Profile
    profile: 'Profile',
    profileSubtitle: 'Your personal information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    emailPlaceholder: 'Your email address',
    save: 'Save',
    saved: 'Saved!',
    changePhoto: 'Change photo',
    personalInfo: 'Personal Info',

    // Auth
    login: 'Login',
    register: 'Register',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Sign In',
    registerButton: 'Sign Up',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    authError: 'An error occurred',
    signOut: 'Sign Out',
    loginTitle: 'Welcome!',
    loginSubtitle: 'Sign in to your account',
    registerTitle: 'New Account',
    registerSubtitle: 'Create your account',

    // Auth validation
    validationEmailRequired: 'Email is required',
    validationEmailInvalid: 'Invalid email format',
    validationPasswordRequired: 'Password is required',
    validationPasswordMin: 'Password must be at least 6 characters',
    userNotFound: 'User not found',
    wrongPassword: 'Incorrect password',
    emailAlreadyRegistered: 'This email is already registered',
    signInError: 'Sign in failed',
    signUpError: 'Sign up failed',

    // Loading
    loading: 'Loading...',
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

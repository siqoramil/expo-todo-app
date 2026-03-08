# Todo App

> Cross-platform task management app built with **Expo**, **React Native** & **TypeScript**

[English](#english) | [Русский](#русский) | [O'zbekcha](#ozbekcha)

---

## English

Cross-platform task management application for iOS, Android and Web.

### Features

- **Authentication** — Sign up and sign in (local storage)
- **Task Management** — Create, complete, delete, search and filter
- **Categories** — Personal, Work, Shopping, Health, Reading, Other
- **Priorities** — Low, Medium, High (with color indicators)
- **Statistics** — Completion percentage, analysis by category and priority
- **Themes** — Light, Dark and System mode
- **Languages** — Uzbek and Russian full translation
- **Animations** — Smooth 60fps animations via Reanimated
- **Haptic Feedback** — Tactile response for button presses and actions

### Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Expo | 54 | Framework and build system |
| React Native | 0.81 | Mobile UI |
| React | 19 | UI library |
| TypeScript | 5.9 | Type safety |
| Expo Router | 6 | File-based navigation |
| Zustand | 5 | State management |
| Reanimated | 4 | Animations |
| AsyncStorage | 2 | Local data storage |

### Project Structure

```
expo-project/
├── app/                    # Expo Router pages
│   ├── (auth)/             # Authentication screens
│   │   ├── login.tsx       # Login page
│   │   └── register.tsx    # Registration
│   ├── (tabs)/             # Main tab navigation
│   │   ├── index.tsx       # Task list
│   │   ├── explore.tsx     # Statistics
│   │   └── settings.tsx    # Settings & profile
│   └── _layout.tsx         # Root layout
├── components/             # Reusable components
│   └── todo/               # Todo components
│       ├── AddTodoModal.tsx
│       ├── CategoryFilter.tsx
│       ├── EmptyState.tsx
│       └── TodoItem.tsx
├── stores/                 # Zustand state management
│   ├── useAppStore.ts      # Theme, language, profile
│   ├── useAuthStore.ts     # Authentication
│   └── useTodoStore.ts     # Tasks CRUD
├── i18n/                   # Translations (uz, ru)
│   └── translations.ts
├── hooks/                  # Custom React hooks
├── constants/              # Colors and constants
├── types/                  # TypeScript types
└── assets/                 # Images and fonts
```

### Screens

#### Authentication
- **Login** — Sign in with email and password, gradient header
- **Register** — Create new user, validation

#### Tasks (Home)
- Greeting message and daily progress card
- Search and filter by category
- Animated FlatList and Floating Action Button
- Create, complete and delete tasks

#### Statistics
- Total, completed and pending tasks count
- Completion percentage (visual circular indicator)
- Progress bars by category and priority
- Motivational messages

#### Profile & Settings
- Avatar selection (from gallery)
- Edit name, surname, email
- Theme selection (Light / Dark / System)
- Language switch (Uzbek / Russian)
- Sign out

### Getting Started

#### Requirements

- [Node.js](https://nodejs.org/) (LTS version)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator or Android Emulator (optional)

#### Installation

```bash
# Clone the repository
git clone <repo-url>
cd expo-project

# Install dependencies
npm install

# Start the app
npm run start
```

After launch, the terminal will show:

- **a** — Open on Android emulator
- **i** — Open on iOS simulator
- **w** — Open in browser
- **Expo Go** — Scan QR code to open on phone

### EAS Workflows

The project is automated with [EAS Workflows](https://docs.expo.dev/eas/workflows/get-started/).

| Command | Purpose |
|---|---|
| `npm run draft` | Publish preview update |
| `npm run development-builds` | Create development build |
| `npm run deploy` | Deploy to production |

### Building

```bash
# For iOS
npx eas-cli@latest build --platform ios

# For Android
npx eas-cli@latest build --platform android

# For both
npx eas-cli@latest build --platform all
```

### Architecture

- **File-based routing** — via Expo Router in `app/` directory
- **Zustand** — Lightweight and efficient state management
- **AsyncStorage** — All data stored locally
- **Reanimated** — 60fps animations on native thread
- **TypeScript Strict Mode** — Full type safety
- **React 19** — Latest React features
- **Typed Routes** — Type-safe navigation

---

## Русский

Кроссплатформенное приложение для управления задачами на iOS, Android и Web.

### Возможности

- **Аутентификация** — Регистрация и вход в систему (локальное хранение)
- **Управление задачами** — Создание, выполнение, удаление, поиск и фильтрация
- **Категории** — Личное, Работа, Покупки, Здоровье, Чтение, Другое
- **Приоритеты** — Низкий, Средний, Высокий (с цветовыми индикаторами)
- **Статистика** — Процент выполнения, анализ по категориям и приоритетам
- **Темы** — Светлая, Тёмная и Системный режим
- **Языки** — Полный перевод на узбекский и русский
- **Анимации** — Плавные анимации 60fps через Reanimated
- **Тактильная отдача** — Вибрационный отклик при нажатиях и действиях

### Технологии

| Технология | Версия | Назначение |
|---|---|---|
| Expo | 54 | Фреймворк и система сборки |
| React Native | 0.81 | Мобильный UI |
| React | 19 | UI библиотека |
| TypeScript | 5.9 | Типобезопасность |
| Expo Router | 6 | Файловая навигация |
| Zustand | 5 | Управление состоянием |
| Reanimated | 4 | Анимации |
| AsyncStorage | 2 | Локальное хранение данных |

### Структура проекта

```
expo-project/
├── app/                    # Страницы Expo Router
│   ├── (auth)/             # Экраны аутентификации
│   │   ├── login.tsx       # Страница входа
│   │   └── register.tsx    # Регистрация
│   ├── (tabs)/             # Основная навигация по вкладкам
│   │   ├── index.tsx       # Список задач
│   │   ├── explore.tsx     # Статистика
│   │   └── settings.tsx    # Настройки и профиль
│   └── _layout.tsx         # Корневой layout
├── components/             # Переиспользуемые компоненты
│   └── todo/               # Компоненты задач
│       ├── AddTodoModal.tsx
│       ├── CategoryFilter.tsx
│       ├── EmptyState.tsx
│       └── TodoItem.tsx
├── stores/                 # Zustand управление состоянием
│   ├── useAppStore.ts      # Тема, язык, профиль
│   ├── useAuthStore.ts     # Аутентификация
│   └── useTodoStore.ts     # CRUD задач
├── i18n/                   # Переводы (uz, ru)
│   └── translations.ts
├── hooks/                  # Пользовательские React хуки
├── constants/              # Цвета и константы
├── types/                  # TypeScript типы
└── assets/                 # Изображения и шрифты
```

### Экраны

#### Аутентификация
- **Вход** — Авторизация по email и паролю, градиентный заголовок
- **Регистрация** — Создание нового пользователя, валидация

#### Задачи (Главная)
- Приветственное сообщение и карточка дневного прогресса
- Поиск и фильтрация по категориям
- Анимированный FlatList и Floating Action Button
- Создание, выполнение и удаление задач

#### Статистика
- Общее количество, выполненные и ожидающие задачи
- Процент выполнения (визуальный круговой индикатор)
- Прогресс-бары по категориям и приоритетам
- Мотивационные сообщения

#### Профиль и Настройки
- Выбор аватара (из галереи)
- Редактирование имени, фамилии, email
- Выбор темы (Светлая / Тёмная / Системная)
- Переключение языка (Узбекский / Русский)
- Выход из системы

### Запуск

#### Требования

- [Node.js](https://nodejs.org/) (LTS версия)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator или Android Emulator (необязательно)

#### Установка

```bash
# Клонировать репозиторий
git clone <repo-url>
cd expo-project

# Установить зависимости
npm install

# Запустить приложение
npm run start
```

После запуска в терминале появятся варианты:

- **a** — Открыть на Android эмуляторе
- **i** — Открыть на iOS симуляторе
- **w** — Открыть в браузере
- **Expo Go** — Сканировать QR-код для открытия на телефоне

### EAS Workflows

Проект автоматизирован с помощью [EAS Workflows](https://docs.expo.dev/eas/workflows/get-started/).

| Команда | Назначение |
|---|---|
| `npm run draft` | Публикация preview обновления |
| `npm run development-builds` | Создание development сборки |
| `npm run deploy` | Деплой в production |

### Сборка

```bash
# Для iOS
npx eas-cli@latest build --platform ios

# Для Android
npx eas-cli@latest build --platform android

# Для обеих платформ
npx eas-cli@latest build --platform all
```

### Архитектура

- **Файловая маршрутизация** — через Expo Router в папке `app/`
- **Zustand** — Лёгкое и эффективное управление состоянием
- **AsyncStorage** — Все данные хранятся локально
- **Reanimated** — Анимации 60fps в нативном потоке
- **TypeScript Strict Mode** — Полная типобезопасность
- **React 19** — Новейшие возможности React
- **Typed Routes** — Типобезопасная навигация

---

## O'zbekcha

Krossplatform vazifalarni boshqarish ilovasi — iOS, Android va Web platformalarida ishlaydi.

### Xususiyatlari

- **Autentifikatsiya** — Ro'yxatdan o'tish va tizimga kirish (lokal saqlash)
- **Vazifalar boshqaruvi** — Yaratish, bajarish, o'chirish, qidirish va filtrlash
- **Kategoriyalar** — Shaxsiy, Ish, Xaridlar, Salomatlik, O'qish, Boshqa
- **Ustuvorliklar** — Past, O'rta, Yuqori (rangli indikator bilan)
- **Statistika** — Bajarilganlar foizi, kategoriya va ustuvorlik bo'yicha tahlil
- **Mavzular** — Yorug', Qorong'i va Tizim rejimi
- **Tillar** — O'zbek va Rus tillarida to'liq tarjima
- **Animatsiyalar** — Reanimated orqali silliq 60fps animatsiyalar
- **Haptic Feedback** — Tugma bosish va harakatlar uchun taktil javob

### Texnologiyalar

| Texnologiya | Versiya | Vazifasi |
|---|---|---|
| Expo | 54 | Framework va build tizimi |
| React Native | 0.81 | Mobil UI |
| React | 19 | UI kutubxona |
| TypeScript | 5.9 | Tip xavfsizligi |
| Expo Router | 6 | Fayl asosida navigatsiya |
| Zustand | 5 | State boshqaruvi |
| Reanimated | 4 | Animatsiyalar |
| AsyncStorage | 2 | Lokal ma'lumotlar saqlash |

### Loyiha tuzilishi

```
expo-project/
├── app/                    # Expo Router sahifalari
│   ├── (auth)/             # Autentifikatsiya ekranlari
│   │   ├── login.tsx       # Kirish sahifasi
│   │   └── register.tsx    # Ro'yxatdan o'tish
│   ├── (tabs)/             # Asosiy tab navigatsiya
│   │   ├── index.tsx       # Vazifalar ro'yxati
│   │   ├── explore.tsx     # Statistika
│   │   └── settings.tsx    # Sozlamalar va profil
│   └── _layout.tsx         # Root layout
├── components/             # Qayta ishlatiladigan komponentlar
│   └── todo/               # Todo komponentlari
│       ├── AddTodoModal.tsx
│       ├── CategoryFilter.tsx
│       ├── EmptyState.tsx
│       └── TodoItem.tsx
├── stores/                 # Zustand state management
│   ├── useAppStore.ts      # Mavzu, til, profil
│   ├── useAuthStore.ts     # Autentifikatsiya
│   └── useTodoStore.ts     # Vazifalar CRUD
├── i18n/                   # Tarjimalar (uz, ru)
│   └── translations.ts
├── hooks/                  # Custom React hooks
├── constants/              # Ranglar va konstantalar
├── types/                  # TypeScript tiplar
└── assets/                 # Rasmlar va shriftlar
```

### Ekranlar

#### Autentifikatsiya
- **Kirish** — Email va parol bilan tizimga kirish, gradient sarlavha
- **Ro'yxatdan o'tish** — Yangi foydalanuvchi yaratish, validatsiya

#### Vazifalar (Bosh sahifa)
- Salomlashish xabari va kunlik progress kartasi
- Qidiruv va kategoriya bo'yicha filtrlash
- Animatsiyali FlatList va Floating Action Button
- Vazifalarni yaratish, bajarish va o'chirish

#### Statistika
- Umumiy, bajarilgan va kutilayotgan vazifalar soni
- Bajarilish foizi (vizual doira ko'rsatkich)
- Kategoriya va ustuvorlik bo'yicha progress barlar
- Motivatsion xabarlar

#### Profil va Sozlamalar
- Avatar tanlash (galereyadan)
- Ism, familiya, email tahrirlash
- Mavzu tanlash (Yorug' / Qorong'i / Tizim)
- Til o'zgartirish (O'zbek / Rus)
- Tizimdan chiqish

### Ishga tushirish

#### Talablar

- [Node.js](https://nodejs.org/) (LTS versiya)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator yoki Android Emulator (ixtiyoriy)

#### O'rnatish

```bash
# Repozitoriyani klonlash
git clone <repo-url>
cd expo-project

# Bog'liqliklarni o'rnatish
npm install

# Dasturni ishga tushirish
npm run start
```

Ishga tushgandan keyin terminalda quyidagi variantlar chiqadi:

- **a** — Android emulatorda ochish
- **i** — iOS simulatorda ochish
- **w** — Brauzerda ochish
- **Expo Go** — QR kod skanerlash orqali telefondan ochish

### EAS Workflows

Loyiha [EAS Workflows](https://docs.expo.dev/eas/workflows/get-started/) bilan avtomatlashtirilgan.

| Buyruq | Vazifasi |
|---|---|
| `npm run draft` | Preview update nashr qilish |
| `npm run development-builds` | Development build yaratish |
| `npm run deploy` | Production ga deploy qilish |

### Build qilish

```bash
# iOS uchun
npx eas-cli@latest build --platform ios

# Android uchun
npx eas-cli@latest build --platform android

# Ikkalasi uchun
npx eas-cli@latest build --platform all
```

### Loyiha arxitekturasi

- **Fayl asosida routing** — Expo Router orqali `app/` papkasida
- **Zustand** — Yengil va samarali state management
- **AsyncStorage** — Barcha ma'lumotlar lokal saqlanadi
- **Reanimated** — 60fps animatsiyalar native threadda
- **TypeScript Strict Mode** — To'liq tip xavfsizligi
- **React 19** — Eng so'nggi React xususiyatlari
- **Typed Routes** — Navigatsiya uchun tip xavfsizligi

---

## Author / Муаллиф / Muallif

**Ramil Developer**

Bundle ID: `com.ramildeveloper.expoproject`

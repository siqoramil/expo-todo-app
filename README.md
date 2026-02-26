# Todo App

Cross-platform vazifalarni boshqarish ilovasi — **Expo**, **React Native** va **TypeScript** asosida yaratilgan.

iOS, Android va Web platformalarida ishlaydi.

## Xususiyatlari

- **Autentifikatsiya** — Ro'yxatdan o'tish va tizimga kirish (lokal saqlash)
- **Vazifalar boshqaruvi** — Yaratish, bajarish, o'chirish, qidirish va filtrlash
- **Kategoriyalar** — Shaxsiy, Ish, Xaridlar, Salomatlik, O'qish, Boshqa
- **Ustuvorliklar** — Past, O'rta, Yuqori (rangli indikator bilan)
- **Statistika** — Bajarilganlar foizi, kategoriya va ustuvorlik bo'yicha tahlil
- **Mavzular** — Yorug', Qorong'i va Tizim rejimi
- **Tillar** — O'zbek va Rus tillarida to'liq tarjima
- **Animatsiyalar** — Reanimated orqali silliq 60fps animatsiyalar
- **Haptic Feedback** — Tugma bosish va harakatlar uchun taktil javob

## Texnologiyalar

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

## Loyiha tuzilishi

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

## Ekranlar

### Autentifikatsiya
- **Kirish** — Email va parol bilan tizimga kirish, gradient sarlavha
- **Ro'yxatdan o'tish** — Yangi foydalanuvchi yaratish, validatsiya

### Vazifalar (Bosh sahifa)
- Salomlashish xabari va kunlik progress kartasi
- Qidiruv va kategoriya bo'yicha filtrlash
- Animatsiyali FlatList va Floating Action Button
- Vazifalarni yaratish, bajarish va o'chirish

### Statistika
- Umumiy, bajarilgan va kutilayotgan vazifalar soni
- Bajarilish foizi (vizual doira ko'rsatkich)
- Kategoriya va ustuvorlik bo'yicha progress barlar
- Motivatsion xabarlar

### Profil va Sozlamalar
- Avatar tanlash (galereyadan)
- Ism, familiya, email tahrirlash
- Mavzu tanlash (Yorug' / Qorong'i / Tizim)
- Til o'zgartirish (O'zbek / Rus)
- Tizimdan chiqish

## Ishga tushirish

### Talablar

- [Node.js](https://nodejs.org/) (LTS versiya)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator yoki Android Emulator (ixtiyoriy)

### O'rnatish

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

## EAS Workflows

Loyiha [EAS Workflows](https://docs.expo.dev/eas/workflows/get-started/) bilan avtomatlashtirilgan.

| Buyruq | Vazifasi |
|---|---|
| `npm run draft` | Preview update nashr qilish |
| `npm run development-builds` | Development build yaratish |
| `npm run deploy` | Production ga deploy qilish |

## Build qilish

```bash
# iOS uchun
npx eas-cli@latest build --platform ios

# Android uchun
npx eas-cli@latest build --platform android

# Ikkalasi uchun
npx eas-cli@latest build --platform all
```

## Loyiha arxitekturasi

- **Fayl asosida routing** — Expo Router orqali `app/` papkasida
- **Zustand** — Yengil va samarali state management
- **AsyncStorage** — Barcha ma'lumotlar lokal saqlanadi
- **Reanimated** — 60fps animatsiyalar native threadda
- **TypeScript Strict Mode** — To'liq tip xavfsizligi
- **React 19** — Eng so'nggi React xususiyatlari
- **Typed Routes** — Navigatsiya uchun tip xavfsizligi

## Muallif

**Ramil Developer**

Bundle ID: `com.ramildeveloper.expoproject`

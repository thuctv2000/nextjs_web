export const profile = {
  name: "Tran Van Thuc",
  displayName: "THUC",
  fullDisplay: "TRAN VAN THUC",
  role: "Mobile Developer",
  tagline: "MADE FOR MOBILE. BUILT FOR HUMANS.",
  objective:
    "Flutter developer with 3 years of experience building cross-platform applications and supporting native Android & iOS development — aiming toward a Senior Mobile Developer role.",
  heroBlurb:
    "Designed to ship, scale, and survive in production. Thuc makes the hardest mobile problems feel considered.",
  phone: "0869 290 411",
  email: "tranvanthuc2dev@gmail.com",
  facebook: "facebook.com/pandapanda20.5",
  facebookUrl: "https://facebook.com/pandapanda20.5",
  address: "41 Tran Thi Trong, Tan Binh, Ho Chi Minh City",
  education: {
    school: "University of Information Technology (VNUHCM – UIT)",
    major: "Computer Science",
    period: "Oct 2018 — May 2023",
  },
};

export const stats = [
  { value: 3, suffix: "+", label: "Years of experience" },
  { value: 5, suffix: "", label: "Flagship projects" },
  { value: 4, suffix: "", label: "Tech stacks mastered" },
  { value: 2, suffix: "", label: "App stores shipped to" },
];

export const marqueeSkills = [
  "Flutter",
  "Dart",
  "React Native",
  "TypeScript",
  "Kotlin",
  "Swift",
  "Jetpack Compose",
  "Firebase",
  "Clean Architecture",
  "BLoC",
  "MVVM",
  "CI / CD",
  "Google Maps",
  "BLE",
  "NFC",
  "Offline-first",
];

export const responsibilities = [
  {
    title: "Cross-platform development",
    detail:
      "Develop and maintain mobile applications with Flutter (Dart) and React Native (TypeScript / JavaScript).",
  },
  {
    title: "Native Android & iOS",
    detail:
      "Fix bugs and ship new features for Android Native (Java / Kotlin) and iOS Native (Swift, UIKit) applications.",
  },
  {
    title: "CI / CD pipelines",
    detail:
      "Build, test and deploy mobile apps with Bitbucket Pipelines and GitHub Actions.",
  },
  {
    title: "Architecture & quality",
    detail:
      "Apply SOLID, Clean Architecture and MVVM. Integrate RESTful APIs, debug and optimize performance and stability.",
  },
  {
    title: "Firebase ecosystem",
    detail:
      "Cloud Messaging, Analytics, Crashlytics and App Distribution across every project.",
  },
  {
    title: "Release management",
    detail:
      "Versioning, internal testing and releasing to Google Play Store and Apple App Store.",
  },
  {
    title: "AI-accelerated workflow",
    detail:
      "Leverage ChatGPT, Claude Code and Antigravity for development, debugging, refactoring and documentation.",
  },
];

export interface Project {
  index: string;
  name: string;
  role: string;
  tech: string[];
  description: string;
  highlights: string[];
  accent: string;
}

export const projects: Project[] = [
  {
    index: "01",
    name: "HCN Manufacturing",
    role: "Mobile Developer",
    tech: ["Flutter", "BLoC / Cubit", "Dio", "Hive", "GoRouter", "Native Android"],
    description:
      "Manufacturing management app streamlining inventory counting, production planning and output tracking — with real-time hardware barcode scanning and offline-first sync.",
    highlights: [
      "Clean Architecture + BLoC state management",
      "Native Android scanner via EventChannel",
      "Offline-first Hive layer with background sync",
      "Smart barcode parsing: product codes vs quantities",
    ],
    accent: "#dc5000",
  },
  {
    index: "02",
    name: "HCN Delivery",
    role: "Mobile Developer",
    tech: ["Flutter", "Google Maps", "Traccar GPS", "Firebase", "Hive · Isar", "AWS S3"],
    description:
      "Logistics & delivery platform for drivers, managers and partners — real-time GPS tracking, trip workflow, order creation and push notifications.",
    highlights: [
      "Background-service GPS with Traccar integration",
      "Full trip workflow: schedule, run, incident reports",
      "Custom map markers, polylines, geo-triggers",
      "Multi-role auth with token & session handling",
    ],
    accent: "#5d6c49",
  },
  {
    index: "03",
    name: "Workflow Space",
    role: "Mobile Developer",
    tech: ["React Native", "TypeScript", "VNPay · Momo", "Vision Camera", "NFC", "MMKV"],
    description:
      "Co-working space booking app — book rooms and desks by the hour, manage memberships, pay online and unlock IoT devices via QR / NFC.",
    highlights: [
      "Booking system with QR / NFC check-in",
      "IoT control: door unlock, locker management",
      "VNPay & Momo online payment integration",
      "Pixel-accurate UI from Figma designs",
    ],
    accent: "#f6e0c6",
  },
  {
    index: "04",
    name: "SeasonBus",
    role: "Mobile Developer",
    tech: ["Swift", "Kotlin", "BLE Beacons", "ML Kit", "Traccar", "SQLite"],
    description:
      "Enterprise app for Singapore's school-bus network — student attendance, real-time route tracking and operations communication, fully offline-capable.",
    highlights: [
      "BLE beacon auto-detection of students",
      "PIN / QR / biometric authentication",
      "Barcode + NFC attendance verification",
      "Background location with network resilience",
    ],
    accent: "#dc5000",
  },
  {
    index: "05",
    name: "Android Print Service",
    role: "Mobile Developer",
    tech: ["Kotlin", "Jetpack Compose", "NanoHTTPD", "Room", "ESC/POS", "Coroutines · Flow"],
    description:
      "Turns Android devices into print servers — bridging ePOS requests from web POS / ERP systems (Odoo) to thermal printers over USB and LAN.",
    highlights: [
      "Foreground HTTP/HTTPS server with NanoHTTPD",
      "USB discovery + ESC/POS bitmap printing",
      "SSL/TLS certificate generation (Bouncy Castle)",
      "XML → Bitmap receipt rendering pipeline",
    ],
    accent: "#5d6c49",
  },
];

export const navLinks = [
  { label: "Intro", href: "#intro" },
  { label: "Craft", href: "#craft" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

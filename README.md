![Vigiia](./resources/social-feature-graphic-atlas.png)

# 🛡️ Vigiia — AI route protection and real-time trip risk detection.

Vigiia is built on one simple principle:

**Predict → Monitor → Detect → Escalate.**

When a trip starts, the system creates an expected travel model (route, time, speed, stop behavior).  
From that moment, it continuously compares real-world movement against that model.

If behavior stays within expected parameters → the trip remains secure.

If anomalies appear (route deviation, unusual stop, signal loss, panic activation) → the system increases risk level and automatically escalates monitoring and response protocols.

Even without connectivity, all events are securely recorded and synchronized once the signal returns.

Vigiia doesn’t just record where you were.  
It validates what should be happening — and reacts when it doesn’t.

## Quick start

1. Clone the repository:

```sh
git clone https://github.com/binnicordova/vigiia.git
cd vigiia
```

2. Install dependencies:

```sh
pnpm install
```

3. Run and preview on your iPhone or Android device (scan the QR in Expo Go):

```sh
pnpm start
```

## Helpful commands

- **Preview on a device**: `pnpm run eas-preview`
- **Run component stories**: `pnpm run storybook:start`
- **Browse stories on the web**: `pnpm run storybook:web` 🌐
- **Run tests**: `pnpm run test`

## Where to look in the code (Project Structure)

This project follows a clear and scalable structure inside the `src/` directory:

- 📂 **Main code**: `src/`
- 📱 **App screens**: `src/app/` (Expo Router file-based routing)
- 🧩 **Shared components**: `src/components/` (Reusable UI elements)
- 📦 **State management**: `src/stores/` (Global state using Jotai)
- 🎣 **Hooks**: `src/hooks/` (Custom React hooks)
- 🎨 **Theme & Styles**: `src/theme/` and `src/styles/` (Design tokens and global styles)
- 🛠️ **Utils**: `src/utils/` (Helper functions)

## Technical Stack Details (Architecture)

This project is built with a modern and robust stack:

- **Framework**: Expo / React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Jotai (Atomic state)
- **Styling**: Styled Components / StyleSheet
- **Testing**: Jest

## Deployment (AppStore / PlayStore / Web)

When you’re ready to publish, use **EAS (Expo Application Services)**:

**Build for Production:**
```sh
pnpm run build:prod
```

**Update over the Air (OTA):**
```sh
pnpm run update:prod
```

## Reset Project & Tools

**Reset the Project:**
To reset the project and remove all example code, run the following command:
```sh
pnpm run reset-project
```

**Generate Assets:**
Generate the Assets to the app and Stores with simple script:
```sh
pnpm run generate:branding
```

## 🤖 AI Agent Skills & Automation

This boilerplate is uniquely optimized for AI-assisted development. It includes **Specialized Agent Skills** (located in `.github/skills/`) that teach your AI assistant (Copilot, Cursor, etc.) how to:

- 🚀 **Accelerate Coding**: Get from idea to implementation faster with domain-specific knowledge.
- 🎯 **Control Generation**: Ensure the AI follows the exact technical standards of this project (Jotai, Expo Router, Biome).
- 🧹 **Perform Clean Code**: Automatic enforcement of modular architecture and technical debt prevention.
- ⏱️ **Save Time**: Reduce manual research by providing the AI with immediate project context.

### How to use
Use the AI powerups by typing "#" and selecting the prompt or skill in your AI chatbox editor:

```
#expo-architect       - Modular architecture and technical standards
#building-ui          - Guide for Native UI, animations, and icons
#api-routes           - Serverless API development workflows
#deployment           - App Store and Play Store submission guide
#upgrading-expo       - SDK update patterns and dependency fixes
```

**Automation Prompts:**
```
#EXPO-RELEASE-NEXT-VERSION.prompt.md
#EXPO-TEST-CREATE.prompt.md
#EXPO-DOC-README-CREATE.prompt
```

## 📬 Connect with Binni Cordova

PortFolio
- [binnicordova.com](https://binnicordova.com)

Feel free to reach out if you have any questions or need support. Call [ +1 (650) 374-4225 ](tel:+16503744225) and ask for Binni Cordova.

Contact him:
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-%230072b1?logo=linkedin)](https://www.linkedin.com/in/binnicordova)
- [![Calendar](https://img.shields.io/badge/Calendar-Book%20a%20Meeting-%23FF7F50?logo=google-calendar)](https://calendly.com/binnizenobiocordovaleandro/meet)
- [![GitHub](https://img.shields.io/badge/GitHub-Profile-%23808080?logo=github)](https://github.com/binnizenobiocordovaleandro)
- [![Email](https://img.shields.io/badge/Email-Send%20Mail-%23FF5722?logo=gmail)](mailto:binnizenobiocordovaleandro@gmail.com)
- [![Phone](https://img.shields.io/badge/Phone-Call-%234CAF50?logo=phone)](tel:+1-650-374-4225)


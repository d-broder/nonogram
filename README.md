# Nonogram Puzzle Game

A modern Nonogram game with singleplayer and multiplayer support, built with React 18+, TypeScript, Vite, and Firebase.

## �️ **Architecture Overview (v2.0 - August 2025)**

This project follows a **feature-based architecture** with modern React patterns:

```
src/
├── app/                    # Application core
├── shared/                 # Shared resources (components, hooks, utils)
├── features/               # Domain-specific features (game, room, layout, ui)
├── pages/                  # Route handlers only
└── views/                  # Page view components
```

### **Key Architectural Patterns:**

- **Feature-based organization** for scalability
- **Container-controlled spacing** for consistent layouts
- **Unified form logic** with shared RoomForm component
- **Conditional synchronization** for singleplayer/multiplayer modes
- **Barrel exports** for clean import management

## �🎯 Main Features

- **Singleplayer Mode**: Solve classic and super nonogram puzzles individually
- **Multiplayer Mode**: Play with friends in real time using private rooms
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Modern UI Components**: Modular, reusable component system
- **Real-time Synchronization**: Firebase-powered multiplayer experience
- **Advanced Controls**: Zoom, grid reset, and smart painting modes

## 🎮 Game Modes

### Singleplayer

- Choose between Classic or Super Nonogram puzzles
- Solve at your own pace with local state management
- Clue click system for visual assistance
- Zoom and grid reset controls

### Multiplayer

- Create or join private rooms with custom room IDs
- Real-time collaboration with other players
- Player-specific color system for visual distinction
- Live synchronization of all game actions
- Automatic room cleanup and player management

## 🎯 How to Play

### Basic Controls

- **Left Click**: Cycles cell states (empty → filled → marked → empty)
- **Paint Mode**: Switch between black cells, X marks, and O marks
- **Clue Assistance**: Click row/column numbers for visual hints
- **Zoom Controls**: Scale the game board for better visibility

### Multiplayer Features

- **Room Creation**: Generate shareable room links
- **Player Colors**: Each player gets a unique color identifier
- **Real-time Updates**: See other players' moves instantly
- **Room Management**: Automatic cleanup when players leave

## 🛠️ Technologies Used

### Frontend

- **React 18+** with Concurrent Features and modern hooks
- **TypeScript** for type safety and developer experience
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **CSS Modules** with container-controlled spacing patterns

### Backend/Database

- **Firebase Firestore** for real-time multiplayer synchronization
- **Firebase Hosting** for production deployment
- **Session Storage** for local player state management

### Development Tools

- **ESLint** with TypeScript rules
- **Feature-based** file organization
- **Barrel exports** for clean imports
- **Custom hooks** for logic separation

## 🚀 **Development Workflow**

### Getting Started

```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run lint    # Code quality check
```

### Project Structure

- **Components**: UI rendering only, composed via props
- **Hooks**: State management and side effects
- **Utils**: Pure functions for data manipulation
- **Services**: External API and Firebase interactions
- **Types**: Centralized TypeScript definitions

### Multiplayer Testing

1. Start dev server: `npm run dev`
2. Create room in one browser tab
3. Join room in incognito/different browser
4. Test real-time synchronization

## 📊 **Architecture Metrics (Post-Refactoring)**

### File Size Optimization

- **PageLayout**: 731 → 302 lines (-58%)
- **CreateRoomModal**: 166 → 60 lines (-64%)
- **JoinRoomPage**: 265 → 113 lines (-57%)

### Organization Improvements

- **Feature-based structure**: 95% implemented
- **Form unification**: 3 implementations → 1 base + wrappers
- **Constants centralization**: Complete in `shared/constants/`
- **Barrel exports**: Fully implemented across all modules

## 🎮 Planned Future Features

- Real-time chat system for multiplayer
- Competitive ranking and scoring
- Custom puzzle creator
- Themes and visual customizations
- Offline mode with sync

---

**Developed with ❤️ using React, TypeScript and Firebase**

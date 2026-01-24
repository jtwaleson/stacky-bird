# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stacky Bird is an educational programming game designed for kids 4+ that teaches low-level programming concepts through stack-based puzzle solving. Players control a bird that navigates a grid by executing stack operations, learning programming concepts without realizing it.

The game is built with Vue 3, TypeScript, Vite, and Pinia for state management.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server
npm run preview      # Preview production build locally
```

### Building
```bash
npm run build        # Type-check and build for production
npm run build-only   # Build without type-checking
```

### Code Quality
```bash
npm run type-check   # Run Vue TypeScript compiler
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
```

### Pre-commit Hooks
The repository uses pre-commit hooks that run:
- Code formatting (Prettier)
- Type checking (vue-tsc)
- Translation validation (Python script)
- Wiki block validation (Python script)

If pre-commit checks fail, fix the issues before committing.

## Architecture

### Core Game Concepts

**Instructions**: Stack operations and control flow commands defined in `src/instructions.ts`. Each instruction has:
- `symbol`: Unicode character displayed on tiles
- `description`: i18n key for instruction explanation
- `execute`: Async function that manipulates the bird/stack/board state
- `instructionClass`: Category for grouping (A, B, C, D, E, F, G, Z)
- `outgoingDirections` (optional): Valid directions for flow control

**Levels**: Puzzle definitions in `src/levels/*.ts`. Each level exports:
- `displayName`: Human-readable level name
- `description`: Level objective
- `hint`: Optional hint text
- `unlocksInstructions`: Array of instruction codes unlocked on completion
- `unlocksLevels`: Array of level codes unlocked on completion
- `levelTiles`: Array of tile objects with `{x, y, ...instructionSpread}`
- Test cases (for levels that validate stack output)

**State Management** (Pinia store in `src/store.ts`):
- `instructions`: Registry of all instruction definitions
- `levels`: Registry of all level definitions with completion status
- `locale`: Current language (en/nl/es)
- Completion state persisted to localStorage

### Application Flow

1. **Startup** (`src/main.ts`):
   - Creates Pinia store
   - Registers all instructions from `src/instructions.ts`
   - Auto-imports all levels from `src/levels/*.ts` using Vite's `import.meta.glob`
   - Assigns instruction names to tiles by matching symbols/execute functions
   - Loads translations from `src/translations/*.json`
   - Mounts Vue app with custom `$t()` and `$tr()` translation methods

2. **Routing** (`src/router/index.ts`):
   - `/`: Main menu (level selection, settings, wiki access)
   - `/level/:levelName`: Level player with game board
   - `/wiki`: Block wiki showing all discovered instructions

3. **Game Loop** (`src/components/Board.vue`):
   - Bird starts at STRT tile, moves in current direction
   - Executes tile's instruction when landing
   - Continues until FINI tile or error occurs
   - Validates final stack against test case (if defined)
   - On success: marks level complete, unlocks new levels/instructions

### Key Components

- **Board.vue**: Main game engine - renders grid, manages bird movement, executes instructions, handles game state
- **MainMenu.vue**: Level selection, language picker, progress display
- **BlockWiki.vue**: Shows all unlocked instructions with descriptions
- **Instruction.vue**: Renders individual instruction tiles with symbols
- **LevelPlayer.vue**: Wrapper for Board component with level routing

### Translation System

Translations live in `src/translations/{locale}.json` as nested objects. Access via:
- `$t(key)`: Simple translation lookup
- `$tr(key, {replacements})`: Translation with variable substitution using `{varName}` syntax

English (`en.json`) is the canonical source. Always add keys to English first, then translate to other languages.

### Adding New Instructions

1. Add instruction definition to `src/instructions.ts`
2. Add translation key to `src/translations/en.json` under `instructions.*`
3. Add to `BlockWiki.vue` category sections if needed
4. Create levels that unlock the instruction via `unlocksInstructions`

### Adding New Levels

1. Create `src/levels/XXXX.ts` (4-digit naming convention)
2. Export level object with required fields
3. Reference new level in another level's `unlocksLevels` array
4. Level is auto-registered on app startup

### Validation Scripts

- `scripts/check-translations.py`: Ensures all i18n keys exist in all language files
- `scripts/check-wiki-blocks.py`: Validates BlockWiki component references match instructions

These run automatically in pre-commit hooks.

## Important Patterns

### Level Design
- Level names are 4-digit codes (e.g., "0001", "2014")
- First level is always "0001"
- Use spreads to copy instruction properties to tiles: `{ x: 3, y: 5, ...instructions['PLUS'] }`
- For tiles with state (DUMP, WAIT), add `state` property

### Instruction Execution
- Instructions receive `(bird, board, boardObject?)` parameters
- Must handle stack underflow errors gracefully via `board.dieBird(errorKey, bird, params?)`
- Use `await sleep(board.speed)` between visual operations for animation
- Return `'NOMOVE'` to prevent bird movement, `'SKIP'` to teleport, `'JUMP'` to skip validation

### Reactivity
- Use `toRaw()` when comparing or manipulating Pinia state in game logic
- Board state is reactive, instruction definitions are `markRaw()` for performance

## Tech Stack Notes

- **Node version**: ^20.19.0 || >=22.12.0 (enforced in package.json)
- **Build tool**: Vite 7 with Vue plugin
- **Audio**: Tone.js (lazy-loaded on first sound)
- **Icons**: Bootstrap Icons (unicode and class-based)
- **Modals**: vue-final-modal
- **Toasts**: vue-toastification

# Architecture

Technical design for the Trumpet Exercise App.

## Component Structure

The app is a single-page application with three main views:

| View | Purpose |
|------|---------|
| **CategoryView** | Displays exercise categories (Held Notes, Scales, Arpeggios, etc.) |
| **KeyView** | Displays key selection (C, G, D, A, E, B, F#, F, Bb, Eb, Ab, Db, Gb) |
| **ExerciseView** | Renders the selected exercise as sheet music using VexFlow |

Navigation is handled by a simple view-switching mechanism. No full routing library is required.

## Data Model

### Exercise Categories

Each category defines a type of exercise and how it is generated:

| Category | Description |
|----------|-------------|
| **Held Notes** | Long tones on scale degrees; uses major/minor keys |
| **Scales** | Ascending/descending major or minor scales |
| **Arpeggios** | Major arpeggios (tonic, 3rd, 5th, octave); uses 12 major keys |
| **Chromatic Scales** | Predefined chromatic ranges (e.g., C4 to C5, G4 to F5) |
| **Etudes** | Predefined short study pieces |

### Keys / Options

- **Held Notes & Scales**: 24 keys (12 major + 12 minor), e.g. C Major, A Minor, G Major, E Minor, etc.
- **Arpeggios**: 12 major keys (C, G, D, A, E, B, F#, F, Bb, Eb, Ab, Db, Gb)
- **Chromatic Scales**: Named ranges (C4 to C5, G4 to F5)
- **Etudes**: Named etudes (Etude in C, etc.)

### Exercise Structure

Exercises are defined as note sequences that can be rendered by VexFlow. Each exercise is keyed by `(categoryId, keyId)` and contains:

- **notes**: EasyScore string (e.g., `C4/q, D4, E4, F4, G4, A4, B4, C5`)
- **noteNames**: Array of note names for playback and annotations
- **timeSignature**: Optional (e.g., `4/4`)
- **title**: Display name for the exercise
- **totalBeats**: Total beats for layout
- **beamGroups**: Optional; when set, notes are eighth notes grouped in beams

See [EXERCISE-DATA.md](EXERCISE-DATA.md) for the full data format.

## VexFlow Integration

- **API**: EasyScore (recommended high-level API)
- **Clef**: Treble
- **Output**: Canvas or SVG (configurable)
- **Note format**: VexFlow pitch notation (e.g., `C4`, `G#4`, `Bb5`)

Example:

```typescript
// EasyScore string for C major scale (quarter notes)
"C4/q, D4, E4, F4, G4, A4, B4, C5"
```

A `MusicRenderer` component wraps VexFlow and:

1. Creates a renderer attached to a DOM element (SVG backend)
2. Builds a System with one or more staves
3. Adds clef (treble), time signature, and notes
4. Annotates each note with its name and Bb trumpet fingering
5. Makes notes clickable to play individual pitches via `trumpetSound`
6. Calls `draw()` to render

## Audio

The `audio/trumpetSound` module provides:

- **playTrumpetNote(noteName, durationMs, startTime)**: Plays a single synthesized trumpet note (sawtooth + lowpass filter)
- **playExercise(options)**: Plays a full exercise, respecting note durations and tempo (72 BPM default)

Uses the Web Audio API; `AudioContext` is resumed on first user interaction.

## State Management

### Navigation Stack

Navigation uses a stack-based model:

- **Push**: When the user selects a category or key, the new screen is pushed onto the stack
- **Pop**: When the user clicks Back, the current screen is popped and the previous one is shown

```
Stack: [CategoryView]
User selects "Scales" → Stack: [CategoryView, KeyView]
User selects "C Major" → Stack: [CategoryView, KeyView, ExerciseView]
User clicks Back → Stack: [CategoryView, KeyView]
User clicks Back → Stack: [CategoryView]
```

### Selection State

- **selectedCategory**: ID of the chosen category (when on Key or Exercise screen)
- **selectedKey**: ID of the chosen key (when on Exercise screen)

These are passed as props or stored in minimal app state and used to load the correct exercise data.

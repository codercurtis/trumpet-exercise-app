# User Flow

High-level flow of the user through the Trumpet Exercise App.

## Diagram

```mermaid
flowchart TD
    Start[User opens app] --> CategoryScreen[Category Screen]
    CategoryScreen --> |Select: Held Notes| KeyScreen[Key / Option Selection Screen]
    CategoryScreen --> |Select: Scales| KeyScreen
    CategoryScreen --> |Select: Arpeggios| KeyScreen
    CategoryScreen --> |Select: Chromatic Scales| KeyScreen
    CategoryScreen --> |Select: Etudes| KeyScreen
    KeyScreen --> |Select key or option| ExerciseScreen[Exercise Screen]
    ExerciseScreen --> |Back| KeyScreen
    KeyScreen --> |Back| CategoryScreen
```

## Steps

1. **Category Screen** – User sees categories (Held Notes, Scales, Arpeggios, Chromatic Scales, Etudes) and selects one.
2. **Key/Option Selection Screen** – User sees keys or options based on category (e.g., major/minor keys for scales, chromatic ranges, etudes).
3. **Exercise Screen** – User sees the rendered music with note names and fingerings; can play the full exercise or click individual notes.

## Navigation

- **Back** – Available on Key Selection and Exercise screens; returns to the previous screen.
- **Select** – Moves forward to the next screen in the flow.
- **Play** – On Exercise screen, plays the full exercise with synthesized trumpet sound.

# Exercise Data Model

Defines how exercises are structured and represented for the Trumpet Exercise App.

## Categories

| ID | Name | Description |
|----|------|-------------|
| `held-notes` | Held Notes | Long tones on scale degrees; uses major/minor keys |
| `scales` | Scales | Major and minor scale patterns (ascending/descending) |
| `arpeggios` | Arpeggios | Major arpeggios (tonic, 3rd, 5th, octave) |
| `chromatic-scales` | Chromatic Scales | Predefined chromatic ranges (e.g., C4 to C5) |
| `etudes` | Etudes | Predefined short study pieces |

## Keys

### Arpeggios

Twelve major keys by ID:

| Key ID | Display Name |
|--------|--------------|
| `C` | C Major |
| `G` | G Major |
| `D` | D Major |
| `A` | A Major |
| `E` | E Major |
| `B` | B Major |
| `F#` | F# Major |
| `F` | F Major |
| `Bb` | Bb Major |
| `Eb` | Eb Major |
| `Ab` | Ab Major |
| `Db` | Db Major |
| `Gb` | Gb Major |

### Scales & Held Notes

Twenty-four keys (12 major + 12 minor), e.g. C Major, A Minor, G Major, E Minor, etc.

### Chromatic Scales

Named ranges:

| Key ID | Display Name |
|--------|--------------|
| `C4-C5` | C4 to C5 |
| `G4-F5` | G4 to F5 |

### Etudes

| Key ID | Display Name |
|--------|--------------|
| `C` | Etude in C |

## Exercise Structure

Each exercise is keyed by `(categoryId, keyId)` and contains:

```typescript
interface Exercise {
  id: string;
  categoryId: string;
  keyId: string;
  title: string;
  notes: string;           // VexFlow EasyScore string
  noteNames: string[];     // Note names for playback and annotations
  timeSignature?: string;  // e.g. "4/4"
  totalBeats?: number;     // Total beats for layout
  beamGroups?: number;     // When set, notes are 8th notes grouped in beams (e.g. etudes)
}
```

## VexFlow EasyScore Note Format

- **Pitch**: Letter + octave (e.g., `C4`, `G#4`, `Bb5`)
- **Duration**: `/q` quarter, `/h` half, `/w` whole, `/8` eighth
- **Multiple notes**: Comma-separated
- **Chords**: Parentheses, e.g. `(C4 E4 G4)/q`

### Examples

**C major scale ascending (quarter notes):**

```
C4/q, D4, E4, F4, G4, A4, B4, C5
```

**C major arpeggio (quarter notes):**

```
C4/q, E4, G4, C5, G4, E4, C4
```

**Held note (whole note on C4):**

```
C4/w
```

**D major scale with eighth notes:**

```
D4/8, E4, F#4, G4, A4, B4, C#5, D5
```

## Scale Tonic Pitches by Key

| Key | Tonic (written) | Scale notes (C4 = middle C) |
|-----|-----------------|-----------------------------|
| C | C | C D E F G A B C |
| G | G | G A B C D E F# G |
| D | D | D E F# G A B C# D |
| A | A | A B C# D E F# G# A |
| E | E | E F# G# A B C# D# E |
| B | B | B C# D# E F# G# A# B |
| F# | F# | F# G# A# B C# D# E# F# |
| F | F | F G A Bb C D E F |
| Bb | Bb | Bb C D Eb F G A Bb |
| Eb | Eb | Eb F G Ab Bb C D Eb |
| Ab | Ab | Ab Bb C Db Eb F G Ab |
| Db | Db | Db Eb F Gb Ab Bb C Db |
| Gb | Gb | Gb Ab Bb Cb Db Eb F Gb |

## Data Storage

Exercise definitions live in `src/data/`:

- **exercises.ts**: `getExercise(categoryId, keyId)` builds exercises; contains `etudes`, `chromaticExercises`, `scaleKeys`, and scale/arpeggio generators
- **categories.ts**: Category definitions
- **keys.ts**: Major keys for arpeggios
- **trumpetFingering.ts**: Bb trumpet fingering chart (written pitch)

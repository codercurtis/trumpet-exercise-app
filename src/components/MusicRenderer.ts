import { Factory, Renderer, BarlineType, Beam, Fraction } from 'vexflow';
import type { CommitHook } from 'vexflow';
import type { StemmableNote, Stave } from 'vexflow';
import { getFingering } from '../data/trumpetFingering';
import { startSustainedNote } from '../audio/trumpetSound';

const BEATS_PER_MEASURE = 4;
const MEASURES_PER_STAVE = 4;
const BEATS_PER_STAVE = BEATS_PER_MEASURE * MEASURES_PER_STAVE;
const NOTES_PER_STAVE_ETUDE = 16; // 8 beats × 2 eighth notes per beat

let renderId = 0;

export interface RenderMusicOptions {
  timeSignature?: string;
  noteNames?: string[];
  totalBeats?: number;
  beamGroups?: number;
  showAnnotations?: boolean;
  keySignature?: string;
  beamIndices?: number[][];
  measureBoundaries?: number[];
}

/** Insert BarNote at measure boundaries within a chunk of notes. */
function insertMeasureBars<T>(
  chunk: T[],
  notesPerMeasureOrBoundaries: number | number[],
  vf: InstanceType<typeof Factory>
): (T | ReturnType<InstanceType<typeof Factory>['BarNote']>)[] {
  if (chunk.length === 0) return [];
  const n = notesPerMeasureOrBoundaries;
  const barAfterIndices: number[] =
    typeof n === 'number' && n >= 1
      ? Array.from(
          { length: Math.floor(chunk.length / n) },
          (_, i) => (i + 1) * n - 1
        ).filter((idx) => idx < chunk.length - 1)
      : Array.isArray(n)
        ? n
        : [];
  const barAfterSet = new Set(barAfterIndices);
  const result: (T | ReturnType<InstanceType<typeof Factory>['BarNote']>)[] = [];
  for (let i = 0; i < chunk.length; i++) {
    result.push(chunk[i]);
    if (barAfterSet.has(i)) {
      result.push(vf.BarNote({ type: BarlineType.SINGLE }));
    }
  }
  return result;
}

function computeChunkRanges(
  noteCount: number,
  beatsPerNote: number,
  measureBoundaries: number[] | undefined,
  beatsPerStave: number,
  measuresPerStave: number
): { starts: number[]; ends: number[] } {
  if (measureBoundaries && measureBoundaries.length >= measuresPerStave) {
    const measureEnds = [...measureBoundaries];
    if (measureEnds[measureEnds.length - 1] !== noteCount - 1) {
      measureEnds.push(noteCount - 1);
    }
    const starts: number[] = [0];
    const ends: number[] = [];
    for (let m = measuresPerStave - 1; m < measureEnds.length; m += measuresPerStave) {
      ends.push(measureEnds[m] + 1);
      if (m + measuresPerStave < measureEnds.length) {
        starts.push(measureEnds[m] + 1);
      }
    }
    if (ends.length < starts.length) {
      ends.push(noteCount);
    }
    return { starts, ends };
  }
  const notesPerStave = Math.min(
    noteCount,
    Math.max(1, Math.floor(beatsPerStave / beatsPerNote))
  );
  const starts: number[] = [];
  const ends: number[] = [];
  for (let s = 0; s < noteCount; s += notesPerStave) {
    starts.push(s);
    ends.push(Math.min(s + notesPerStave, noteCount));
  }
  return { starts, ends };
}

function configureStave(
  stave: Stave,
  staveIndex: number,
  totalStaves: number,
  opts: {
    timeSignature: string;
    keySignature?: string;
    showAnnotations: boolean;
    etudeMode?: boolean;
  }
): void {
  stave.setBegBarType(BarlineType.SINGLE);
  const isLastStave = staveIndex === totalStaves - 1;
  if (opts.etudeMode) {
    stave.setEndBarType(isLastStave ? BarlineType.END : BarlineType.SINGLE);
  } else {
    stave.setEndBarType(
      !opts.showAnnotations ? BarlineType.NONE : isLastStave ? BarlineType.END : BarlineType.SINGLE
    );
  }
  stave.addClef('treble');
  if (staveIndex === 0 && opts.keySignature) stave.addKeySignature(opts.keySignature);
  if (staveIndex === 0) stave.addTimeSignature(opts.timeSignature);
}

interface NotePair {
  note: StemmableNote;
  noteName: string;
}

function createTrumpetAnnotationHook(
  noteNames: string[],
  notePairs: NotePair[],
  showAnnotations: boolean
): CommitHook {
  let noteIndex = 0;
  return (_options, note, builder) => {
    if (noteIndex >= noteNames.length) {
      noteIndex++;
      return;
    }
    const noteName = noteNames[noteIndex];
    notePairs.push({ note, noteName });
    if (showAnnotations) {
      const factory = builder.getFactory();
      const fingering = getFingering(noteName);
      const noteAnnotation = factory.Annotation({
        text: noteName,
        vJustify: 'bottom',
      });
      const fingeringAnnotation = factory.Annotation({
        text: fingering,
        vJustify: 'bottom',
      });
      note.addModifier(noteAnnotation, 0);
      note.addModifier(fingeringAnnotation, 0);
    }
    noteIndex++;
  };
}

function attachNoteClickHandlers(notePairs: NotePair[]): void {
  for (const { note, noteName } of notePairs) {
    const el = note.getSVGElement?.();
    if (el) {
      el.classList.add('note-clickable');
      el.style.cursor = 'pointer';
      const start = (e: Event) => {
        e.preventDefault();
        startSustainedNote(noteName);
      };
      el.addEventListener('mousedown', start);
      el.addEventListener('touchstart', start, { passive: false });
    }
  }
}

export function renderMusic(
  container: HTMLElement,
  notes: string,
  options: RenderMusicOptions = {}
): void {
  const {
    timeSignature = '4/4',
    noteNames = [],
    totalBeats,
    beamGroups,
    showAnnotations = true,
    keySignature,
    beamIndices,
    measureBoundaries,
  } = options;

  container.innerHTML = '';
  const id = `vexflow-output-${++renderId}`;
  const div = document.createElement('div');
  div.id = id;
  div.dataset.debugBox = 'vexflow-output';
  const beats = totalBeats ?? 4;
  const notesPerBeat = beamGroups ? 2 : 1;
  const totalNotes = noteNames.length || Math.ceil(beats * notesPerBeat) || 8;
  const notesPerStaveEst = beamGroups ? 16 : Math.max(1, Math.round((8 * totalNotes) / beats));
  const estimatedNumStaves =
    measureBoundaries && measureBoundaries.length >= MEASURES_PER_STAVE
      ? Math.ceil(measureBoundaries.length / MEASURES_PER_STAVE)
      : Math.max(1, Math.ceil(totalNotes / notesPerStaveEst));

  // Dynamic width: short exercises get enough room for annotations; long ones (songs) get full width
  const minWidth = showAnnotations ? 720 : 500;
  const maxWidth = showAnnotations ? 1600 : 800;
  const pxPerNote = showAnnotations ? 35 : 20;
  const width = Math.min(maxWidth, Math.max(minWidth, totalNotes * pxPerNote));
  div.style.width = `${width}px`;
  const topPadding = 24;
  const staveHeight = 70;
  const height = topPadding + 40 + estimatedNumStaves * staveHeight;
  div.style.minHeight = `${height}px`;
  container.appendChild(div);

  const vf = new Factory({
    renderer: {
      elementId: id,
      width,
      height,
      backend: Renderer.Backends.SVG,
    },
  });

  const score = vf.EasyScore();
  const notePairs: NotePair[] = [];
  const trumpetHook = createTrumpetAnnotationHook(noteNames, notePairs, showAnnotations);
  score.addCommitHook(trumpetHook);

  const system = vf.System({
    autoWidth: true,
    width,
    y: topPadding,
  });

  let etudeBeams: ReturnType<typeof Beam.generateBeams> = [];

  if (beamGroups && beamGroups > 0 && noteNames.length >= beamGroups) {
    // Etude-style: beam groups of eighth notes using Beam.generateBeams()
    const fullStr = `${noteNames[0]}/8, ${noteNames.slice(1).join(', ')}`;
    const allNotes = score.notes(fullStr, { stem: 'auto' });
    const noteCount = allNotes.length;
    const numStaves = Math.max(1, Math.ceil(noteCount / NOTES_PER_STAVE_ETUDE));

    for (let s = 0; s < numStaves; s++) {
      const start = s * NOTES_PER_STAVE_ETUDE;
      const end = Math.min(start + NOTES_PER_STAVE_ETUDE, noteCount);
      const chunk = allNotes.slice(start, end) as StemmableNote[];
      const chunkNotes = end - start;
      if (chunkNotes === 0) continue;

      const voiceTime = `${chunkNotes}/8`;
      const beatsPerNote = 0.5;
      const notesPerMeasure = BEATS_PER_MEASURE / beatsPerNote;
      const chunkWithBars = insertMeasureBars(chunk, notesPerMeasure, vf);

      const voice = score.voice(chunkWithBars, { time: voiceTime });
      voice.setStrict(false);

      const beams = Beam.generateBeams(chunk, {
        groups: [new Fraction(beamGroups, 8)],
        maintainStemDirections: true,
      });
      etudeBeams.push(...beams);

      const stave = system.addStave({
        voices: [voice],
        options: { spaceAboveStaffLn: 1 },
      });
      configureStave(stave, s, numStaves, {
        timeSignature,
        showAnnotations,
        etudeMode: true,
      });
    }
  } else {
    // Quarter/half-note exercises (scales, held notes, combined custom): parse each stave separately.
    // All voices must have same total ticks (VexFlow requirement) - pad short staves with rests.
    // Use totalBeats to support different note durations (quarter=1 beat, half=2 beats).
    const noteTokens = notes.split(/,\s*/);
    const noteCount = noteTokens.length;
    if (noteCount === 0) {
      vf.draw();
      attachNoteClickHandlers(notePairs);
      return;
    }

    const totalBeatsForLayout = totalBeats ?? noteCount;
    const beatsPerNote = totalBeatsForLayout / noteCount;

    const { starts: chunkStarts, ends: chunkEnds } = computeChunkRanges(
      noteCount,
      beatsPerNote,
      measureBoundaries,
      BEATS_PER_STAVE,
      MEASURES_PER_STAVE
    );
    const numStaves = chunkStarts.length;
    const voiceTime = `${BEATS_PER_STAVE}/4`;

    for (let s = 0; s < numStaves; s++) {
      const start = chunkStarts[s];
      const end = chunkEnds[s];
      const chunkTokens = noteTokens.slice(start, end);
      const chunkNotes = chunkTokens.length;
      if (chunkNotes === 0) continue;

      let chunkStr = chunkTokens.join(', ');
      // Preserve duration of first note (h for held, q for scales)
      const firstNoteMatch = chunkStr.match(/^[A-G][#b]?-?\d+(\/([whq]|8|16|32))?/i);
      const durationCode = firstNoteMatch?.[2] ?? 'q';
      if (s > 0 && !firstNoteMatch?.[1]) {
        chunkStr = chunkStr.replace(/^([A-G][#b]?-?\d+)/, `$1/${durationCode}`);
      }

      const chunkBeats = chunkNotes * beatsPerNote;
      const usedMeasureChunking = !!(measureBoundaries && measureBoundaries.length >= MEASURES_PER_STAVE);
      const restsNeeded = usedMeasureChunking ? 0 : Math.round((BEATS_PER_STAVE - chunkBeats) / 1);
      if (restsNeeded > 0) {
        chunkStr += ', ' + Array(restsNeeded).fill('r/q').join(', ');
      }

      const chunkNoteElements = score.notes(chunkStr, { stem: 'auto' });

      if (beamIndices) {
        for (const group of beamIndices) {
          const localIndices = group
            .filter((i) => i >= start && i < end)
            .map((i) => i - start);
          const groupNotes = localIndices
            .map((i) => chunkNoteElements[i])
            .filter((n): n is NonNullable<typeof n> => n != null);
          if (groupNotes.length > 1) score.beam(groupNotes, { autoStem: true });
        }
      }

      const notesPerMeasureOrBoundaries =
        measureBoundaries
          ? measureBoundaries
              .filter((b) => b >= start && b < end)
              .map((b) => b - start)
          : BEATS_PER_MEASURE / beatsPerNote;
      const chunkWithBars = insertMeasureBars(
        chunkNoteElements,
        notesPerMeasureOrBoundaries,
        vf
      );

      const voice = score.voice(chunkWithBars, { time: voiceTime });
      voice.setStrict(false);

      const stave = system.addStave({
        voices: [voice],
        options: { spaceAboveStaffLn: 1 },
      });
      configureStave(stave, s, numStaves, {
        timeSignature,
        keySignature,
        showAnnotations,
      });
    }
  }

  vf.draw();

  // Align SVG to top when scaled (max-width: 100%); default xMidYMid centers content and adds whitespace above
  const svgEl = div.querySelector('svg');
  if (svgEl) svgEl.setAttribute('preserveAspectRatio', 'xMinYMin meet');

  // Draw beams generated by Beam.generateBeams() (not in Factory renderQ)
  const ctx = vf.getContext();
  for (const beam of etudeBeams) {
    beam.postFormat();
    beam.setContext(ctx).draw();
  }

  attachNoteClickHandlers(notePairs);

  // Fit div height to actual content: bottom of last staff + padding (DOM measurement)
  const svg = div.querySelector('svg');
  const bottomPadding = 60;
  if (svg) {
    const fitHeightToContent = (): void => {
      const divRect = div.getBoundingClientRect();
      let lastStaffBottomY: number | null = null;
      for (const p of svg.querySelectorAll('path')) {
        const bbox = (p as SVGPathElement).getBBox();
        if (bbox.width > 50 && bbox.height < 5) {
          const pathRect = p.getBoundingClientRect();
          const bottom = pathRect.bottom - divRect.top;
          if (lastStaffBottomY === null || bottom > lastStaffBottomY) {
            lastStaffBottomY = bottom;
          }
        }
      }
      if (lastStaffBottomY !== null) {
        const fitHeight = lastStaffBottomY + bottomPadding;
        div.style.height = `${fitHeight}px`;
        div.style.minHeight = `${fitHeight}px`; // Override minHeight so div actually shrinks
        div.style.overflow = 'hidden';
      }
    };
    fitHeightToContent();
    requestAnimationFrame(fitHeightToContent); // Re-measure after layout
  }

  // Debug: horizontal lines - red=expected (VexFlow getY), green=actual (DOM getBoundingClientRect)
  if (typeof location !== 'undefined' && location.hash === '#debug-spacing') {
    div.style.position = 'relative';
    const firstStave = system.getStaves()[0];
    const vexflowY = firstStave ? firstStave.getY() : topPadding;

    // Expected: VexFlow's reported y (in SVG coords)
    const expectedLine = document.createElement('div');
    expectedLine.setAttribute('data-debug', 'first-staff-expected');
    expectedLine.style.cssText = `position:absolute;left:0;right:0;height:2px;background:#e63946;top:${vexflowY}px;pointer-events:none;z-index:10`;
    div.appendChild(expectedLine);

    // Actual: query first staff line in SVG and use its rendered position (getBoundingClientRect)
    const svg = div.querySelector('svg');
    let actualRenderedY: number | null = null;
    if (svg) {
      const paths = svg.querySelectorAll('path');
      for (const p of paths) {
        const bbox = (p as SVGPathElement).getBBox();
        if (bbox.width > 50 && bbox.height < 5) {
          const pathRect = p.getBoundingClientRect();
          const divRect = div.getBoundingClientRect();
          actualRenderedY = pathRect.top - divRect.top;
          break;
        }
      }
      if (actualRenderedY === null && paths.length > 0) {
        const pathRect = paths[0].getBoundingClientRect();
        const divRect = div.getBoundingClientRect();
        actualRenderedY = pathRect.top - divRect.top;
      }
    }
    if (actualRenderedY !== null) {
      const actualLine = document.createElement('div');
      actualLine.setAttribute('data-debug', 'first-staff-actual');
      actualLine.style.cssText = `position:absolute;left:0;right:0;height:2px;background:#2a9d8f;top:${actualRenderedY}px;pointer-events:none;z-index:10`;
      div.appendChild(actualLine);
    }

    // Red line at bottom of last staff
    if (svg) {
      const divRect = div.getBoundingClientRect();
      let lastStaffBottomY: number | null = null;
      const paths = svg.querySelectorAll('path');
      for (const p of paths) {
        const bbox = (p as SVGPathElement).getBBox();
        if (bbox.width > 50 && bbox.height < 5) {
          const pathRect = p.getBoundingClientRect();
          const bottom = pathRect.bottom - divRect.top;
          if (lastStaffBottomY === null || bottom > lastStaffBottomY) {
            lastStaffBottomY = bottom;
          }
        }
      }
      if (lastStaffBottomY !== null) {
        const lastStaffLine = document.createElement('div');
        lastStaffLine.setAttribute('data-debug', 'last-staff-bottom');
        lastStaffLine.style.cssText = `position:absolute;left:0;right:0;height:2px;background:#e63946;top:${lastStaffBottomY}px;pointer-events:none;z-index:10`;
        div.appendChild(lastStaffLine);
      }
    }
  }
}

import { Factory, Renderer, BarlineType } from 'vexflow';
import type { CommitHook } from 'vexflow';
import type { StemmableNote } from 'vexflow';
import { getFingering } from '../data/trumpetFingering';
import { startSustainedNote } from '../audio/trumpetSound';

const BEATS_PER_MEASURE = 4; // 4/4 time

let renderId = 0;

/** Insert BarNote at measure boundaries within a chunk of notes. */
function insertMeasureBars<T>(
  chunk: T[],
  notesPerMeasure: number,
  vf: InstanceType<typeof Factory>
): (T | ReturnType<InstanceType<typeof Factory>['BarNote']>)[] {
  if (notesPerMeasure < 1 || chunk.length === 0) return [...chunk];
  const result: (T | ReturnType<InstanceType<typeof Factory>['BarNote']>)[] = [];
  for (let i = 0; i < chunk.length; i++) {
    if (i > 0 && i % notesPerMeasure === 0) {
      result.push(vf.BarNote({ type: BarlineType.SINGLE }));
    }
    result.push(chunk[i]);
  }
  return result;
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

export function renderMusic(
  container: HTMLElement,
  notes: string,
  timeSignature = '4/4',
  noteNames: string[] = [],
  totalBeats?: number,
  beamGroups?: number,
  showAnnotations = true
): void {
  container.innerHTML = '';
  const id = `vexflow-output-${++renderId}`;
  const div = document.createElement('div');
  div.id = id;
  const beats = totalBeats ?? 4;
  const notesPerBeat = beamGroups ? 2 : 1;
  const totalNotes = noteNames.length || Math.ceil(beats * notesPerBeat) || 8;
  const notesPerStaveEst = beamGroups ? 16 : Math.max(1, Math.round((8 * totalNotes) / beats));
  const estimatedNumStaves = Math.max(1, Math.ceil(totalNotes / notesPerStaveEst));

  const renderWidth = beats > 8 ? 1000 : !showAnnotations ? 800 : 600;
  div.style.width = `${renderWidth}px`;
  const staveHeight = 100;
  const height = 80 + estimatedNumStaves * staveHeight;
  div.style.minHeight = `${height}px`;
  container.appendChild(div);

  const width = beats > 8 ? 1000 : !showAnnotations ? 800 : 600;
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

  const BEATS_PER_STAVE = 8;

  const system = vf.System({
    autoWidth: true,
    width,
  });

  if (beamGroups && beamGroups > 0 && noteNames.length >= beamGroups) {
    // Etude-style: beam groups of eighth notes
    const notesPerStave = BEATS_PER_STAVE * 2;
    const allNotes: ReturnType<typeof score.notes> = [];
    for (let i = 0; i < noteNames.length; i += beamGroups) {
      const group = noteNames.slice(i, i + beamGroups);
      const groupStr = `${group[0]}/8, ${group.slice(1).join(', ')}`;
      const groupNotes = score.notes(groupStr, { stem: 'up' });
      score.beam(groupNotes);
      allNotes.push(...groupNotes);
    }
    const noteCount = allNotes.length;
    const numStaves = Math.max(1, Math.ceil(noteCount / notesPerStave));

    for (let s = 0; s < numStaves; s++) {
      const start = s * notesPerStave;
      const end = Math.min(start + notesPerStave, noteCount);
      const chunk = allNotes.slice(start, end);
      const chunkNotes = end - start;
      if (chunkNotes === 0) continue;

      const voiceTime = `${chunkNotes}/8`;
      const beatsPerNote = 0.5;
      const notesPerMeasure = BEATS_PER_MEASURE / beatsPerNote;
      const chunkWithBars = insertMeasureBars(chunk, notesPerMeasure, vf);

      const voice = score.voice(chunkWithBars, { time: voiceTime });
      voice.setStrict(false);

      const stave = system.addStave({ voices: [voice] });
      stave.setBegBarType(BarlineType.SINGLE);
      stave.setEndBarType(s === numStaves - 1 ? BarlineType.END : BarlineType.SINGLE);
      stave.addClef('treble');
      if (s === 0) stave.addTimeSignature(timeSignature);
    }
  } else {
    // Quarter/half-note exercises (scales, held notes, combined custom): parse each stave separately.
    // All voices must have same total ticks (VexFlow requirement) - pad short staves with rests.
    // Use totalBeats to support different note durations (quarter=1 beat, half=2 beats).
    const noteTokens = notes.split(/,\s*/);
    const noteCount = noteTokens.length;
    if (noteCount === 0) {
      vf.draw();
      return;
    }

    const totalBeatsForLayout = totalBeats ?? noteCount;
    const beatsPerNote = totalBeatsForLayout / noteCount;
    const beatsPerStave = !showAnnotations ? totalBeatsForLayout : 16;
    const notesPerStave = Math.min(
      noteCount,
      Math.max(1, Math.floor(beatsPerStave / beatsPerNote))
    );
    const numStaves = Math.max(1, Math.ceil(noteCount / notesPerStave));
    const voiceTime = `${beatsPerStave}/4`; // Same duration for all voices

    for (let s = 0; s < numStaves; s++) {
      const start = s * notesPerStave;
      const end = Math.min(start + notesPerStave, noteCount);
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
      const restsNeeded = Math.round((beatsPerStave - chunkBeats) / 1); // pad with quarter rests
      if (restsNeeded > 0) {
        chunkStr += ', ' + Array(restsNeeded).fill('r/q').join(', ');
      }

      const chunkNoteElements = score.notes(chunkStr, { stem: 'up' });
      const notesPerMeasure = BEATS_PER_MEASURE / beatsPerNote;
      const chunkWithBars = insertMeasureBars(chunkNoteElements, notesPerMeasure, vf);

      const voice = score.voice(chunkWithBars, { time: voiceTime });
      voice.setStrict(false);

      const stave = system.addStave({ voices: [voice] });
      stave.setBegBarType(BarlineType.SINGLE);
      stave.setEndBarType(
        !showAnnotations ? BarlineType.NONE : s === numStaves - 1 ? BarlineType.END : BarlineType.SINGLE
      );
      stave.addClef('treble');
      if (s === 0) stave.addTimeSignature(timeSignature);
    }
  }

  vf.draw();

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

/**
 * Playlist data for the cassette player.
 *
 * Add real audio files to /public/audio/ and update `src` paths.
 * The player handles missing/errored sources gracefully ("no signal" state).
 */

export interface Track {
  id: string;
  title: string;
  /** Shown below the title — artist, album, session label, etc. */
  description?: string;
  /** Path relative to /public */
  src: string;
  /** Label printed on the cassette window */
  tapeLabel?: string;
}

export const playlist: Track[] = [
  {
    id: "track-01",
    title: "Signal and Noise",
    description: "Ambient · Lab Sessions Vol. 1",
    src: "/audio/signal-and-noise.mp3",
    tapeLabel: "SIDE A",
  },
  {
    id: "track-02",
    title: "Late Static",
    description: "Lo-fi · Lab Sessions Vol. 1",
    src: "/audio/late-static.mp3",
    tapeLabel: "SIDE A",
  },
  {
    id: "track-03",
    title: "Frequency Drift",
    description: "Ambient · Lab Sessions Vol. 2",
    src: "/audio/frequency-drift.mp3",
    tapeLabel: "SIDE B",
  },
  {
    id: "track-04",
    title: "Deep Reference",
    description: "Instrumental · Lab Sessions Vol. 2",
    src: "/audio/deep-reference.mp3",
    tapeLabel: "SIDE B",
  },
  {
    id: "track-05",
    title: "Version Zero",
    description: "Experimental · Lab Sessions Vol. 3",
    src: "/audio/version-zero.mp3",
    tapeLabel: "SIDE B",
  },
];

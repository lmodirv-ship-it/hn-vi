/**
 * Text-to-Speech service using the free Web Speech API.
 * Generates audio blobs for each scene to be mixed into the final video.
 */

export interface TTSConfig {
  enabled: boolean;
  lang: string;
  rate: number;      // 0.5 – 2
  pitch: number;     // 0 – 2
  voiceURI?: string; // selected voice identifier
}

export const DEFAULT_TTS_CONFIG: TTSConfig = {
  enabled: false,
  lang: "ar-SA",
  rate: 1,
  pitch: 1,
};

/** Get available voices, filtered optionally by language prefix */
export function getAvailableVoices(langPrefix?: string): SpeechSynthesisVoice[] {
  const voices = speechSynthesis.getVoices();
  if (!langPrefix) return voices;
  return voices.filter((v) => v.lang.startsWith(langPrefix));
}

/** Wait for voices to load (they load async in some browsers) */
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    speechSynthesis.addEventListener("voiceschanged", () => {
      resolve(speechSynthesis.getVoices());
    }, { once: true });
    // Fallback timeout
    setTimeout(() => resolve(speechSynthesis.getVoices()), 2000);
  });
}

/** Preview TTS for a given text */
export function previewTTS(text: string, config: TTSConfig): void {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = config.lang;
  utterance.rate = config.rate;
  utterance.pitch = config.pitch;

  if (config.voiceURI) {
    const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === config.voiceURI);
    if (voice) utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
}

/** Stop any ongoing TTS preview */
export function stopTTS(): void {
  speechSynthesis.cancel();
}

/**
 * Synthesize speech to an AudioBuffer using MediaStreamDestination.
 * This captures Web Speech API output as recordable audio.
 */
export async function synthesizeToAudioBuffer(
  text: string,
  config: TTSConfig
): Promise<AudioBuffer | null> {
  return new Promise((resolve) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config.lang;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;

      if (config.voiceURI) {
        const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === config.voiceURI);
        if (voice) utterance.voice = voice;
      }

      // Web Speech API doesn't directly give us audio buffers,
      // so we use a workaround with MediaRecorder if available
      const audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      const recorder = new MediaRecorder(dest.stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        if (chunks.length === 0) {
          resolve(null);
          return;
        }
        const blob = new Blob(chunks, { type: "audio/webm" });
        const arrayBuf = await blob.arrayBuffer();
        try {
          const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
          resolve(audioBuf);
        } catch {
          resolve(null);
        }
      };

      utterance.onstart = () => recorder.start();
      utterance.onend = () => {
        setTimeout(() => recorder.stop(), 100);
      };
      utterance.onerror = () => resolve(null);

      speechSynthesis.speak(utterance);

      // Safety timeout
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 30000);
    } catch {
      resolve(null);
    }
  });
}

/** Check if Web Speech API is supported */
export function isTTSSupported(): boolean {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

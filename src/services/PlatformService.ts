/**
 * Platform detection and cross-platform utilities.
 * Works in Web, PWA, Capacitor (mobile), and Electron contexts.
 */

export type PlatformType = "web" | "pwa" | "capacitor" | "electron";

class PlatformService {
  getPlatform(): PlatformType {
    // Check Electron
    if (typeof window !== "undefined" && (window as any).electronAPI) {
      return "electron";
    }
    // Check Capacitor
    if (typeof window !== "undefined" && (window as any).Capacitor?.isNativePlatform?.()) {
      return "capacitor";
    }
    // Check PWA (standalone mode)
    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      return "pwa";
    }
    return "web";
  }

  isNative(): boolean {
    return this.getPlatform() === "capacitor";
  }

  isPWA(): boolean {
    return this.getPlatform() === "pwa";
  }

  isElectron(): boolean {
    return this.getPlatform() === "electron";
  }

  isWeb(): boolean {
    return this.getPlatform() === "web";
  }

  /**
   * Save/download a file. Works across all platforms.
   */
  async saveFile(fileName: string, data: Blob): Promise<void> {
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Share content using Web Share API (works in PWA and mobile browsers).
   */
  async share(title: string, text: string, url?: string): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch {
        return false;
      }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url || text);
      return true;
    } catch {
      return false;
    }
  }
}

export const platformService = new PlatformService();

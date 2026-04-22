// Google Analytics 4 helper. Replace G-XXXXXXXXXX in index.html with your real Measurement ID.
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch (e) {
    // silently ignore
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title ?? document.title,
      page_location: window.location.href,
    });
  } catch (e) {
    // silently ignore
  }
}

export const ANALYTICS_EVENTS = {
  SIGN_UP: "sign_up",
  LOGIN: "login",
  PROJECT_CREATE: "project_create",
  SCENE_ADD: "scene_add",
  EXPORT_START: "export_start",
  EXPORT_COMPLETE: "export_complete",
  EXPORT_FAILED: "export_failed",
  TEMPLATE_USE: "template_use",
} as const;
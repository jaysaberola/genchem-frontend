import { sendContactMessage } from "@/services/publicPageService";
import { toast } from "@/lib/toast";
import { getWebsiteSettingsCached } from "@/lib/websiteSettings";

const CONTACT_FIELD_IDS = ["name", "company", "email", "contact", "message"] as const;

type ContactFieldId = (typeof CONTACT_FIELD_IDS)[number];

type RecaptchaVersion = "v2" | "v3";

declare global {
  interface Window {
    gcSubmitContact?: (event?: Event) => void;
    grecaptcha?: {
      render: (container: HTMLElement, parameters: { sitekey: string }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    genchemRecaptchaOnload?: () => void;
  }
}

const RECAPTCHA_SCRIPT_ID = "genchem-recaptcha-api";
let recaptchaScriptPromise: Promise<void> | null = null;
let recaptchaWidgetId: number | null = null;
let recaptchaSiteKey: string | null = null;
let recaptchaVersion: RecaptchaVersion = "v2";
let recaptchaV3ScriptKey: string | null = null;

function fieldValue(root: ParentNode, id: ContactFieldId): string {
  const byId = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${CSS.escape(id)}`);
  if (byId?.value.trim()) return byId.value.trim();

  const byName = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${CSS.escape(id)}"]`,
  );
  return byName?.value.trim() ?? "";
}

function clearFields(root: ParentNode, ids: readonly ContactFieldId[]): void {
  ids.forEach((id) => {
    const el =
      root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${CSS.escape(id)}`) ??
      root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${CSS.escape(id)}"]`);
    if (el) el.value = "";
  });
}

function findFormScope(root: ParentNode): ParentNode {
  return (
    root.querySelector(".bg-white") ??
    root.querySelector(".public-page-content") ??
    root.querySelector(".cms-content") ??
    root
  );
}

function findSubmitControl(root: ParentNode): HTMLElement | null {
  const scope = findFormScope(root);

  return (
    scope.querySelector<HTMLElement>("#genchem-contact-submit") ??
    Array.from(scope.querySelectorAll<HTMLElement>("a, button")).find((el) =>
      /^\s*submit\s*$/i.test(el.textContent ?? ""),
    ) ??
    null
  );
}

function ensureSubmitButton(submitControl: HTMLElement): HTMLButtonElement {
  if (submitControl instanceof HTMLButtonElement) {
    if (!submitControl.id) submitControl.id = "genchem-contact-submit";
    submitControl.type = "button";
    return submitControl;
  }

  const className = submitControl.getAttribute("class") ?? "";
  const button = document.createElement("button");
  button.type = "button";
  button.id = "genchem-contact-submit";
  button.className = className;
  button.style.borderRadius = "50px";
  button.textContent = submitControl.textContent?.trim() || "Submit";
  submitControl.replaceWith(button);
  return button;
}

function ensureStatusHost(scope: ParentNode, submitControl: HTMLElement): HTMLElement {
  let host = scope.querySelector<HTMLElement>("#genchem-contact-status");
  if (host) return host;

  host = document.createElement("div");
  host.id = "genchem-contact-status";
  host.setAttribute("role", "alert");
  host.setAttribute("aria-live", "polite");
  host.className = "genchem-contact-status";
  host.hidden = true;

  const anchor = submitControl.closest(".text-center") ?? submitControl.parentElement;
  if (anchor) {
    anchor.insertAdjacentElement("afterend", host);
  } else {
    submitControl.insertAdjacentElement("afterend", host);
  }

  return host;
}

function showInlineStatus(host: HTMLElement, message: string, type: "success" | "error"): void {
  host.textContent = message;
  host.className = `genchem-contact-status genchem-contact-status--${type}`;
  host.hidden = false;
}

function hideInlineStatus(host: HTMLElement): void {
  host.hidden = true;
  host.textContent = "";
}

function isContactPage(root: ParentNode): boolean {
  if (root.querySelector("#name, [name='name'], #email, [name='email']")) return true;
  return /send us a message/i.test(root.textContent ?? "");
}

function parseRecaptchaVersion(raw: unknown): RecaptchaVersion {
  const value = String(raw ?? "v2")
    .trim()
    .toLowerCase();
  return value === "v3" || value === "3" || value === "score" ? "v3" : "v2";
}

function loadRecaptchaScriptV2(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.render) return Promise.resolve();

  if (recaptchaScriptPromise) return recaptchaScriptPromise;

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existing) {
      if (window.grecaptcha?.render) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("reCAPTCHA failed to load")), {
        once: true,
      });
      return;
    }

    window.genchemRecaptchaOnload = () => resolve();

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src =
      "https://www.google.com/recaptcha/api.js?onload=genchemRecaptchaOnload&render=explicit";
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

function loadRecaptchaScriptV3(siteKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.execute && recaptchaV3ScriptKey === siteKey) {
    return Promise.resolve();
  }

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const scriptUrl = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);
    if (existing) {
      window.grecaptcha?.ready(() => resolve());
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      recaptchaV3ScriptKey = siteKey;
      window.grecaptcha?.ready(() => resolve());
    };
    script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

function findRecaptchaMount(scope: ParentNode, submitControl: HTMLElement): HTMLElement {
  const existing =
    scope.querySelector<HTMLElement>(".g-recaptcha") ??
    scope.querySelector<HTMLElement>("#genchem-recaptcha");
  if (existing) return existing;

  const host = document.createElement("div");
  host.id = "genchem-recaptcha";
  host.className = "g-recaptcha my-3";

  const anchor =
    submitControl.closest(".text-center") ??
    submitControl.parentElement ??
    (scope instanceof Element ? scope : null);
  if (anchor instanceof Element) {
    anchor.insertAdjacentElement("beforebegin", host);
  } else {
    submitControl.insertAdjacentElement("beforebegin", host);
  }
  return host;
}

async function ensureRecaptcha(root: ParentNode, submitControl: HTMLElement): Promise<boolean> {
  try {
    const settings = await getWebsiteSettingsCached({ force: true });
    const siteKey = (settings.google_recaptcha_sitekey as string | undefined)?.trim() ?? "";
    if (!siteKey) return true;

    recaptchaSiteKey = siteKey;
    recaptchaVersion = parseRecaptchaVersion(settings.google_recaptcha_version);

    if (recaptchaVersion === "v3") {
      await loadRecaptchaScriptV3(siteKey);
      return true;
    }

    await loadRecaptchaScriptV2();

    const scope = findFormScope(root);
    const mount = findRecaptchaMount(scope, submitControl);

    if (recaptchaWidgetId === null && window.grecaptcha?.render) {
      mount.innerHTML = "";
      mount.removeAttribute("data-sitekey");
      recaptchaWidgetId = window.grecaptcha.render(mount, { sitekey: siteKey });
    }

    return true;
  } catch {
    return false;
  }
}

async function getRecaptchaResponse(): Promise<string> {
  if (!recaptchaSiteKey || !window.grecaptcha) return "";

  if (recaptchaVersion === "v3") {
    try {
      await loadRecaptchaScriptV3(recaptchaSiteKey);
      return (await window.grecaptcha.execute(recaptchaSiteKey, { action: "contact" })).trim();
    } catch {
      return "";
    }
  }

  if (recaptchaWidgetId === null) return "";
  return window.grecaptcha.getResponse(recaptchaWidgetId)?.trim() ?? "";
}

function resetRecaptcha(): void {
  if (recaptchaWidgetId !== null && window.grecaptcha) {
    window.grecaptcha.reset(recaptchaWidgetId);
  }
}

function formatContactSubmitError(err: unknown): string {
  const response = (err as { response?: { data?: Record<string, unknown>; status?: number } })
    ?.response;
  const data = response?.data;
  if (data && typeof data === "object") {
    const errors = data.errors as Record<string, string[] | string> | undefined;
    if (errors) {
      const captcha = errors["g-recaptcha-response"];
      if (captcha) {
        return Array.isArray(captcha) ? captcha[0] : captcha;
      }
      const first = Object.values(errors)[0];
      if (first) return Array.isArray(first) ? first[0] : first;
    }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }
  return "Failed to send your message. Please try again later.";
}

export function patchContactUsForm(html: string): string {
  if (!html.includes('id="name"') && !html.includes("id='name'") && !/send us a message/i.test(html)) {
    return html;
  }

  let output = html;

  output = output.replace(
    /<script\b[^>]*\bsrc=["'][^"']*recaptcha\/api\.js[^"']*["'][^>]*>\s*<\/script>/gi,
    "",
  );
  output = output.replace(
    /<div\b[^>]*\bg-recaptcha\b[^>]*>[\s\S]*?<\/div>/gi,
    '<div id="genchem-recaptcha" class="g-recaptcha my-3"></div>',
  );

  output = output.replace(
    /<a\b([^>]*?)href=["'](?:#|javascript:void\(0\)|javascript:;)["']([^>]*?)>\s*submit\s*<\/a>/gi,
    (_match, before: string, after: string) => {
      const attrs = `${before}${after}`;
      if (/id=["']genchem-contact-submit["']/i.test(attrs)) return _match;
      const classMatch = attrs.match(/\bclass=(["'])([\s\S]*?)\1/i);
      const className =
        classMatch?.[2] ??
        "text-uppercase text-white bg-dark-red fw-semibold text-shadow shadow py-2 px-4 fs-5";
      return `<button type="button" id="genchem-contact-submit" class="${className}" style="border-radius: 50px;">submit</button>`;
    },
  );

  output = output.replace(
    /<button\b((?![^>]*\bid=["']genchem-contact-submit["'])[^>]*?)>\s*submit\s*<\/button>/gi,
    (_match, attrs: string) => {
      const classMatch = attrs.match(/\bclass=(["'])([\s\S]*?)\1/i);
      const className =
        classMatch?.[2] ??
        "text-uppercase text-white bg-dark-red fw-semibold text-shadow shadow py-2 px-4 fs-5";
      return `<button type="button" id="genchem-contact-submit" class="${className}" style="border-radius: 50px;">submit</button>`;
    },
  );

  return output;
}

async function submitContactForm(root: ParentNode): Promise<void> {
  const submitControl = findSubmitControl(root);
  if (!submitControl) return;

  const button = ensureSubmitButton(submitControl);
  if (button.dataset.genchemSending === "1") return;

  const scope = findFormScope(root);
  const statusHost = ensureStatusHost(scope, button);

  const name = fieldValue(root, "name");
  const company = fieldValue(root, "company");
  const email = fieldValue(root, "email");
  const contact = fieldValue(root, "contact");
  const message = fieldValue(root, "message");

  if (!name || !email || !contact || !message) {
    const msg = "Please fill in all required fields.";
    toast.error(msg);
    showInlineStatus(statusHost, msg, "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const msg = "Please enter a valid email address.";
    toast.error(msg);
    showInlineStatus(statusHost, msg, "error");
    return;
  }

  if (!recaptchaSiteKey || (recaptchaVersion === "v2" && recaptchaWidgetId === null)) {
    const recaptchaReady = await ensureRecaptcha(root, button);
    if (!recaptchaReady) {
      const msg = "Unable to load the security check. Please refresh and try again.";
      toast.error(msg);
      showInlineStatus(statusHost, msg, "error");
      return;
    }
  }

  const recaptchaResponse = recaptchaSiteKey ? await getRecaptchaResponse() : "";
  if (recaptchaSiteKey && !recaptchaResponse) {
    const msg =
      recaptchaVersion === "v2"
        ? "Please check the captcha box, then submit again right away."
        : "Please complete the captcha.";
    toast.error(msg);
    showInlineStatus(statusHost, msg, "error");
    return;
  }

  button.dataset.genchemSending = "1";
  button.classList.add("is-loading");
  button.disabled = true;
  hideInlineStatus(statusHost);

  try {
    const res = await sendContactMessage({
      name,
      company,
      email,
      contact,
      message,
      ...(recaptchaResponse ? { "g-recaptcha-response": recaptchaResponse } : {}),
    });
    const msg = res.data?.message ?? "Your message has been sent successfully.";
    toast.success(msg);
    showInlineStatus(statusHost, msg, "success");
    clearFields(root, CONTACT_FIELD_IDS);
    resetRecaptcha();
  } catch (err: unknown) {
    const msg = formatContactSubmitError(err);
    toast.error(msg);
    showInlineStatus(statusHost, msg, "error");
    resetRecaptcha();
  } finally {
    delete button.dataset.genchemSending;
    button.classList.remove("is-loading");
    button.disabled = false;
  }
}

function bindContactForm(root: ParentNode): (() => void) | null {
  if (!isContactPage(root)) return null;

  const submitControl = findSubmitControl(root);
  if (!submitControl) return null;

  const button = ensureSubmitButton(submitControl);
  if (button.dataset.genchemContactBound === "1") return null;
  button.dataset.genchemContactBound = "1";

  const onSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    void submitContactForm(root);
  };

  button.addEventListener("click", onSubmit);
  void ensureRecaptcha(root, button);

  return () => {
    button.removeEventListener("click", onSubmit);
    delete button.dataset.genchemContactBound;
  };
}

function bindAllContactForms(): void {
  document.querySelectorAll(".genchem-contact-us-page").forEach((root) => {
    bindContactForm(root);
  });
}

let runtimeCleanup: (() => void) | null = null;

export function initGenchemContactForm(): () => void {
  if (typeof document === "undefined") return () => {};

  window.gcSubmitContact = (event?: Event) => {
    event?.preventDefault();
    const root = document.querySelector(".genchem-contact-us-page");
    if (root) void submitContactForm(root);
  };

  bindAllContactForms();

  if (runtimeCleanup) return runtimeCleanup;

  const timers = [50, 300, 1000].map((delay) => window.setTimeout(bindAllContactForms, delay));
  const observer = new MutationObserver(bindAllContactForms);
  observer.observe(document.body, { childList: true, subtree: true });

  runtimeCleanup = () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    observer.disconnect();
    delete window.gcSubmitContact;
    runtimeCleanup = null;
  };

  return runtimeCleanup;
}

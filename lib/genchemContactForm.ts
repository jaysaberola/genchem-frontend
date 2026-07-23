import { sendContactMessage } from "@/services/publicPageService";
import { toast } from "@/lib/toast";

const CONTACT_FIELD_IDS = ["name", "company", "email", "contact", "message"] as const;

type ContactFieldId = (typeof CONTACT_FIELD_IDS)[number];

declare global {
  interface Window {
    gcSubmitContact?: (event?: Event) => void;
  }
}

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

export function patchContactUsForm(html: string): string {
  if (!html.includes('id="name"') && !html.includes("id='name'") && !/send us a message/i.test(html)) {
    return html;
  }

  let output = html;

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

  button.dataset.genchemSending = "1";
  button.classList.add("is-loading");
  button.disabled = true;
  hideInlineStatus(statusHost);

  try {
    const res = await sendContactMessage({ name, company, email, contact, message });
    const msg = res.data?.message ?? "Your message has been sent successfully.";
    toast.success(msg);
    showInlineStatus(statusHost, msg, "success");
    clearFields(root, CONTACT_FIELD_IDS);
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Failed to send your message. Please try again later.";
    toast.error(msg);
    showInlineStatus(statusHost, msg, "error");
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

import { sendContactMessage } from "@/services/publicPageService";
import { toast } from "@/lib/toast";

function fieldValue(root: ParentNode, id: string): string {
  const el = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${CSS.escape(id)}`);
  return el?.value.trim() ?? "";
}

function clearFields(root: ParentNode, ids: string[]): void {
  ids.forEach((id) => {
    const el = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${CSS.escape(id)}`);
    if (el) el.value = "";
  });
}

function findSubmitControl(root: ParentNode): HTMLElement | null {
  return (
    root.querySelector<HTMLElement>("#genchem-contact-submit") ??
    root.querySelector<HTMLElement>(".bg-white a[href='#']") ??
    root.querySelector<HTMLElement>(".bg-white a[href='']") ??
    Array.from(root.querySelectorAll<HTMLElement>(".bg-white a, .bg-white button")).find((el) =>
      /submit/i.test(el.textContent ?? ""),
    ) ??
    null
  );
}

export function patchContactUsForm(html: string): string {
  if (!html.includes('id="name"') && !html.includes("SEND US A MESSAGE")) return html;

  return html.replace(
    /<a\s+([^>]*?)href=["']#["']([^>]*?)>\s*submit\s*<\/a>/gi,
    (_match, before: string, after: string) => {
      const attrs = `${before}${after}`;
      if (/id=["']genchem-contact-submit["']/i.test(attrs)) return _match;
      const classMatch = attrs.match(/\bclass=(["'])([\s\S]*?)\1/i);
      const className = classMatch?.[2] ?? "text-uppercase text-white bg-dark-red fw-semibold text-shadow shadow py-2 px-4 fs-5";
      return `<button type="button" id="genchem-contact-submit" class="${className}" style="border-radius: 50px;">submit</button>`;
    },
  );
}

export function initGenchemContactForm(): () => void {
  if (typeof document === "undefined") return () => {};

  const root = document.querySelector(".genchem-contact-us-page");
  if (!root) return () => {};

  const submitControl = findSubmitControl(root);
  if (!submitControl) return () => {};

  let sending = false;

  const onSubmit = async (event: Event) => {
    event.preventDefault();

    if (sending) return;

    const name = fieldValue(root, "name");
    const company = fieldValue(root, "company");
    const email = fieldValue(root, "email");
    const contact = fieldValue(root, "contact");
    const message = fieldValue(root, "message");

    if (!name || !email || !contact || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    sending = true;
    submitControl.classList.add("is-loading");
    if (submitControl instanceof HTMLButtonElement) {
      submitControl.disabled = true;
    }

    try {
      const res = await sendContactMessage({ name, company, email, contact, message });
      toast.success(res.data?.message ?? "Your message has been sent successfully.");
      clearFields(root, ["name", "company", "email", "contact", "message"]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to send your message. Please try again later.";
      toast.error(msg);
    } finally {
      sending = false;
      submitControl.classList.remove("is-loading");
      if (submitControl instanceof HTMLButtonElement) {
        submitControl.disabled = false;
      }
    }
  };

  submitControl.addEventListener("click", onSubmit);
  return () => submitControl.removeEventListener("click", onSubmit);
}

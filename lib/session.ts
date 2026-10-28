/*
 * Demo sign-in state. There is no auth backend yet: verifying the OTP stores the session in
 * localStorage and the account pages read it through useSyncExternalStore (null on the server).
 */

export type Session = {
  /** National number without the leading 0, e.g. "551234567". */
  phone: string;
  dialCode: string;
  /** Set by "حساب جديد" or Account settings; otherwise the demo customer's name is used. */
  name?: string;
  /** Created via "حساب جديد": no demo history, addresses or points. */
  isNew?: boolean;
};

const STORAGE_KEY = "sufra-session-v1";
let session: Session | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Session>) : null;
    session =
      parsed && typeof parsed.phone === "string" && typeof parsed.dialCode === "string"
        ? {
            phone: parsed.phone,
            dialCode: parsed.dialCode,
            name: typeof parsed.name === "string" ? parsed.name : undefined,
            isNew: parsed.isNew === true,
          }
        : null;
  } catch {
    session = null;
  }
}

function commit(next: Session | null) {
  session = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the session lasts for this visit only.
  }
  listeners.forEach((l) => l());
}

export const sessionStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      loaded = false;
      load();
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot() {
    load();
    return session;
  },
  getServerSnapshot(): Session | null {
    return null;
  },
  signIn(next: Session) {
    commit(next);
  },
  signOut() {
    commit(null);
  },
};

/** "0551234567" for Saudi numbers, "+971 501234567" otherwise. */
export function displayPhone(s: Pick<Session, "phone" | "dialCode">) {
  return s.dialCode === "+966" ? `0${s.phone}` : `${s.dialCode} ${s.phone}`;
}

"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { bankQuoteForm } from "@/content/forms";
import { Dialog } from "@/components/ui/Dialog";
import { ToastProvider } from "@/components/ui/Toast";
import { BankQuoteForm } from "@/components/forms/BankQuoteForm";

type UiState = {
  bankQuoteOpen: boolean;
  openBankQuote: () => void;
  closeBankQuote: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const UiContext = createContext<UiState | null>(null);

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside <UiProvider>");
  return ctx;
}

/** Page-level UI state: the bank-quote dialog, the mobile menu and toasts. */
export function UiProvider({ children }: { children: ReactNode }) {
  const [bankQuoteOpen, setBankQuoteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const submitted = useRef(false);

  const openBankQuote = useCallback(() => {
    setMenuOpen(false);
    setBankQuoteOpen(true);
  }, []);

  const closeBankQuote = useCallback(() => {
    setBankQuoteOpen(false);
    // Keep a half-filled draft, but start fresh after a completed demo send.
    if (submitted.current) {
      submitted.current = false;
      setFormKey((key) => key + 1);
    }
  }, []);

  const value = useMemo(
    () => ({ bankQuoteOpen, openBankQuote, closeBankQuote, menuOpen, setMenuOpen }),
    [bankQuoteOpen, openBankQuote, closeBankQuote, menuOpen],
  );

  return (
    <ToastProvider>
      <UiContext.Provider value={value}>
        {children}
        <Dialog
          open={bankQuoteOpen}
          onClose={closeBankQuote}
          title={bankQuoteForm.title}
          description={bankQuoteForm.intro}
          closeLabel={bankQuoteForm.close}
        >
          <BankQuoteForm
            key={formKey}
            idPrefix="bq"
            onClose={closeBankQuote}
            onSubmitted={() => {
              submitted.current = true;
            }}
          />
        </Dialog>
      </UiContext.Provider>
    </ToastProvider>
  );
}

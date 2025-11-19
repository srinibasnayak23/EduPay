import React, { createContext, useCallback, useState } from "react";

export const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({ open: false, message: "", resolve: null });

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({ open: true, message, resolve });
    });
  }, []);

  const handleClose = (result) => {
    if (confirmState.resolve) confirmState.resolve(result);
    setConfirmState({ open: false, message: "", resolve: null });
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="bg-white rounded-lg p-6 z-10 max-w-sm mx-4">
            <p className="text-slate-800 mb-4">{confirmState.message}</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200"
                onClick={() => handleClose(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleClose(true)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;

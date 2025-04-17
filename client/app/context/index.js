"use client"
import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppWrapper({ children }) {
    const [id, setId] = useState('');
    const [uid, setUid] = useState('');

    return (
        <AppContext.Provider value={{ id, setId, uid, setUid }}>
        {children}
        </AppContext.Provider>
    );
    }

export function useAppContext() {
    return useContext(AppContext);
}

"use client"
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppWrapper({ children }) {
    const [id, setId] = useState(null);
    const [uid, setUid] = useState(null);
    const [data, setData] = useState([])
    const [value, setValue] = useState('');


    useEffect(() => {
        const storedId = localStorage.getItem('id');
        const storedUid = localStorage.getItem('uid');
        const storedData = localStorage.getItem('data');
        const storedValue = localStorage.getItem('value');
        if (storedId) setId(Number(storedId));
        if (storedUid) setUid(storedUid);
        if (storedValue) setValue(storedValue);
        if (storedData) setValue(storedData)
    }, []);

    useEffect(() => {
        localStorage.setItem('id', id);
        localStorage.setItem('uid', uid);
        localStorage.setItem('data', data);
        localStorage.setItem('value', value);
    }, [id, uid, data, value]);

    return (
        <AppContext.Provider value={{ id, setId, uid, setUid, data, setData, value, setValue }}>
            {children}
        </AppContext.Provider>
    );
    }

export function useAppContext() {
    return useContext(AppContext);
}

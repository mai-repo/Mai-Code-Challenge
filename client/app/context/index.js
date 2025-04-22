"use client"
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppWrapper({ children }) {
    const [id, setId] = useState(null);
    const [uid, setUid] = useState(null);
    const [data, setData] = useState([])
    const [value, setValue] = useState('');
    const [challenge, setChallenge] = useState('')


    useEffect(() => {
        const storedId = localStorage.getItem('id');
        const storedUid = localStorage.getItem('uid');
        const storedData = localStorage.getItem('data');
        const storedValue = localStorage.getItem('value');
        const storedChallenge = localStorage.getItem('challenge')
        if (storedId) setId(Number(storedId));
        if (storedUid) setUid(storedUid);
        if (storedValue) setValue(storedValue);
        if (storedData) setData(storedData);
        if (storedChallenge) setChallenge(storedChallenge);

    }, []);

    useEffect(() => {
        localStorage.setItem('id', id);
        localStorage.setItem('uid', uid);
        localStorage.setItem('data', data);
        localStorage.setItem('value', value);
        localStorage.setItem('challenge', challenge);
    }, [id, uid, data, value]);

    return (
        <AppContext.Provider value={{ id, setId, uid, setUid, data, setData, value, setValue, challenge, setChallenge }}>
            {children}
        </AppContext.Provider>
    );
    }

export function useAppContext() {
    return useContext(AppContext);
}

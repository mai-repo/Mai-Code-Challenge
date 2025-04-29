"use client"
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppWrapper({ children }) {
    const [id, setId] = useState(null);
    const [uid, setUid] = useState(null);
    const [data, setData] = useState([])
    const [value, setValue] = useState('');
    const [challenge, setChallenge] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] =useState('');
    const [search, setSearch] =useState('');
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [problem, setProblem] = useState('');


    useEffect(() => {
        const storedId = localStorage.getItem('id');
        const storedUid = localStorage.getItem('uid');
        const storedData = localStorage.getItem('data');
        const storedValue = localStorage.getItem('value');
        const storedChallenge = localStorage.getItem('challenge')
        const storedError = localStorage.getItem('error');
        const storedLoading = localStorage.getItem('loading');
        const storedSearch  = localStorage.getItem('search');
        const storedStatus = localStorage.getItem('status');
        const storedName = localStorage.getItem('name');
        const storedProblem = localStorage.getItem('problem');
        if (storedId) setId(Number(storedId));
        if (storedUid) setUid(storedUid);
        if (storedValue) setValue(storedValue);
        if (storedData) setData(storedData);
        if (storedChallenge) setChallenge(storedChallenge);
        if (storedError) setError(storedError);
        if (storedLoading) setLoading(storedLoading);
        if (storedSearch) setSearch(storedSearch);
        if (storedStatus) setStatus(storedStatus);
        if (storedName) setName(storedName);
        if (storedProblem) setProblem (storedProblem);

    }, []);

    useEffect(() => {
        localStorage.setItem('id', id);
        localStorage.setItem('uid', uid);
        localStorage.setItem('data', data);
        localStorage.setItem('value', value);
        localStorage.setItem('challenge', challenge);
        localStorage.setItem('error', error);
        localStorage.setItem('loading', loading);
        localStorage.setItem('search', search);
        localStorage.setItem('status', status);
        localStorage.setItem('name', name);
        localStorage.setItem('problem', problem);
    }, [id, uid, data, value, challenge, error, loading, search, status, name, problem]);

    return (
        <AppContext.Provider value={{ id, setId, uid, setUid, data, setData, value, setValue, challenge, setChallenge, error, setError, loading, setLoading, search, setSearch, status, setStatus, name, setName, problem, setProblem}}>
            {children}
        </AppContext.Provider>
    );
    }

export function useAppContext() {
    return useContext(AppContext);
}

export const fetchNames = () : string => {
    const value = localStorage.getItem("pairs");
    return value ?? "Alejandro\nJavi\nLaura\nElna";
};

export const storeNames = (names: string) => {
    localStorage.setItem("pairs", names);
};

export const fetchDescription = () : string => {
    return localStorage.getItem("description") ?? "";
};

export const storeDescription = (description: string) => {
    localStorage.setItem("description", description ?? "");
};

export const fetchRotationFrequency = () : string => {
    return localStorage.getItem("rotation-frequency") ?? "1";
};

export const storeRotationFrequency = (rotation: string) => {
    localStorage.setItem("rotation-frequency", rotation);
};

export const fetchUntilDate = () : string => {
    return localStorage.getItem("until-date") || "";
};

export const storeUntilDate = (rotation: string) => {
    localStorage.setItem("until-date", rotation);
};
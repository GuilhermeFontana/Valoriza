import Cookies from 'js-cookie'

function getCookies(key: string){  
    return JSON.parse(Cookies.get(key) || "{}");
}

function setCookies(key: string, value: {}){
    Cookies.set(key, JSON.stringify(value));
}

function updateCookies(key: string, newValue: {}) {
    const currentCookie = JSON.parse(Cookies.get(key) || "{}");

    Cookies.set(key, JSON.stringify({...currentCookie, newValue}))
}

export {
    getCookies,
    setCookies,
    updateCookies
}
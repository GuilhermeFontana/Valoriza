export default function limparObjeto(obj: object) {
    Object.entries(obj).forEach(([key, value]) => {
        if (!value)
            delete obj[key]
    })

    return obj;
}
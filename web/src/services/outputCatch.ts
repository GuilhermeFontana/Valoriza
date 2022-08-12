import toast from "./toast"

function execute (
    response: {
        data: {
            erro: string
        }
        status: number
    },
    defaultMessage?: string,
    toastPosition?: "right" | "left" | "none"
) {

    const message = response.status === 401 
        ? "Você não tem autorização para executar esta ação. Contate um administrador"
        : response.data && response.data.erro 
            ? response.data.erro
            : defaultMessage  || "Ocorreu um erro inesperado. Tente novamente mais tarde"

    if (toastPosition === "none"){
        console.log(message);
        return;
    }

    toast("error", message, {position: toastPosition})
}

export default execute;    
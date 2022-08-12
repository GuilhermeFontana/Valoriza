import { executeToast, endPromiseToast } from "./toast"

function execute (
    response: {
        data: {
            erro: string
        }
        status: number
    },
    defaultMessage?: string,
    loadingId?: number | string,
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

    if (!loadingId){
        executeToast(message, {type: "error", position: toastPosition});
    }
    else{
        endPromiseToast(loadingId, message, { type: "error", position: toastPosition });
    }
    
}

export default execute;    
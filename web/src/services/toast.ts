import { toast } from 'react-toastify';

type TConfigs = {
    type: "info" | "success" | "warning" | "error"
    position?: "right" | "left"
}

function executeToast(text: string, configs: TConfigs){
    
    if (configs.type === "info")
        toast.success(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });

    if (configs.type === "success")
        toast.success(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });
    
    if (configs.type === "warning")
        toast.warning(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
    });

    if (configs.type === "error")
        toast.error(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });
}

function startPromiseToast(text: string, position?: "right" | "left") {
    return toast.loading(text, { position: position === "right" ? "bottom-right" : "bottom-left" });
}

function endPromiseToast(id: number | string, text: string, configs: TConfigs) {
    toast.update(id, { 
        render: text, 
        type: configs.type, 
        isLoading: false, 
        position: configs?.position === "right" ? "bottom-right" : "bottom-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
    });

}

export {
    executeToast,
    startPromiseToast,
    endPromiseToast
};
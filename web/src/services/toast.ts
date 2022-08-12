import { toast } from 'react-toastify';

type TConfigs = {
    position?: "right" | "left";
}

function execute(type: string, text: string, configs?: TConfigs){

    if (type === "info")
        toast.success(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });

    if (type === "success")
        toast.success(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });
    
    if (type === "warning")
        toast.warning(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
    });

    if (type === "error")
        toast.error(text, {
            position: configs?.position === "right" ? "bottom-right" : "bottom-left",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
        });
}

export default execute;
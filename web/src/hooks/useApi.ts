import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContexts"; 

export function useApi() {
    return useContext(ApiContext)
}
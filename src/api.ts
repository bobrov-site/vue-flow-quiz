import routes from "./routes"
import axios from "axios";
import type { License } from "./types";

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const axiosInstance = axios.create({headers, baseURL: routes.baseUrl})

const dictionary: License[] = []

const fetchLicenses = async() => {
    try {
        const response = await axiosInstance.get(routes.licensesDictionary, { headers })
        if (response.data) {
            dictionary.push(...response.data);
        }
        return response.data;
    }
    catch(e) {
        console.log(e, 'licenses not downloaded');
    }
    
}

const fetchNodes = async() => {
    const response = await axiosInstance.get(routes.quiz, { headers })
    return response.data
}

const saveJson = async(json, id:number) => {
    try {
        const response = await axiosInstance({
            method: 'POST',
            url: routes.quizId(id),
            data: {
                quiz: json
            },
        })
        return response.data
    }
    catch (e) {
        throw new Error(e);
    }
}

const api = {
    fetchLicenses,
    saveJson,
    fetchNodes,
    dictionary,
}

export default api
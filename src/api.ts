import routes from "./routes"
import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const jar = new CookieJar();

const axiosInstance = wrapper(axios.create({jar, headers, baseURL: routes.baseUrl}))


const welcome = async() => {
    const response = await axiosInstance.post(routes.welcome, {}, { headers });
    return response.data;
}

const fetchLicenses = async() => {
    const response = await axiosInstance.get(routes.licensesDictionary, { headers })
    return response.data;
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
    welcome,
}

export default api
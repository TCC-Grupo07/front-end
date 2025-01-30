import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from "./errors/AuthTokenError"
import { signOut } from "../contexts/AuthContext"

let url = "http://localhost:3333"



export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx)



    const api = axios.create({

        baseURL: url,

        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {
        if (error.response.status === 401) {
            //Qualquer erro 401 (não autorizado) devemos deslogar usuários
            if (typeof window !== undefined) {
                //Chamar a função para deslogar o usuário
                signOut()
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error)
    })

    return api
}
import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from "./errors/AuthTokenError"
import { signOut } from "../contexts/AuthContext"

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx)

    const api = axios.create({

        baseURL: 'https://3333-tccgrupo07-backend-goktyvxb8qp.ws-us115.gitpod.io',

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
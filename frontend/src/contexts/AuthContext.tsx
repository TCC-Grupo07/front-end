import { createContext, ReactNode, useState } from 'react';

import { destroyCookie, setCookie, parseCookies } from "nookies"

import Router from "next/router"

import { api } from "../services/apiClient"

import { toast } from "react-toastify"


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void
  signUp: (credentials: SignUpProps) => Promise<void>
}

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  name: string,
  email: string,
  password: string
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token')
    Router.push('/')
  } catch {
    console.log("Erro ao deslogar")
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password
      })

      // console.log(response.data)
      const { id, name, token } = response.data

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // espirar em um mes
        path: "/" // quais caminhos terão acesso ao cookies
      })

      setUser({
        id,
        name,
        email
      })

      // Passar para o proxima requisição o nosso token 
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success("LOGADO COM SUCESSO")

      //Redirecionar o user para /dashboard
      Router.push('/dashboar')


    } catch (err) {
      toast.error("ERRO AO ACESSAR")
      console.log("ERRO AO ACESSAR, ", err)

    }


  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {

      const response = await api.post('/users', {
        name,
        email,
        password
      })

      toast.success("CADASTRADO COM SUCESSO")

      Router.push('/')

    } catch (err) {
      toast.error("ERRO AO CADASTRAR")
      console.log("ERRO AO CADASTRAR", err)
    }
  }


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}
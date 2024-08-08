import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { parseCookies } from "nookies"

// Função para páginas que só poder ser acessadas por visitantes

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx)

        // se o user tentar acessar a página, porem tendo um login => redirecionamos
        if (cookies['@nextauth.token']){
            return {
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }


            return await fn(ctx)
    }
}
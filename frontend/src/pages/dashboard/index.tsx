import { canSSRAuth } from "../../utils/canSSRAuth"

export default function Dashboard() {
    return (
        <div>
            <h1>Bem vindo(a) ao Painel</h1>
            <h2>Você foi logado com sucesso</h2>
        </div>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {

        }
    }
})
import { useContext, FormEvent } from "react"

import "./styleLogin.css"

import Logo from '../../assets/logo.svg'

import { Button } from "../../components/ui/button/index"

import { AuthContext } from "../../contexts/AuthContext"

function Login() {
    const { signIn } = useContext(AuthContext)

    async function handleLogin(event: FormEvent) {
        event.preventDefault()

        let data ={
            email: "algum@teste.com",
            password: "123"

        }

        await signIn(data)
    }

    return (

        <div className="container">
            <div className="login">
                <div className="card">
                    <img src={Logo} alt="Logo da empresa" id='logo' className='logo' />
                    <h2>Bem-vindo(a) ao Stock Pro</h2>
                    <h1>Login</h1>

                    <form onSubmit={handleLogin}>
                        <div className='forms'>


                            <input type="email" required placeholder='Email' id='email' />

                            <input type="password" required id="password" placeholder='Senha' />
                        </div>
                    </form>

                    <div className="logar">
                        <a id='criarConta' href='/register'>Criar conta</a>

                    </div>



                    <Button
                        type='submit'
                        Loading={false}
                    >
                        Logar
                    </Button>
                    {/* <button type='submit'>Login</button> */}
                </div>
            </div>

            <div className="image">

            </div>
        </div>


    )
}

export default Login

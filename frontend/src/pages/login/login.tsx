
import Logo from '../../assets/logo.svg'

function Login() {
    return (
      
        <div className="container">
            <div className="login">
                <div className="card">
                    <img src={Logo} alt="Logo da empresa" id='logo' className='logo' />
                    <h2>Bem-vindo(a) ao Stock Pro</h2>
                    <h1>Login</h1>

                    <div className='forms'>

                        <input type="email" required placeholder='Email' id='email' />

                        <input type="password" required id="password" placeholder='Senha' />
                    </div>

                    <div className="logar">
                        <a id='esqueciSenha' href="#">Esqueci minha senha </a>
                        <a id='criarConta' href='/register'>Criar conta</a>
                    </div>


                    <button type='submit'>Login</button>
                </div>
            </div>

            <div className="image">

            </div>
        </div>


    )
}

export default Login

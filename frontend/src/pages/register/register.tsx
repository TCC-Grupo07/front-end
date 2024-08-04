import './styleRegister.css'
import Logo from '../../assets/logo.svg'

function Register() {

    function enviar() {
        alert("Cadastro efetuado com sucesso!")
    }

    return (
        <div className="container">
            <div className="login">
                <div className="card">
                    <img src={Logo} alt="Logo da empresa" id='logo' className='logo' />
                    <h2>Bem-vindo(a) ao Stock Pro</h2>
                    <h1>Cadastro</h1>

                    <div className='forms'>

                        <input type="text" required placeholder='Nome' id='nome' />

                        <input type="email" required placeholder='Email' id='email' />

                        <input type="password" required id="password" placeholder='Senha' />
                    </div>

                    <div className="loginHome">
                        <a id='login' href="/">Voltar para página de Login </a>                       
                    </div>


                    <button onClick={enviar} type='submit'>Cadastrar-se</button>
                </div>
            </div>

            <div className="image">

            </div>
        </div>


    )
}

export default Register

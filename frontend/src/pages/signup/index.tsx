import { useState, FormEvent, useContext } from "react"

import Head from 'next/head'
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';

import Logo from '../../assets/logo.svg';

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

import { AuthContext } from "../../contexts/AuthContext"

import { toast } from "react-toastify"

import Link from 'next/link';

export default function SignUp() {

  const { signUp } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleSignUp(event: FormEvent) {
    event.preventDefault()

    if (name === "" || email === "" || password === "") {
      toast.error("PREENCHA TODOS OS CAMPOS")
      return
    }

    setLoading(true)

    let data = {
      name,
      email,
      password
    }

    await signUp(data)

    setLoading(false)

  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.login}>
          <div className={styles.card}>
            <Image src={Logo} alt="Logo StockPro" className={styles.logo} />
            <h2 className={styles.subTitulo}>Bem-vindo(a) ao Stock Pro</h2>
            <h1 className={styles.titulo}>Cadastro</h1>

            <form onSubmit={handleSignUp}>
              <div className={styles.forms}>

                <Input type="text" required id={styles.name} placeholder='Nome' value={name} onChange={(e) => setName(e.target.value)} />

                <Input type="email" required placeholder='Email' id={styles.email} value={email} onChange={(e) => setEmail(e.target.value)} />

                <Input type="password" required id={styles.password} placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />

              </div>

              <div className={styles.logar}>
                <Link href="/" className={styles.criarConta}>
                  Já possui uma conta? Conecte-se
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
              >Cadastrar</Button>
            </form>

          </div>
        </div>

        <div className={styles.image}>

        </div>
      </div>
    </>
  )
}

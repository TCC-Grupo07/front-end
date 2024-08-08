import { useContext, FormEvent, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image';
import styles from '../../styles/home.module.scss';

import { Input } from '../components/ui/Input'

import { Button } from '../components/ui/Button'

import { AuthContext } from '../contexts/AuthContext'

import Logo from "../assets/logo.svg"

import { toast } from "react-toastify"

import Link from 'next/link';

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === '' || password === '') {
      toast.error("PREENCHA TODOS OS CAMPOS")
      return
    }

    setLoading(true)

    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>StockPro - Faça seu login</title>
      </Head>


      <div className={styles.container} >
        <div className={styles.login}>
          <div className={styles.card}>
            <Image src={Logo} alt="Logo Sujeito Pizzaria" className={styles.logo} />
            <h2 className={styles.subTitulo}>Bem-vindo(a) ao Stock Pro</h2>
            <h1 className={styles.titulo}>Login</h1>

            <form onSubmit={handleLogin}>
              <div className={styles.forms}>


                <Input type="email" required placeholder='Email' id={styles.email} value={email} onChange={(e) => setEmail(e.target.value)} />

                <Input type="password" required id={styles.password} placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className={styles.logar}>
                <Link className={styles.criarConta} href="/signup">
                  Nao possui uma conta? Cadastre-se
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
              >Logar</Button>
            </form>




          </div>
        </div>

        <div className={styles.image}>

        </div>
      </div>

    </>
  )
}

import { useContext, FormEvent } from 'react'

import Head from 'next/head'
import Image from 'next/image';
import styles from '../../styles/home.module.scss';

import { Input } from '../components/ui/Input'

import { Button } from '../components/ui/Button'

import { AuthContext } from '../contexts/AuthContext'

import Logo from "../assets/logo.svg"

import Link from 'next/link';

export default function Home() {
  const { signIn } = useContext(AuthContext)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    let data = {
      email: "algum@teste.com",
      password: "123123"
    }

    await signIn(data)
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

            <div className={styles.forms}>

              <Input type="email" required placeholder='Email' id={styles.email} />

              <Input type="password" required id={styles.password} placeholder='Senha' />
            </div>

            <div className={styles.logar}>

            <Link href="/signup">
           <a className={styles.criarConta}>Nao possui uma conta? Cadastre-se</a>
        </Link>

             
            </div>

            <Button
            type="submit"
            loading={false}
          >Logar</Button>
           
          </div>
        </div>

        <div className={styles.image}>

        </div>
      </div>

    </>
  )
}

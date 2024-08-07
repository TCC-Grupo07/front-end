import Head from 'next/head'
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';

import Logo from '../../assets/logo.svg';

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.login}>
          <div className={styles.card}>
            <Image src={Logo} alt="Logo Sujeito Pizzaria" className={styles.logo} />
            <h2 className={styles.subTitulo}>Bem-vindo(a) ao Stock Pro</h2>
            <h1 className={styles.titulo}>Cadastro</h1>

            <div className={styles.forms}>

              <Input type="text" required id={styles.name} placeholder='Nome' />

              <Input type="email" required placeholder='Email' id={styles.email} />

              <Input type="password" required id={styles.password} placeholder='Senha' />

            </div>

            <div className={styles.logar}>
              <Link href="/">
                <a className={styles.criarConta}>Já possui uma conta? Conecte-se</a>
              </Link>
            </div>

            <Button
              type="submit"
              loading={false}
            >Cadastrar</Button>

          </div>
        </div>

        <div className={styles.image}>

        </div>
      </div>
    </>
  )
}

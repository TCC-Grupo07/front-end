import { useContext } from "react"

import { useState } from 'react'

import { Button } from "../../components/ui/Button"

import { canSSRAuth } from '../../utils/canSSRAuth'

import Link from "next/link"

import Head from 'next/head'

import styles from './styles.module.scss'

import { setupAPIClient } from '../../services/api'

import { AuthProvider } from "../../contexts/AuthContext"

import { AuthContext } from "../../contexts/AuthContext"

import { FiLogOut } from "react-icons/fi"

export default function Dashboard() {

    const { signOut, user } = useContext(AuthContext)
    return (
        <div>
            <Head>
                <title>
                    Dashboard
                </title>
            </Head>

            <div className={styles.container}>
                <h1>Olá, {user?.name}. Seja bem vindo(a)</h1>
                <h2>Login efetuado com sucesso</h2>

                <button onClick={signOut}>
                    <FiLogOut color="black" size={24} />
                </button>

            </div>
        </div>
    )
}




export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    return {
        props: {

        }
    }
})
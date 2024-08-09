import { useState } from 'react'

import { Button } from "../../components/ui/Button"

import { canSSRAuth } from '../../utils/canSSRAuth'

import Link from "next/link"

import Head from 'next/head'

import styles from './styles.module.scss'

import { setupAPIClient } from '../../services/api'

import { AuthProvider } from "../../contexts/AuthContext"

export default function Dashboard() {
    return (
        <div>
            <Head>
                <title>
                    Dashboard
                </title>
            </Head>

            <div className={styles.container}>
                <h1>Seja bem vindo(a)</h1>
                <h2>Login efetuado com sucesso</h2>

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
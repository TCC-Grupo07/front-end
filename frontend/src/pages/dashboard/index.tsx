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

import { Header } from "../../components/Header";

import { FiLogOut } from "react-icons/fi"

export default function Dashboard() {

    const { user } = useContext(AuthContext)
    return (
        <div>
            <Head>
                <title>
                    Dashboard
                </title>
            </Head>

            <Header />

            <div className={styles.container}>

                <h1>Olá, {user?.name}. Seja bem vindo(a)</h1>

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
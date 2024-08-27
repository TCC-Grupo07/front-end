import Head from 'next/head'
import { ChangeEvent, useState, FormEvent } from 'react'
import styles from "./styles.module.scss"
import { canSSRAuth } from '../../utils/canSSRAuth'
import { Header } from '../../components/Header'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'

import Link from 'next/link';

type ItemProps = {
    id: string;
    name: string;
};

type ProductsProps = {
    id: string;
    name: string;
};

interface SectorProps {
    sectortList: ItemProps[];
}

interface ProductProps {
    productList: ProductsProps[];
}

export default function Stock() {

    return (
        <>
            <Head>
                <title>Controle de Estoque</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Estoque</h1>

                    <div className={styles.buttons}>

                        <Link href="/stock/entry" className={styles.buttonEntry}>
                            Entrada
                        </Link>

                        <Link href="/stock/exit" className={styles.buttonExit}>
                            Saída
                        </Link>
                    </div>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/sector')
        const produto = await apiClient.get('/product')

        return {
            props: {
                sectortList: response.data,
                productList: produto.data,
            },
        }
    } catch (error) {
        console.error("Error in canSSRAuth:", error)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
})

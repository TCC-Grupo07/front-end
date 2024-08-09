import Head from "next/head";

import { FormEvent } from 'react'

import styles from "./styles.module.scss"

import { Header } from "../../components/Header";

import { Input } from "../../components/ui/Input";

import { Button } from "../../components/ui/Button";

export default function Sector() {

    async function handleRegisterSector(event: FormEvent) {
        event.preventDefault();
      
    }
    return (
        <>
            <Head>
                <title>
                    Novo Setor -- StockPro
                </title>
            </Head>
            <div className={styles.container}>
                <Header />
                <h1>Novo Setor</h1>

                <form className={styles.form} onSubmit={handleRegisterSector}>
                    <Input
                        type="text"
                        placeholder='Nome do Setor'
                        required
                    />

                    <Input
                        type="text"
                        placeholder='Descrição do Setor'
                        required
                        className={styles.input}
                    />

                    <Button>
                        Cadastrar
                    </Button>
                </form>
            </div>

        </>
    )
}
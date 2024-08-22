import Head from "next/head";

import { FormEvent, useState } from 'react'

import styles from "./styles.module.scss"

import { Header } from "../../components/Header";

import { Input } from "../../components/ui/Input";

import { Button } from "../../components/ui/Button";

import { setupAPIClient } from "../../services/api";

import { toast } from "react-toastify"

import { canSSRAuth } from "../../utils/canSSRAuth";



export default function Sector() {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    async function handleRegisterSector(event: FormEvent) {

        event.preventDefault();


        if (name === '' || description === '') {
            toast.warning("PREENCHA TODOS OS CAMPOS")
            return
        }

        const apiClient = setupAPIClient()
        await apiClient.post("/sector", {
            name: name,
            description: description
        })

        toast.success("SETOR CADASTRADO COM SUCESSO")


        setName('')
        setDescription('')


    }
    return (
        <>
            <Head>
                <title>
                    Cadastrando Setor -- StockPro
                </title>
            </Head>

            <Header />
            <div className={styles.container}>
                <h1>Novo Setor</h1>

                <form className={styles.form} onSubmit={handleRegisterSector}>
                    <Input
                        type="text"
                        placeholder='Nome do Setor'
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    />

                    <Input
                        type="text"
                        placeholder='Descrição do Setor'
                        className={styles.input}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Button className={styles.button} type="submit">
                        Cadastrar
                    </Button>
                </form>
            </div>

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {

        }
    }
})
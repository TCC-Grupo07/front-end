// import Head from "next/head";

// import { FormEvent, useState } from 'react'

// import styles from "./styles.module.scss"

// import { Header } from "../../components/Header";

// import { Input } from "../../components/ui/Input";

// import { Button } from "../../components/ui/Button";

// import { setupAPIClient } from "../../services/api";

// import { toast } from "react-toastify"

// import { canSSRAuth } from "../../utils/canSSRAuth";



// export default function Sector() {

//     const [name, setName] = useState("")
//     const [description, setDescription] = useState("")

//     async function handleRegisterSector(event: FormEvent) {

//         event.preventDefault();


//         if (name === '' || description === '') {
//             toast.warning("PREENCHA TODOS OS CAMPOS")
//             return
//         }

//         const apiClient = setupAPIClient()
//         await apiClient.post("/sector", {
//             name: name,
//             description: description
//         })

//         toast.success("SETOR CADASTRADO COM SUCESSO")


//         setName('')
//         setDescription('')


//     }
//     return (
//         <>
//             <Head>
//                 <title>
//                     Cadastrando Setor -- StockPro
//                 </title>
//             </Head>

//             <Header />
//             <div className={styles.container}>
//                 <h1>Novo Setor</h1>

//                 <form className={styles.form} onSubmit={handleRegisterSector}>
//                     <Input
//                         type="text"
//                         placeholder='Nome do Setor'
//                         className={styles.input}
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}

//                     />

//                     <Input
//                         type="text"
//                         placeholder='Descrição do Setor'
//                         className={styles.input}
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />

//                     <Button className={styles.button} type="submit">
//                         Cadastrar
//                     </Button>
//                 </form>
//             </div>

//         </>
//     )
// }

// export const getServerSideProps = canSSRAuth(async (ctx) => {
//     return {
//         props: {

//         }
//     }
// })

import Head from "next/head";
import { FormEvent, useState, useEffect } from 'react';
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Modal from 'react-modal';
import { IoIosClose } from "react-icons/io";

Modal.setAppElement('#__next');

export default function Sector() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectors, setSectors] = useState([]);

    async function handleRegisterSector(event: FormEvent) {
        event.preventDefault();

        if (name === '' || description === '') {
            toast.warning("PREENCHA TODOS OS CAMPOS");
            return;
        }

        const apiClient = setupAPIClient();
        await apiClient.post("/sector", {
            name: name,
            description: description
        });

        toast.success("SETOR CADASTRADO COM SUCESSO");

        setName('');
        setDescription('');
    }

    async function openModal() {
        setIsModalOpen(true);
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/sector");
        setSectors(response.data);
    }

    function closeModal() {
        setIsModalOpen(false);
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

                    <Button className={styles.buttonSetores} type="button" onClick={openModal}>
                        Ver Setores
                    </Button>
                </form>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Lista de Setores"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <h2>Setores Existentes</h2>
                <button onClick={closeModal}><IoIosClose fontSize={20} /></button>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sectors.map((sector) => (
                            <tr key={sector.id}>
                                <td>{sector.name}</td>
                                <td>{sector.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    };
});

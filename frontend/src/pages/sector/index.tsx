import Head from "next/head";
import { FormEvent, useState } from 'react';
import styles from "./styles.module.scss";
import { Header } from "../../components/Header";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Modal from 'react-modal';
import { IoIosClose } from "react-icons/io";
import { AxiosError } from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Modal.setAppElement('#__next');

export default function Sector() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectors, setSectors] = useState([]);

    // Função para registrar um setor
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

    // Função para abrir o modal e carregar os setores
    async function openModal() {
        setIsModalOpen(true);
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.get("/sector");

            // Ordenar os setores em ordem alfabética
            const sortedSectors = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setSectors(sortedSectors);
        } catch (error: AxiosError | any) {
            if (error.response && error.response.status === 401) {
                // Tratar erro 401
            } else {
                toast.error("ERRO AO CARREGAR SETORES");
            }
        }
    }

    // Função para fechar o modal
    function closeModal() {
        setIsModalOpen(false);
    }

    // Função para deletar um setor com confirmação
    async function handleDeleteSector(sector_id: string) {
        const result = await Swal.fire({
            title: `Você tem certeza?`,
            text: `Deseja deletar este setor? Isso removerá todos os dados associados a ele.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#009C86',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const apiClient = setupAPIClient();
            try {
                await apiClient.delete(`/sector?sector_id=${sector_id}`);

                toast.success("SETOR REMOVIDO COM SUCESSO");

                // Atualizar a lista de setores
                const updatedSectors = sectors.filter(sector => sector.id !== sector_id);
                setSectors(updatedSectors);

            } catch (error: AxiosError | any) {
                toast.error("ERRO AO REMOVER SETOR");
            }
        }
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
                    <h3>Nome</h3>
                    <Input
                        type="text"
                        placeholder='Nome do Setor'
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <h3>Descrição</h3>
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

                    <Button className={styles.button} type="button" onClick={openModal}>
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
                <button onClick={closeModal} className={styles.closeButton}><IoIosClose fontSize={20} /></button>
                <h2>Setores Existentes</h2>

                {sectors.length === 0 ? (
                    <p>Nenhum setor cadastrado.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Ações</th> {/* Coluna para ações */}
                            </tr>
                        </thead>
                        <tbody>
                            {sectors.map((sector) => (
                                <tr key={sector.id}>
                                    <td>{sector.name}</td>
                                    <td>{sector.description}</td>
                                    <td className={styles.actionsColumn}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteSector(sector.id)}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Modal>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    };
});

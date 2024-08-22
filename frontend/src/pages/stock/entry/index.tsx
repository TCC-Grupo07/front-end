import Head from 'next/head'
import { ChangeEvent, useState, FormEvent } from 'react'
import styles from "./styles.module.scss"
import { canSSRAuth } from '../../../utils/canSSRAuth'
import { Header } from '../../../components/Header'
import { setupAPIClient } from '../../../services/api'
import { toast } from 'react-toastify'

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

export default function Entry({ sectortList, productList }: SectorProps & ProductProps) {

    const [name, setName] = useState('')
    const [sectors, setSectors] = useState(sectortList || [])
    const [products, setProducts] = useState(productList || [])
    const [sectorSelected, setSectorSelected] = useState(0)
    const [productSelected, setProductSelected] = useState(0)
    const [quantidade, setQuantidade] = useState('')

    // Quando você seleciona um setor na lista
    function handleChangeSector(event: ChangeEvent<HTMLSelectElement>) {
        setSectorSelected(Number(event.target.value))
    }

    // Quando você seleciona um produto na lista 
    function handleChangeProduct(event: ChangeEvent<HTMLSelectElement>) {
        setProductSelected(Number(event.target.value))
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault()

        try {
            if (quantidade === '') {
                toast.warning("PREENCHA TODOS OS CAMPOS")
                return
            }

            const data = {
                quantidade,
                product_id: products[productSelected].id,
                sector_id: sectors[sectorSelected].id
            }

            console.log("Enviando os seguintes dados:", data)

            const apiClient = setupAPIClient()
            await apiClient.post('/entry', data)

            toast.success("CADASTRADO COM SUCESSO!")
            setQuantidade('')

        } catch (err) {
            console.error("Erro ao cadastrar: ", err.response ? err.response.data : err)
            toast.error("Ops... ERRO AO CADASTRAR")
        }

        Number(quantidade)
    }

    return (
        <>
            <Head>
                <title>Entrada de Produto</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Entrada de Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <select value={sectorSelected} onChange={handleChangeSector}>
                            {sectors.map((item, index) => (
                                <option key={item.id} value={index}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select value={productSelected} onChange={handleChangeProduct}>
                            {products.map((item, index) => (
                                <option key={item.id} value={index}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Digite a quantidade do produto"
                            className={styles.input}
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type='submit'>
                            Cadastrar
                        </button>
                    </form>
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

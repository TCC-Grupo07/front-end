import Head from 'next/head'
import { ChangeEvent, useState, FormEvent, useEffect } from 'react'
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
    sector_id: string; // Adicione este campo para a filtragem
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
    const [sectorSelected, setSectorSelected] = useState<string>('') // Alterado para string
    const [filteredProducts, setFilteredProducts] = useState<ProductsProps[]>(productList) // Produtos filtrados
    const [productSelected, setProductSelected] = useState<string>('') // Alterado para string
    const [quantidade, setQuantidade] = useState('')

    // Atualizar lista de produtos com base no setor selecionado
    useEffect(() => {
        if (sectorSelected === '') {
            setFilteredProducts(productList);
        } else {
            setFilteredProducts(
                productList.filter(product => product.sector_id === sectorSelected)
            );
        }
    }, [sectorSelected, productList]);

    // Quando você seleciona um setor na lista
    function handleChangeSector(event: ChangeEvent<HTMLSelectElement>) {
        setSectorSelected(event.target.value);
    }

    // Quando você seleciona um produto na lista 
    function handleChangeProduct(event: ChangeEvent<HTMLSelectElement>) {
        setProductSelected(event.target.value);
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try {
            if (quantidade === '' || sectorSelected === '' || productSelected === '') {
                toast.warning("PREENCHA TODOS OS CAMPOS");
                return;
            }

            const data = {
                quantidade,
                product_id: productSelected, // Alterado para string
                sector_id: sectorSelected // Alterado para string
            };

            const apiClient = setupAPIClient();
            await apiClient.post('/entry', data);

            toast.success("ENTRADA FEITA COM SUCESSO!");
            setQuantidade('');

        } catch (err) {
            console.error("Erro ao cadastrar: ", err.response ? err.response.data : err);
            toast.error("Ops... ERRO AO CADASTRAR");
        }

        Number(quantidade);
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
                            <option value="">Selecione um setor</option>
                            {sectors.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select value={productSelected} onChange={handleChangeProduct}>
                            <option value="">Selecione um produto</option>
                            {filteredProducts.map((item) => (
                                <option key={item.id} value={item.id}>
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
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/sector');
        const produto = await apiClient.get('/product');

        return {
            props: {
                sectortList: response.data,
                productList: produto.data,
            },
        };
    } catch (error) {
        console.error("Error in canSSRAuth:", error);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
});

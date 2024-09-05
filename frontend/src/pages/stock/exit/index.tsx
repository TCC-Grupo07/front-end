import Head from 'next/head';
import { ChangeEvent, useState, useEffect, FormEvent } from 'react';
import styles from "./styles.module.scss";
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { Header } from '../../../components/Header';
import { setupAPIClient } from '../../../services/api';
import { toast } from 'react-toastify';

type ItemProps = {
    id: string;
    name: string;
};

type ProductsProps = {
    id: string;
    name: string;
    sector_id: string; // Adicione esta propriedade se necessário
};

interface SectorProps {
    sectortList: ItemProps[];
}

interface ProductProps {
    productList: ProductsProps[];
}

export default function Exit({ sectortList, productList }: SectorProps & ProductProps) {
    const [sectors, setSectors] = useState(sectortList || []);
    const [products, setProducts] = useState(productList || []);
    const [filteredProducts, setFilteredProducts] = useState<ProductsProps[]>([]);
    const [sectorSelected, setSectorSelected] = useState<string>(''); // Atualizado para string
    const [productSelected, setProductSelected] = useState<string>(''); // Atualizado para string
    const [quantidade, setQuantidade] = useState('');

    useEffect(() => {
        if (sectorSelected === '') {
            // Se nenhum setor estiver selecionado, mostre todos os produtos
            setFilteredProducts(products);
        } else {
            // Filtre os produtos com base no setor selecionado
            const filtered = products.filter(product => product.sector_id === sectorSelected);
            setFilteredProducts(filtered);
        }
    }, [sectorSelected, products]);

    function handleChangeSector(event: ChangeEvent<HTMLSelectElement>) {
        setSectorSelected(event.target.value);
    }

    function handleChangeProduct(event: ChangeEvent<HTMLSelectElement>) {
        setProductSelected(event.target.value);
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try {
            if (quantidade === '') {
                toast.warning("PREENCHA TODOS OS CAMPOS");
                return;
            }

            const data = {
                quantidade,
                product_id: productSelected,
                sector_id: sectorSelected
            };



            const apiClient = setupAPIClient();
            await apiClient.post('/output', data);

            toast.success("SAÍDA FEITA COM SUCESSO!");
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
                <title>Saída de Produto</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Saída de Produto</h1>

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

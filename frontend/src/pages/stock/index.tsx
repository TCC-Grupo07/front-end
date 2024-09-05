import Head from 'next/head';
import { useState, useEffect } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from "./styles.module.scss";
import Link from 'next/link';

let url = "https://3333-tccgrupo07-backend-f6pedsjckd1.ws-us116.gitpod.io"


interface Product {
    id: string;
    name: string;
    quantidade: number;
    price: string;
    banner: string;
    quantidadeMin: string;
    sector_id: string; // Adicionado campo setor
}

interface StockProps {
    products: Product[];
}

const Stock: React.FC<StockProps> = ({ products }) => {
    const [selectedSector, setSelectedSector] = useState<string>('Todos');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Agrupar produtos por setor
    const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product) => {
        const sector = product.sector_id || "Desconhecido"; // Valor padrão se setor for indefinido
        (acc[sector] = acc[sector] || []).push(product);
        return acc;
    }, {});

    // Obter lista de setores únicos
    const sectors = ['Todos', ...Object.keys(groupedProducts)];

    useEffect(() => {
        // Filtrar e ordenar produtos com base no setor selecionado
        let productsToDisplay = selectedSector === 'Todos'
            ? products
            : groupedProducts[selectedSector] || [];

        // Ordenar produtos por nome em ordem alfabética
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredProducts(productsToDisplay);
    }, [selectedSector, products, groupedProducts]);

    return (
        <>
            <Head>
                <title>Controle de Estoque</title>
            </Head>
            <div>
                <Header />
                <div className={styles.buttons}>

                    <Link href="/stock/entry" className={styles.buttonEntry}>
                        Entrada
                    </Link>
                    <Link href="/stock/exit" className={styles.buttonExit}>
                        Saída
                    </Link>
                </div>
                <main className={styles.container}>
                    <h1>Estoque</h1>


                    <div className={styles.products}>
                        <div className={styles.filter}>
                            <h2>Filtrar por setor</h2>
                            <select
                                id="sector"
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className={styles.select}
                            >
                                {sectors.map(sector => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h2>Produtos</h2>
                        <div className={styles.tabela}>



                            {filteredProducts.length === 0 ? (
                                <p>Nenhum produto encontrado.</p>
                            ) : (
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Quantidade Mínima</th>
                                            <th>Quantidade no Estoque</th>
                                            <th>Preço</th>
                                            <th>Imagem</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.quantidadeMin}</td>
                                                <td>{product.quantidade}</td>
                                                <td>R$ {product.price}</td>
                                                <td>
                                                    <img
                                                        src={`${url}/files/${product.banner}`}
                                                        alt={product.name}
                                                        className={styles.bannerImage}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/product');

        return {
            props: {
                products: response.data || [],
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
});

export default Stock;

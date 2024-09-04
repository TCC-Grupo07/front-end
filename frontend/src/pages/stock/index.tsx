import Head from 'next/head';
import { useEffect } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from "./styles.module.scss";
import Link from 'next/link';
import { toast } from 'react-toastify'

interface Product {
    id: string;
    name: string;
    quantidade: number;
    price: string;
    banner: string;
    quantidadeMin: string;
}

interface StockProps {
    products: Product[];
}

const Stock: React.FC<StockProps> = ({ products }) => {
   
    return (
        <>
            <Head>
                <title>Controle de Estoque</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.buttons}>
                        <h1>Estoque</h1>
                        <Link href="/stock/entry" className={styles.buttonEntry}>
                            Entrada
                        </Link>
                        <Link href="/stock/exit" className={styles.buttonExit}>
                            Saída
                        </Link>
                    </div>

                    <div className={styles.products}>
                        <div className={styles.tabela}>
                            <h2>Produtos</h2>
                            {products.length === 0 ? (
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
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.quantidadeMin}</td>
                                                <td>{product.quantidade}</td>
                                                <td>R$ {product.price}</td>
                                                <td>
                                                    <img
                                                        src={`https://3333-tccgrupo07-backend-imzeo1l7dew.ws-us116.gitpod.io/files/${product.banner}`} // Caminho relativo ao diretório public
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

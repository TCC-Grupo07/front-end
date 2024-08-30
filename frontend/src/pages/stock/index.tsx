import Head from 'next/head';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from "./styles.module.scss";
import Link from 'next/link';

// Definir o tipo para o produto
interface Product {
    id: string;
    name: string;
    quantidade: number;
    price: string;
    description: string;
    banner: string;
    quantidadeMin: string;
}

interface StockProps {
    products: Product[]; // Passando products como propriedade obrigatória
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
                        <h2>Produtos</h2>
                        {products.length === 0 ? (
                            <p>Nenhum produto encontrado.</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Descrição</th>
                                        <th>Quantidade Mínima</th>
                                        <th>Quantidade no Estoque</th>
                                        <th>Preço</th>
                                        <th>Banner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.description}</td>
                                            <td>{product.quantidadeMin}</td>
                                            <td>{product.quantidade}</td>
                                            <td>R$ {product.price}</td>
                                            <td>
                                                <img
                                                    src={`/temp/images/${product.banner}`} // Caminho relativo ao diretório public
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
                </main>
            </div>
        </>
    );
};

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/product'); // Ajuste a rota se necessário

        return {
            props: {
                products: response.data || [], // Passa os produtos como props para o componente
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

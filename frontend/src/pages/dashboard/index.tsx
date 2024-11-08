import { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { AuthContext } from "../../contexts/AuthContext";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';


interface Product {
    id: string;
    name: string;
    quantidade: number;
    price: string;
    banner: string;
    quantidadeMin: string;
    sector: {
        id: string;
        name: string;
    };
}

interface DashboardProps {
    products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ products }) => {
    const { user } = useContext(AuthContext);
    const [sufficientProducts, setSufficientProducts] = useState<Product[]>([]);
    const [criticalProducts, setCriticalProducts] = useState<Product[]>([]);

    useEffect(() => {
        const sufficient = products.filter(product => {
            const quantidadeMin = parseInt(product.quantidadeMin, 10);
            return product.quantidade > quantidadeMin && product.quantidade <= quantidadeMin + 20;
        });

        const critical = products.filter(product => {
            const quantidadeMin = parseInt(product.quantidadeMin, 10);
            return product.quantidade <= quantidadeMin;
        });

        setSufficientProducts(sufficient);
        setCriticalProducts(critical);
    }, [products]);

    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>

            <Header />

            <div className={styles.container}>
                <h1>Produtos com Estoque em Alerta</h1>
                <div className={styles.cardsContainer}>
                    {sufficientProducts.map(product => (
                        <div key={product.id} className={`${styles.card} ${styles.sufficient}`}>
                            <h3>{product.name}</h3>
                            <p>Quantidade: {product.quantidade}</p>
                            <p>Quantidade Mínima: {product.quantidadeMin}</p>
                            <p>Setor: {product.sector.name}</p>
                        </div>
                    ))}
                </div>

                <h1>Produtos com Estoque Crítico</h1>
                <div className={styles.cardsContainer}>
                    {criticalProducts.map(product => (
                        <div key={product.id} className={`${styles.card} ${styles.critical}`}>
                            <h3>{product.name}</h3>
                            <p>Quantidade: {product.quantidade}</p>
                            <p>Quantidade Mínima: {product.quantidadeMin}</p>
                            <p>Setor: {product.sector.name}</p>
                        </div>
                    ))}
                </div>
                
            </div>


        </div>
    );
};

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    try {
        const response = await apiClient.get('/product');
        return {
            props: {
                products: response.data,
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            props: {
                products: [],
            },
        };
    }
});

export default Dashboard;
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from "./styles.module.scss";
import Link from 'next/link';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Adicione o CSS do SweetAlert2

let url = "https://urban-broccoli-gjv4pvj9w6phjgv-3333.app.github.dev/";

interface Product {
    id: string;
    name: string;
    quantidade: number;
    price: string;
    banner: string;
    quantidadeMin: string;
    sector_id: string;
}

interface StockProps {
    products: Product[];
}

const Stock: React.FC<StockProps> = ({ products }) => {
    const [selectedSector, setSelectedSector] = useState<string>('Todos');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>(products);

    // Agrupar produtos por setor
    const groupedProducts = allProducts.reduce((acc: { [key: string]: Product[] }, product) => {
        const sector = product.sector_id || "Desconhecido"; // Valor padrão se setor for indefinido
        (acc[sector] = acc[sector] || []).push(product);
        return acc;
    }, {});

    // Obter lista de setores únicos
    const sectors = ['Todos', ...Object.keys(groupedProducts)];

    useEffect(() => {
        // Filtrar e ordenar produtos com base no setor selecionado
        let productsToDisplay = selectedSector === 'Todos'
            ? allProducts
            : groupedProducts[selectedSector] || [];

        // Ordenar produtos por nome em ordem alfabética
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));

        setFilteredProducts(productsToDisplay);
    }, [selectedSector, allProducts, groupedProducts]);

    // Função para deletar produto com SweetAlert2
    const handleDelete = async (product_id: string, product_name: string) => {
        const result = await Swal.fire({
            title: `Você tem certeza?`,
            text: `Deseja deletar o produto "${product_name}"? Isso removerá as entradas e as saídas do estoque deste produto `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#009C86',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                const apiClient = setupAPIClient();
                await apiClient.delete(`/product`, { params: { product_id } });

                // Atualizar a lista de produtos após deletar
                const updatedProducts = allProducts.filter(product => product.id !== product_id);
                setAllProducts(updatedProducts);

                toast.success('Produto removido com sucesso!');
            } catch (error) {
                toast.error('Erro ao remover o produto.');
                console.error("Error deleting product:", error);
            }
        }
    };

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
                                            <th>Ações</th>
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
                                                <td>
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                    >
                                                        Deletar
                                                    </button>
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

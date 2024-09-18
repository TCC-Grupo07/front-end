import Head from 'next/head';
import { useState, useEffect } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from "./styles.module.scss";
import Link from 'next/link';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

let url = "https://urban-broccoli-gjv4pvj9w6phjgv-3333.app.github.dev";

interface Product {
    id: string;
    name: string;
    quantidade: number;
    price: string;
    banner: string;
    quantidadeMin: string;
    sector: {
        id: string;
        name: string;  // Nome do setor
    };
}

interface StockProps {
    products: Product[];
}

const Stock: React.FC<StockProps> = ({ products }) => {
    const [selectedSector, setSelectedSector] = useState<string>('Todos');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>(products);

    // Agrupar produtos por nome do setor
    const groupedProducts = allProducts.reduce((acc: { [key: string]: Product[] }, product) => {
        const sectorName = product.sector?.name || "Desconhecido"; // Usar o nome do setor, com fallback para "Desconhecido"
        (acc[sectorName] = acc[sectorName] || []).push(product);
        return acc;
    }, {});

    // Obter lista de setores únicos e ordenar em ordem alfabética
    const sectors = ['Todos', ...Object.keys(groupedProducts).sort((a, b) => a.localeCompare(b))];

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

                toast.success('PRODUTO REMOVIDO COM SUCESSO');
            } catch (error) {
                toast.error('ERRO AO REMOVER O PRODUTO');
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
                        <div className={styles.filter}>
                            <h2 className={styles.filtrar}>Filtrar por setor</h2>
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

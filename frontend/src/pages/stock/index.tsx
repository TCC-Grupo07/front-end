import Head from 'next/head';
import { useState, useEffect, useRef, useMemo } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from "./styles.module.scss";
import Link from 'next/link';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

let url = "https://3333-tccgrupo07-backend-x21fabe3q66.ws-us116.gitpod.io";

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

interface StockProps {
    products: Product[];
}

const Stock: React.FC<StockProps> = ({ products }) => {
    const [selectedSector, setSelectedSector] = useState<string>('Todos');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [editProductData, setEditProductData] = useState<Product | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Agrupar produtos por nome do setor com useMemo
    const groupedProducts = useMemo(() => {
        return products.reduce((acc: { [key: string]: Product[] }, product) => {
            const sectorName = product.sector?.name || "Desconhecido";
            (acc[sectorName] = acc[sectorName] || []).push(product);
            return acc;
        }, {});
    }, [products]);

    const sectors = ['Todos', ...Object.keys(groupedProducts).sort((a, b) => a.localeCompare(b))];

    useEffect(() => {
        const productsToDisplay = selectedSector === 'Todos'
            ? products
            : groupedProducts[selectedSector] || [];

        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredProducts(productsToDisplay);
    }, [selectedSector, groupedProducts, products]);

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

                setFilteredProducts(prev => prev.filter(product => product.id !== product_id));
                toast.success('PRODUTO REMOVIDO COM SUCESSO');
            } catch (error) {
                toast.error('ERRO AO REMOVER O PRODUTO');
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditProductData(product);
    };

    const handleUpdate = async () => {
        if (!editProductData) return;

        const result = await Swal.fire({
            title: 'Confirmar Atualização',
            text: `Você deseja realmente atualizar o produto para "${editProductData.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#009C86',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, atualizar!',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const { id, name, price, quantidadeMin } = editProductData;

            try {
                const apiClient = setupAPIClient();
                await apiClient.put(`/product`, { product_id: id, name, price, quantidadeMin });

                setFilteredProducts(prev =>
                    prev.map(product =>
                        product.id === id ? { ...product, name, price, quantidadeMin } : product
                    )
                );
                setEditProductData(null);
                toast.success('PRODUTO ATUALIZADO COM SUCESSO');
            } catch (error) {
                toast.error('ERRO AO ATUALIZAR O PRODUTO');
                console.error("Error updating product:", error);
            }
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setEditProductData(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

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
                                                <td className={styles.imagem}>
                                                    <img
                                                        src={`${url}/files/${product.banner}`}
                                                        alt={product.name}
                                                        className={styles.bannerImage}
                                                        width={100}
                                                        height={100}
                                                    />
                                                </td>
                                                <td>
                                                    <MdEdit
                                                        className={styles.editButton}
                                                        color=' #1a77e1' size={25}
                                                        onClick={() => handleEdit(product)} />
                                                    <FaTrash
                                                        className={styles.deleteButton}
                                                        color='red' size={25}
                                                        onClick={() => handleDelete(product.id, product.name)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {editProductData && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modal} ref={modalRef}>
                                <h2>Editar Produto</h2>
                                <h3>Nome</h3>
                                <input
                                    type="text"
                                    value={editProductData.name}
                                    onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                                    placeholder="Nome do Produto"
                                />
                                <h3>Quantidade Mínima</h3>
                                <input
                                    type="number"
                                    value={editProductData.quantidadeMin}
                                    onChange={(e) => setEditProductData({ ...editProductData, quantidadeMin: e.target.value })}
                                    placeholder="Quantidade Mínima"
                                />
                                <h3>Preço</h3>
                                <input
                                    type="text"
                                    value={editProductData.price}
                                    onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                                    placeholder="Preço"
                                />
                                <button onClick={handleUpdate}>Atualizar</button>
                                <button className={styles.buttonFechar} onClick={() => setEditProductData(null)}>Cancelar</button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
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

export default Stock;

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
import { FaTrash, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";  // Importando o autoTable corretamente

let url = "http://localhost:3333";

interface Product {
    id: string;
    codigo: string,
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
    const [searchTerm, setSearchTerm] = useState<string>('');  // Estado para armazenar o termo de pesquisa
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [editProductData, setEditProductData] = useState<Product | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const groupedProducts = useMemo(() => {
        return products.reduce((acc: { [key: string]: Product[] }, product) => {
            const sectorName = product.sector?.name || "Desconhecido";
            (acc[sectorName] = acc[sectorName] || []).push(product);
            return acc;
        }, {});
    }, [products]);

    const sectors = ['Todos', ...Object.keys(groupedProducts).sort((a, b) => a.localeCompare(b))];

    const [sortType, setSortType] = useState<'nome' | 'estoque' | null>(null);

    const sortProducts = (productsToSort: Product[]) => {
        if (sortType === 'nome') {
            return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === 'estoque') {
            return productsToSort.sort((a, b) => {
                const minA = parseInt(a.quantidadeMin, 10);
                const minB = parseInt(b.quantidadeMin, 10);
                return (a.quantidade - minA) - (b.quantidade - minB);
            });
        }
        return productsToSort;
    };

    useEffect(() => {
        const productsToDisplay = selectedSector === 'Todos'
            ? products
            : groupedProducts[selectedSector] || [];

        // Filtrar produtos com base no termo de pesquisa
        const filteredBySearchTerm = productsToDisplay.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigo.toLowerCase().includes(searchTerm.toLowerCase())  // Permitindo pesquisa pelo código
        );

        const sortedProducts = sortProducts(filteredBySearchTerm);
        setFilteredProducts(sortedProducts);
    }, [selectedSector, groupedProducts, products, sortType, searchTerm]);

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

    const getStatusIcon = (quantidade: number, quantidadeMin: string) => {
        const min = parseInt(quantidadeMin, 10);
        if (quantidade <= min) {
            return <FaExclamationCircle color="red" size={30} title="Urgência" />;
        } else if (quantidade > min && quantidade <= min + 20) {
            return <FaExclamationTriangle color="orange" size={30} title="Atenção" />;
        } else {
            return <FaCheckCircle color="green" size={30} title="OK" />;
        }
    };

    // Função para gerar o PDF com autoTable e incluir data e hora no nome do arquivo
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Controle de Estoque", 20, 20);

        // Obter data e hora atuais
        const currentDate = new Date();
        const dateString = currentDate.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const dateStringPDF = currentDate.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        // Adicionar a data e hora no canto superior direito
        doc.setFontSize(10);
        doc.text(dateString, 180, 20, { align: "right" });

        // Adicionar o nome do setor como subtítulo
        doc.setFontSize(14);
        const sectorTitle = selectedSector === 'Todos' ? 'Todos os Setores' : `Setor: ${selectedSector}`;
        doc.text(sectorTitle, 20, 30);

        const tableColumn = ["Produto", "Código", "Quantidade Mínima", "Quantidade no Estoque", "Status"];

        const getStatus = (quantidade: number, quantidadeMin: string) => {
            const min = parseInt(quantidadeMin, 10);
            if (quantidade <= min) {
                return "Urgente";
            } else if (quantidade <= min + 20) {
                return "Atenção";
            } else {
                return "OK";
            }
        };

        const sortedProducts = filteredProducts.sort((a, b) => {
            const statusA = getStatus(a.quantidade, a.quantidadeMin);
            const statusB = getStatus(b.quantidade, b.quantidadeMin);

            const priority = { Urgente: 1, Atenção: 2, OK: 3 };

            return priority[statusA] - priority[statusB];
        });

        const tableRows = sortedProducts.map(product => [
            product.name,
            product.codigo,
            product.quantidadeMin,
            product.quantidade,
            getStatus(product.quantidade, product.quantidadeMin)
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40, // Começar a tabela logo após o subtítulo
        });

        // Gerar o nome do arquivo com a data
        const fileName = `controle_estoque_${dateStringPDF}.pdf`;
        doc.save(fileName);
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

                        <button onClick={generatePDF} className={styles.buttonPDF}>
                            <FaRegFilePdf />
                        </button>
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

                            {/* Campo de Pesquisa */}
                            <input
                                type="text"
                                placeholder="Pesquisar produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.buscar}

                            />
                        </div>
                        <div className={styles.tabela}>
                            {filteredProducts.length === 0 ? (
                                <p>Nenhum produto encontrado.</p>
                            ) : (
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th onClick={() => setSortType(sortType === 'nome' ? null : 'nome')} className={styles.cursor}>
                                                Produto
                                            </th>
                                            <th>Código</th>
                                            <th>Quantidade Mínima</th>
                                            <th onClick={() => setSortType(sortType === 'estoque' ? null : 'estoque')} className={styles.cursor}>
                                                Quantidade no Estoque
                                            </th>
                                            <th>Preço</th>
                                            <th>Status</th>
                                            <th>Imagem</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.codigo}</td>
                                                <td>{product.quantidadeMin}</td>
                                                <td>{product.quantidade}</td>
                                                <td>R$ {product.price}</td>
                                                <td>{getStatusIcon(product.quantidade, product.quantidadeMin)}</td>
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
                                                        color='#1a77e1' size={25}
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

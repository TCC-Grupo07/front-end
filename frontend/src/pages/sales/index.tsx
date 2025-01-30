// import Head from 'next/head';
// import { useState, useEffect } from 'react';
// import { canSSRAuth } from '../../utils/canSSRAuth';
// import { Header } from '../../components/Header';
// import { setupAPIClient } from '../../services/api';
// import styles from "./styles.module.scss";
// import { toast } from 'react-toastify';

// let url = "http://localhost:3333";

// interface Product {
//     id: string;
//     codigo: string;
//     name: string;
//     quantidade: number;
//     price: string;
//     banner: string;
//     quantidadeMin: string;
// }

// interface SalesProps {
//     products: Product[];
// }

// const Sales: React.FC<SalesProps> = ({ products }) => {
//     const [searchTerm, setSearchTerm] = useState<string>('');  // Estado para armazenar o termo de pesquisa
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Produtos filtrados
//     const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);  // Carrinho de compras
//     const [total, setTotal] = useState(0);  // Total do carrinho
//     const [isCartOpen, setIsCartOpen] = useState(false);  // Controle da visibilidade do modal

//     // Filtrar os produtos com base no termo de pesquisa
//     useEffect(() => {
//         const filtered = products.filter((product) =>
//             product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             product.codigo.toLowerCase().includes(searchTerm.toLowerCase())  // Permitir pesquisa pelo código
//         );
//         setFilteredProducts(filtered);
//     }, [searchTerm, products]);

//     // Calcular o total do carrinho
//     useEffect(() => {
//         const calculateTotal = () => {
//             const newTotal = cart.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
//             setTotal(newTotal);
//         };

//         calculateTotal();
//     }, [cart]);

//     // Função para adicionar produto ao carrinho
//     const handleAddToCart = (product: Product, quantity: number = 1) => {
//         if (product.quantidade <= 0) {
//             toast.error('Produto fora de estoque!');
//             return;  // Não adiciona ao carrinho se o estoque for menor ou igual a 0
//         }

//         const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
//         if (existingProductIndex > -1) {
//             const updatedCart = [...cart];
//             updatedCart[existingProductIndex].quantity += quantity;
//             setCart(updatedCart);
//         } else {
//             setCart([...cart, { product, quantity }]);
//         }

//         toast.success(`Produto ${product.name} adicionado ao carrinho com quantidade ${quantity}!`);
//     };

//     // Função para alterar a quantidade no carrinho
//     const handleChangeQuantity = (productId: string, quantity: number) => {
//         const updatedCart = cart.map(item => {
//             if (item.product.id === productId) {
//                 return { ...item, quantity };
//             }
//             return item;
//         });
//         setCart(updatedCart);
//     };

//     // Remover produto do carrinho
//     const handleRemoveFromCart = (productId: string) => {
//         const updatedCart = cart.filter(item => item.product.id !== productId);
//         setCart(updatedCart);
//     };

//     // Função para finalizar a compra
//     const handleCheckout = async () => {
//         try {
//             const apiClient = setupAPIClient();
//             const response = await apiClient.post('/sale', { cart });

//             if (response.status === 200) {
//                 toast.success('Compra realizada com sucesso!');
//                 // Resetar o carrinho após sucesso
//                 setCart([]);
//                 setIsCartOpen(false);  // Fecha o modal após a compra
//             } else {
//                 toast.error('Erro ao realizar a compra. Tente novamente.');
//             }
//         } catch (error) {
//             toast.error('Erro ao realizar a compra. Tente novamente.');
//             console.error(error);
//         }
//     };

//     // Abrir o modal do carrinho
//     const openCartModal = () => {
//         setIsCartOpen(true);
//     };

//     // Fechar o modal do carrinho
//     const closeCartModal = () => {
//         setIsCartOpen(false);
//     };

//     // Função para tratar a pesquisa com quantidade
//     const handleSearch = () => {
//         // Verificar se a pesquisa contém um '*'
//         const regex = /^(\d+)\*([a-zA-Z0-9]+)$/; // Regex para capturar quantidade e código/nome
//         const match = searchTerm.match(regex);

//         if (match) {
//             const quantity = parseInt(match[1]);  // Quantidade
//             const searchValue = match[2];  // Nome ou código do produto

//             // Encontrar o produto com base no nome ou código
//             const product = products.find(
//                 p => p.name.toLowerCase().includes(searchValue.toLowerCase()) || p.codigo.toLowerCase().includes(searchValue.toLowerCase())
//             );

//             if (product) {
//                 handleAddToCart(product, quantity);
//             } else {
//                 toast.error('Produto não encontrado.');
//             }
//         } else {
//             toast.error('Digite a pesquisa no formato "quantidade*produto"');
//         }
//     };

//     return (
//         <>
//             <Head>
//                 <title>Painel de Vendas</title>
//             </Head>
//             <div>
//                 <Header />
//                 <main className={styles.container}>
//                     <div className={styles.row1}>

//                         <h1>Painel de Vendas</h1>

//                         <button className={styles.cartButton} onClick={openCartModal}>
//                             Ver Carrinho
//                         </button>
//                     </div>

//                     <div className={styles.searchContainer}>
//                         <input
//                             type="text"
//                             placeholder="Pesquise por nome ou código"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}  // Aciona a pesquisa ao pressionar Enter
//                             className={styles.searchInput}
//                         />
//                     </div>








//                     {/* Campo de Pesquisa */}


//                     {/* Tabela de Produtos */}
//                     <div className={styles.tableContainer}>
//                         <table className={styles.productTable}>
//                             <thead>
//                                 <tr>
//                                     <th>Nome</th>
//                                     <th>Código</th>
//                                     <th>Valor Unitário</th>
//                                     <th>Quantidade no estoque</th>
//                                     <th>Visualização</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredProducts.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={5}>Nenhum produto encontrado.</td>
//                                     </tr>
//                                 ) : (
//                                     filteredProducts.map((product) => (
//                                         <tr
//                                             key={product.id}
//                                             onClick={() => handleAddToCart(product)}
//                                             style={product.quantidade <= 0 ? { backgroundColor: '#f8d7da' } : {}}

//                                         >
//                                             <td>{product.name}</td>
//                                             <td>{product.codigo}</td>
//                                             <td>R$ {product.price}</td>
//                                             <td>{product.quantidade}</td>
//                                             <td>
//                                                 <img
//                                                     src={`${url}/files/${product.banner}`}
//                                                     alt={product.name}
//                                                     className={styles.bannerImage}
//                                                 />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>



//                     {/* Modal do Carrinho */}
//                     {isCartOpen && (
//                         <div className={styles.modal}>
//                             <div className={styles.modalContent}>
//                                 <button className={styles.closeButton} onClick={closeCartModal}>
//                                     Fechar
//                                 </button>
//                                 <h2>Carrinho de Compras</h2>

//                                 {/* Tabela de Itens do Carrinho */}
//                                 <table className={styles.cartTable}>
//                                     <thead>
//                                         <tr>
//                                             <th>Produto</th>
//                                             <th>Quantidade</th>
//                                             <th>Preço Unitário</th>
//                                             <th>Total</th>
//                                             <th>Ação</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {cart.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan={5}>Seu carrinho está vazio.</td>
//                                             </tr>
//                                         ) : (
//                                             cart.map((item) => (
//                                                 <tr key={item.product.id}>
//                                                     <td className={styles.tdAcao}>{item.product.name}</td>
//                                                     <td>
//                                                         <input
//                                                             type="number"
//                                                             min="1"
//                                                             value={item.quantity}
//                                                             onChange={(e) => handleChangeQuantity(item.product.id, parseInt(e.target.value))}
//                                                             className={styles.quantidade}
//                                                         />
//                                                         <tr></tr>
//                                                     </td>
//                                                     <td>R$ {item.product.price}</td>
//                                                     <td>R$ {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
//                                                     <td className={styles.tdAcao}>
//                                                         <button onClick={() => handleRemoveFromCart(item.product.id)} className={styles.remove}>Remover</button>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>

//                                 <div className={styles.cartTotal}>
//                                     <strong>Total: R$ {total.toFixed(2)}</strong>
//                                 </div>

//                                 <button className={styles.checkoutButton} onClick={handleCheckout}>
//                                     Finalizar Compra
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </main>
//             </div >
//         </>
//     );
// };

// export const getServerSideProps = canSSRAuth(async (ctx) => {
//     const apiClient = setupAPIClient(ctx);
//     try {
//         const response = await apiClient.get('/product');
//         return {
//             props: {
//                 products: response.data,
//             },
//         };
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         return {
//             props: {
//                 products: [],
//             },
//         };
//     }
// });

// export default Sales;





import Head from 'next/head';
import { useState, useEffect } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { FaCartPlus } from "react-icons/fa";

let url = "http://localhost:3333";

interface Product {
    id: string;
    codigo: string;
    name: string;
    quantidade: number;
    price: string;
    banner: string;
    quantidadeMin: string;
}

interface SalesProps {
    products: Product[];
}

const Sales: React.FC<SalesProps> = ({ products }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');  // Estado para armazenar o termo de pesquisa
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Produtos filtrados
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);  // Carrinho de compras
    const [total, setTotal] = useState(0);  // Total do carrinho
    const [isCartOpen, setIsCartOpen] = useState(false);  // Controle da visibilidade do modal

    // Filtrar os produtos com base no termo de pesquisa
    useEffect(() => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigo.toLowerCase().includes(searchTerm.toLowerCase())  // Permitir pesquisa pelo código
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Calcular o total do carrinho
    useEffect(() => {
        const calculateTotal = () => {
            const newTotal = cart.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
            setTotal(newTotal);
        };

        calculateTotal();
    }, [cart]);

    // Função para adicionar produto ao carrinho
    const handleAddToCart = (product: Product, quantity: number = 1) => {
        if (product.quantidade <= 0) {
            toast.error('Produto fora de estoque!');
            return;  // Não adiciona ao carrinho se o estoque for menor ou igual a 0
        }

        const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
        if (existingProductIndex > -1) {
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += quantity;
            setCart(updatedCart);
        } else {
            setCart([...cart, { product, quantity }]);
        }

        toast.success(`Produto ${product.name} adicionado ao carrinho com quantidade ${quantity}!`);
    };

    // Função para alterar a quantidade no carrinho
    const handleChangeQuantity = (productId: string, quantity: number) => {
        const updatedCart = cart.map(item => {
            if (item.product.id === productId) {
                return { ...item, quantity };
            }
            return item;
        });
        setCart(updatedCart);
    };

    // Remover produto do carrinho
    const handleRemoveFromCart = (productId: string) => {
        const updatedCart = cart.filter(item => item.product.id !== productId);
        setCart(updatedCart);
    };

    // Função para finalizar a compra
    const handleCheckout = async () => {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/sale', { cart });

            if (response.status === 200) {
                toast.success('Compra realizada com sucesso!');
                // Resetar o carrinho após sucesso
                setCart([]);
                setIsCartOpen(false);  // Fecha o modal após a compra
            } else {
                toast.error('Erro ao realizar a compra. Tente novamente.');
            }
        } catch (error) {
            toast.error('Erro ao realizar a compra. Tente novamente.');
            console.error(error);
        }
    };

    // Abrir o modal do carrinho
    const openCartModal = () => {
        setIsCartOpen(true);
    };

    // Fechar o modal do carrinho
    const closeCartModal = () => {
        setIsCartOpen(false);
    };

    // Função para tratar a pesquisa com quantidade
    const handleSearch = () => {
        // Verificar se a pesquisa contém um '*'
        const regex = /^(\d+)\*([a-zA-Z0-9]+)$/; // Regex para capturar quantidade e código/nome
        const match = searchTerm.match(regex);

        if (match) {
            const quantity = parseInt(match[1]);  // Quantidade
            const searchValue = match[2];  // Nome ou código do produto

            // Encontrar o produto com base no nome ou código
            const product = products.find(
                p => p.name.toLowerCase().includes(searchValue.toLowerCase()) || p.codigo.toLowerCase().includes(searchValue.toLowerCase())
            );

            if (product) {
                handleAddToCart(product, quantity);
            } else {
                toast.error('Produto não encontrado.');
            }
        } else {
            toast.error('Digite a pesquisa no formato "quantidade*produto"');
        }
    };

    return (
        <>
            <Head>
                <title>Painel de Vendas</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.row1}>
                        <h1>Painel de Vendas</h1>
                        <button className={styles.cartButton} onClick={openCartModal}>
                            Ver Carrinho
                        </button>
                    </div>

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Pesquise por nome ou código"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}  // Aciona a pesquisa ao pressionar Enter
                            className={styles.searchInput}
                        />
                    </div>

                    {/* Tabela de Produtos */}
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>Valor Unitário</th>
                                    <th>Quantidade no estoque</th>
                                    <th>Visualização</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>Nenhum produto encontrado.</td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} style={product.quantidade <= 0 ? { backgroundColor: '#f8d7da' } : {}}>
                                            <td>{product.name}</td>
                                            <td>{product.codigo}</td>
                                            <td>R$ {product.price}</td>
                                            <td>{product.quantidade}</td>
                                            <td>
                                                <img
                                                    src={`${url}/files/${product.banner}`}
                                                    alt={product.name}
                                                    className={styles.bannerImage}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className={styles.addToCartButton}
                                                    disabled={product.quantidade <= 0}
                                                >
                                                    <FaCartPlus size={25} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal do Carrinho */}
                    {isCartOpen && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <button className={styles.closeButton} onClick={closeCartModal}>
                                    Fechar
                                </button>
                                <h2>Carrinho de Compras</h2>

                                {/* Tabela de Itens do Carrinho */}
                                <table className={styles.cartTable}>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Quantidade</th>
                                            <th>Preço Unitário</th>
                                            <th>Total</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.length === 0 ? (
                                            <tr>
                                                <td colSpan={5}>Seu carrinho está vazio.</td>
                                            </tr>
                                        ) : (
                                            cart.map((item) => (
                                                <tr key={item.product.id}>
                                                    <td className={styles.tdAcao}>{item.product.name}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleChangeQuantity(item.product.id, parseInt(e.target.value))}
                                                            className={styles.quantidade}
                                                        />
                                                    </td>
                                                    <td>R$ {item.product.price}</td>
                                                    <td>R$ {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
                                                    <td className={styles.tdAcao}>
                                                        <button onClick={() => handleRemoveFromCart(item.product.id)} className={styles.remove}>Remover</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                <div className={styles.cartTotal}>
                                    <strong>Total: R$ {total.toFixed(2)}</strong>
                                </div>

                                <button className={styles.checkoutButton} onClick={handleCheckout}>
                                    Finalizar Compra
                                </button>
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

export default Sales;

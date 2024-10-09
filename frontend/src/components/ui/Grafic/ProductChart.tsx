
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
// import { useEffect, useState } from 'react';

// interface Product {
//     name: string;
//     quantidade: number;
//     quantidadeMin: string; // Mantendo como string para coincidir com a sua interface original
// }

// interface ProductChartProps {
//     products: Product[]; // Definindo a prop corretamente
// }

// const ProductChart: React.FC<ProductChartProps> = ({ products }) => {
//     const [data, setData] = useState<{ name: string; quantidade: number; quantidadeMin: number }[]>([]);

//     useEffect(() => {
//         const productsData = products.map(product => ({
//             name: product.name,
//             quantidade: product.quantidade,
//             quantidadeMin: parseInt(product.quantidadeMin, 10), // Convertendo para número
//         }));

//         setData(productsData);
//     }, [products]);

//     return (
//         <BarChart width={600} height={300} data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="quantidade" fill="#009C86" />
//             <Bar dataKey="quantidadeMin" fill="#FF5733" />
//         </BarChart>
//     );
// };

// export default ProductChart;



// ProductChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss'; 

interface Product {
    name: string;
    quantidade: number;
    quantidadeMin: string;
}

interface ProductChartProps {
    products: Product[];
}

const ProductChart: React.FC<ProductChartProps> = ({ products }) => {
    const [data, setData] = useState<{ name: string; quantidade: number; quantidadeMin: number }[]>([]);

    useEffect(() => {
        const productsData = products.map(product => ({
            name: product.name,
            quantidade: product.quantidade,
            quantidadeMin: parseInt(product.quantidadeMin, 10),
        }));

        setData(productsData);
    }, [products]);

    return (
        <div className={styles.chartContainer}>
            <h2>Gráfico de Estoque</h2>
            <BarChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#009C86" />
                <Bar dataKey="quantidadeMin" fill="#FF5733" />
            </BarChart>
        </div>
    );
};

export default ProductChart;

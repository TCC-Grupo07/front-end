import Head from 'next/head'
import { ChangeEvent, useState, FormEvent } from 'react'
import styles from "./styles.module.scss"
import { canSSRAuth } from '../../utils/canSSRAuth'
import { Header } from '../../components/Header'
import { FiUpload } from 'react-icons/fi'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'

type ItemProps = {
    id: string
    name: string
}

interface SectorProps {
    sectorList: ItemProps[];
}

export default function Product({ sectorList }: SectorProps) {

    const [avatarUrl, setAvatarUrl] = useState('')
    const [imageAvatar, setImageAvatar] = useState(null)
    const [sectors, setSectors] = useState(sectorList || [])
    const [sectorSelected, setSectorSelected] = useState(0)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [quantidadeMin, setQuantidadeMin] = useState('')

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return

        const image = e.target.files[0]
        if (!image) return

        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    function handleChangeSector(event) {
        setSectorSelected(event.target.value)
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault()

        try {
            const data = new FormData()

            if (name === '' || price === '' || description === '' || imageAvatar === null || quantidadeMin === '') {
                toast.warning("PREENCHA TODOS OS CAMPOS")
                return
            }

            data.append('name', name)
            data.append('price', price)
            data.append('description', description)
            data.append('sector_id', sectors[sectorSelected].id)
            data.append('file', imageAvatar)
            data.append('quantidadeMin', quantidadeMin)

            const apiClient = setupAPIClient()
            await apiClient.post('/product', data)

            toast.success("CADASTRADO COM SUCESSO!")

        } catch (err) {
            toast.error("Ops... ERRO AO CADASTRAR")
        }

        setName('')
        setPrice('')
        setDescription('')
        setAvatarUrl('')
        setQuantidadeMin('')
        setImageAvatar(null)
    }

    return (
        <>
            <Head>
                <title>Novo Produto - StockPro</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color='#000' />
                            </span>
                            <input type="file" accept="image/png, image/jpg" onChange={handleFile} />
                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto do produto"
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>

                        <select value={sectorSelected} onChange={handleChangeSector}>
                            {sectors.map((item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Quantidade Minima"
                            className={styles.input}
                            value={quantidadeMin}
                            onChange={(e) => setQuantidadeMin(e.target.value)}
                        />

                        <textarea
                            placeholder="Descreva o seu produto..."
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type='submit'>
                            Cadastrar
                        </button>

                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/sector')

    const sectorList = response.data.sort((a: ItemProps, b: ItemProps) => {
        return a.name.localeCompare(b.name);
    });

    return {
        props: {
            sectorList
        }
    }
})

import Head from 'next/head'
import { ChangeEvent, useState, FormEvent } from 'react'
import styles from './styles.module.scss'
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
  sectorList: ItemProps[]
}

export default function Product({ sectorList }: SectorProps) {
  const [avatarUrl, setAvatarUrl] = useState('')
  const [imageAvatar, setImageAvatar] = useState<File | null>(null)
  const [sectors, setSectors] = useState(sectorList || [])
  const [sectorSelected, setSectorSelected] = useState(0)
  const [codigo, setCodigo] = useState("")
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [quantidadeMin, setQuantidadeMin] = useState('')


  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    const image = e.target.files[0]
    if (!image) return

    if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
      toast.error('A imagem deve ser JPEG ou PNG!')
      return
    }

    if (image.size > 5 * 1024 * 1024) {
      toast.error('A imagem não pode ser maior que 5MB!')
      return
    }

    setImageAvatar(image)
    setAvatarUrl(URL.createObjectURL(image))
  }

  function handleChangeSector(event: ChangeEvent<HTMLSelectElement>) {
    setSectorSelected(Number(event.target.value))
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault()

    if (!name || !price || !quantidadeMin || !imageAvatar) {
      toast.warning('PREENCHA TODOS OS CAMPOS')
      return
    }

    try {
      const data = new FormData()

      data.append('codigo', codigo)
      data.append('name', name)
      data.append('price', price)
      data.append('description', description)
      data.append('sector_id', sectors[sectorSelected].id)
      data.append('file', imageAvatar)
      data.append('quantidadeMin', quantidadeMin)

      const apiClient = setupAPIClient()
      await apiClient.post('/product', data)

      toast.success('Produto cadastrado com sucesso!')

      setCodigo('')
      setName('')
      setPrice('')
      setDescription('')
      setAvatarUrl('')
      setQuantidadeMin('')
      setImageAvatar(null)
    } catch (err) {
      toast.error('Erro ao cadastrar o produto!')
    }
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

            <h3>Código</h3>
            <input
              type="text"
              placeholder="Digite o código do produto"
              className={styles.input}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />

            <h3>Nome</h3>
            <input
              type="text"
              placeholder="Digite o nome do produto"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />


            <h3>Setor</h3>
            <select value={sectorSelected} onChange={handleChangeSector}>
              {sectors.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.name}
                </option>
              ))}
            </select>

            <h3>Foto</h3>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={30} color="#000" />
              </span>
              <input type="file" accept="image/png, image/jpg" onChange={handleFile} />
              {avatarUrl && (
                <img
                  className={styles.preview}
                  src={avatarUrl}
                  alt="Foto do produto"
                  width="auto"
                />
              )}
            </label>

            <h3>Preço</h3>
            <input
              type="number"
              placeholder="Preço do produto"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <h3>Quantidade Mínima</h3>
            <input
              type="number"
              placeholder="Quantidade Mínima"
              className={styles.input}
              value={quantidadeMin}
              onChange={(e) => setQuantidadeMin(e.target.value)}
            />

            {/* <h3>Descrição</h3>
            <input
              placeholder="Descreva o seu produto..."
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  )
}

// Função getServerSideProps corrigida
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)

  try {
    const response = await apiClient.get('/sector')

    const sectorList = response.data.sort((a: ItemProps, b: ItemProps) => {
      return a.name.localeCompare(b.name)
    })

    // Certifique-se de retornar um objeto com 'props' para o Next.js
    return {
      props: {
        sectorList,
      },
    }
  } catch (err) {
    // Caso a API falhe, retornamos um objeto vazio
    return {
      props: {
        sectorList: [],
      },
    }
  }
})

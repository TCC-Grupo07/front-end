import { useContext } from 'react'

import Link from 'next/link'

import styles from './styles.module.scss'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

import Logo from "./logoMenu.svg"

import Image from 'next/image';


export function Header() {

    const { signOut } = useContext(AuthContext)
    return (
        <div className={styles.headerContent}>

            <Link href='/dashboard'>
                <Image src={Logo} width={190} height={60} alt="Logo do StockPro" className={styles.img} />
            </Link>

            <nav className={styles.menuNav}>
                <Link legacyBehavior href="/sector" >
                    <a className={styles.link}>Setor</a>
                </Link>

                <Link legacyBehavior href="/product" >
                    <a className={styles.link}>Produtos</a>
                </Link>

                <Link legacyBehavior href="/stock" >
                    <a className={styles.link}>Estoque</a>
                </Link>

                <button onClick={signOut}>
                    <FiLogOut color=' #009C86' size={24} />
                </button>
            </nav>
        </div>

    )
}
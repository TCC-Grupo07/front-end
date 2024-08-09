import { useContext } from 'react'

import Link from 'next/link'

import styles from './styles.module.scss'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

import Logo from "../../assets/logo.svg"

import Image from 'next/image';


export function Header() {

    const { signOut } = useContext(AuthContext)
    return (
        <header className={styles.headerContainer} >
            <div className={styles.headerContent}>

                <Link href='/dashboard'>
                <Image src={Logo} width={190} height={60} alt="Logo do StockPro"/>
                    {/* <img src='/logo.svg' width={190} height={60} alt="logo do StockPro" /> */}
                </Link>

                <nav className={styles.menuNav}>
                    <Link legacyBehavior href="/sector">

                        <a>Setor</a>
                    </Link>

                    <Link legacyBehavior href="/suppliers">
                        <a>Fornecedores</a>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#000' size={24} />
                    </button>
                </nav>
            </div>
        </header>
    )
}
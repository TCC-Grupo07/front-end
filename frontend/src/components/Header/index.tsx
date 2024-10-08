import { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import Logo from "./logoMenu.svg";
import Image from 'next/image';

export function Header() {
    const { user, signOut } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = () => {
        signOut();
        setMenuVisible(false); // Esconder o menu após logout
    };

    const toggleMenu = () => {
        setMenuVisible(prev => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setMenuVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.headerContent}>
            <Link href='/dashboard'>
                <Image src={Logo} width={190} height={60} alt="Logo do StockPro" className={styles.img} />
            </Link>

            <nav className={styles.menuNav}>
                <Link legacyBehavior href="/sector">
                    <a className={styles.link}>Setor</a>
                </Link>

                <Link legacyBehavior href="/product">
                    <a className={styles.link}>Produtos</a>
                </Link>

                <Link legacyBehavior href="/stock">
                    <a className={styles.link}>Estoque</a>
                </Link>

                <div className={styles.userMenu}>
                    <p>Olá, <span onClick={toggleMenu} className={styles.user}>
                        {user?.name}
                    </span></p>

                    {menuVisible && (
                        <div className={styles.dropdown} ref={dropdownRef}>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                <FiLogOut color='#d33' size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

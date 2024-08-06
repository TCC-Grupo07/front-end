import { ReactNode, ButtonHTMLAttributes } from 'react'



// import styles from './styles.module.scss'

import { FaSpinner } from 'react-icons/fa'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    Loading?: boolean,
    children: ReactNode
}

export function Button({ Loading, children, ...rest }: ButtonProps) {
    return (
        <button
            // className={styles.button}
            disabled={Loading}
            {...rest}
        >

            {Loading ? (
                <FaSpinner color='#fff' size={16} />
            ) : (
                <a >{children}</a>
            )}

        </button>
    )
}

// className={styles.buttonText}
import logo from '../assets/logo.png'
import '../Header.css'

export default function Header() {
    const handleGoHome = () => {
        window.location.assign('/')
    }

    return (
        <div className='header'>
            <button type='button' className='logo-button' onClick={handleGoHome} aria-label='Voltar para a página inicial'>
                <img className='logo' src={logo} alt='Provador Virtual' />
            </button>
            <button onClick={() => (window.location.hash = '#/admin')}>Admin</button>
        </div>
    )
}

import logo from '../assets/logo.png'
import '../Header.css'

export default function Header() {
    const handleGoHome = (event) => {
        event.preventDefault()
        window.location.hash = ''
        window.dispatchEvent(new Event('reset-app'))
        window.location.assign('/')
    }

    return (
        <div className='header'>
            <img className='logo' src={logo} alt="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }} />
            <button onClick={() => (window.location.hash = '#/admin')}>Admin</button>
        </div>
    )
}
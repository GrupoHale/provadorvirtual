import logo from '../assets/logo.png'
import '../Header.css'

export default function Header() {

    return (
        <div className='header'>
            <img className='logo' src={logo} alt="logo" onClick={() => (location.hash = '')} style={{ cursor: 'pointer' }} />
            <button onClick={() => (location.hash = '#/admin')}>Admin</button>
        </div>
    )
}
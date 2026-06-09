import logo from '../assets/logo.png'
import '../Header.css'

export default function Header() {
    return (
        <div className='header'>
            <img className='logo' src={logo} alt="logo" />
            
            <button>Admin</button>
        </div>
    )
}
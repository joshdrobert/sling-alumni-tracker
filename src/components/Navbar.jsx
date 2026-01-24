import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

import { Rocket as RocketIcon, User as UserIcon, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
    const { session } = useAuth()

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <header className="glass-panel">
            <nav className="container">
                <Link to="/" className="logo">
                    <RocketIcon style={{ display: 'inline', marginRight: '8px' }} />
                    Sling Alumni
                </Link>

                <div className="nav-links">
                    <Link to="/" className="btn btn-secondary">Directory</Link>

                    {session ? (
                        <>
                            <Link to="/profile" className="btn btn-secondary">
                                <UserIcon size={18} />
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn">
                            <LogIn size={18} />
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}

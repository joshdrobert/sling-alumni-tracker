import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

import { Rocket as RocketIcon, User as UserIcon, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
    const { session } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (session) {
            supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single()
                .then(({ data }) => setIsAdmin(data?.role === 'admin'))
        }
    }, [session])

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
                            {isAdmin && (
                                <Link to="/admin" className="btn btn-secondary">
                                    Admin
                                </Link>
                            )}
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

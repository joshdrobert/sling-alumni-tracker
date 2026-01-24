import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
        } else {
            window.location.href = '/'
        }
        setLoading(false)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>

                <h1>Welcome Back</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Sign in to access the directory.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Mail size={20} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                    </div>

                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Lock size={20} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                    </div>

                    <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    <p style={{ marginTop: '1.5rem', color: '#94a3b8' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

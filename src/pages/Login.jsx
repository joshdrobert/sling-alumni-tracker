import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, CheckCircle } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        })

        if (error) {
            alert(error.error_description || error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>

                {sent ? (
                    <div className="fade-in">
                        <CheckCircle size={64} color="#38bdf8" style={{ marginBottom: '1rem' }} />
                        <h1>Check your email</h1>
                        <p style={{ color: '#94a3b8' }}>We successfully sent a magic link to <strong>{email}</strong>.</p>
                    </div>
                ) : (
                    <>
                        <h1>Welcome Back</h1>
                        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Sign in with your email to access your profile.</p>

                        <form onSubmit={handleLogin}>
                            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail size={20} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                            </div>

                            <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                {loading ? 'Sending magic link...' : 'Send Magic Link'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

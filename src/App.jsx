import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import PublicProfile from './pages/PublicProfile'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './styles.css'

function App() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) checkOnboarding(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) checkOnboarding(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    async function checkOnboarding(session) {
        const { data } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', session.user.id)
            .single()

        // If no name, and we aren't already on the profile page, redirect
        if (!data?.first_name && window.location.pathname !== '/profile') {
            window.location.href = '/profile?onboarding=true'
        }
    }

    if (!supabase) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ color: '#38bdf8', marginBottom: '1rem' }}>Setup Required</h1>
                    <p style={{ marginBottom: '2rem', color: '#cbd5e1' }}>
                        The app is running, but it's not connected to Supabase yet.
                    </p>
                    <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong>1. Create a Supabase Project</strong></p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>2. Create a <code>.env</code> file</strong> in the root directory:</p>
                        <code style={{ display: 'block', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', color: '#fbbf24' }}>
                            VITE_SUPABASE_URL=your_url_here<br />
                            VITE_SUPABASE_ANON_KEY=your_key_here
                        </code>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        Check the <code>walkthrough.md</code> file for detailed instructions.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/user/:id" element={<PublicProfile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App

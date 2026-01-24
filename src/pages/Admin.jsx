import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Shield, ShieldAlert, Save } from 'lucide-react'

export default function Admin() {
    const { session } = useAuth()
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (session) {
            checkAdmin()
        }
    }, [session])

    async function checkAdmin() {
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        if (data?.role === 'admin') {
            setIsAdmin(true)
            fetchProfiles()
        } else {
            setLoading(false)
        }
    }

    async function fetchProfiles() {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching profiles:', error)
        else setProfiles(data || [])

        setLoading(false)
    }

    async function updateVal(id, field, value) {
        const { error } = await supabase
            .from('profiles')
            .update({ [field]: value })
            .eq('id', id)

        if (error) {
            alert('Error updating: ' + error.message)
        } else {
            // Optimistic update
            setProfiles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
        }
    }

    if (!session) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Please login.</div>

    if (!loading && !isAdmin) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <ShieldAlert size={48} color="#f87171" />
                <h1>Access Denied</h1>
                <p>You do not have administrative privileges.</p>
            </div>
        )
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '3rem 0' }}>
                <Shield size={32} color="#38bdf8" />
                <h1>Admin Dashboard</h1>
            </div>

            {loading ? (
                <div>Loading users...</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <strong>{user.first_name} {user.last_name}</strong>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={user.role || 'member'}
                                            onChange={(e) => updateVal(user.id, 'role', e.target.value)}
                                            style={{ padding: '0.25rem', width: 'auto', marginBottom: 0 }}
                                        >
                                            <option value="member">Member</option>
                                            <option value="student">Student</option>
                                            <option value="alumnus">Alumnus</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => {
                                                    const newName = prompt("Edit First Name:", user.first_name);
                                                    if (newName) updateVal(user.id, 'first_name', newName);
                                                }}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

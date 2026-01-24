import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Save, User } from 'lucide-react'

export default function Profile() {
    const { session } = useAuth()
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        profession_title: '',
        team_affiliation: '',
        bio: '',
        linkedin_url: '',
        cohort_year: new Date().getFullYear(),
        major: ''
    })

    useEffect(() => {
        if (session) {
            getProfile()
        }
    }, [session])

    async function getProfile() {
        setLoading(true)
        const { user } = session

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (!error && data) {
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                profession_title: data.profession_title || '',
                team_affiliation: data.team_affiliation || '',
                bio: data.bio || '',
                linkedin_url: data.linkedin_url || '',
                cohort_year: data.cohort_year || new Date().getFullYear(),
                major: data.major || ''
            })
        }
        setLoading(false)
    }

    async function updateProfile(e) {
        e.preventDefault()
        setUpdating(true)
        const { user } = session

        const updates = {
            id: user.id,
            ...formData,
            updated_at: new Date(),
        }

        const { error } = await supabase.from('profiles').upsert(updates)

        if (error) {
            alert(error.message)
        } else {
            const isOnboarding = new URLSearchParams(window.location.search).get('onboarding')
            if (isOnboarding) {
                window.location.href = '/'
            } else {
                alert('Profile updated successfully!')
            }
        }
        setUpdating(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (!session) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <p>Please login to view your profile.</p>
            </div>
        )
    }

    const isOnboarding = new URLSearchParams(window.location.search).get('onboarding')

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {isOnboarding ? (
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '1rem', color: '#38bdf8' }}>Welcome to Sling Alumni!</h1>
                    <p style={{ color: '#cbd5e1' }}>Please complete your profile to join the directory.</p>
                </div>
            ) : (
                <h1 style={{ marginBottom: '2rem' }}>Edit Profile</h1>
            )}

            <div className="glass-panel" style={{ padding: '2rem' }}>
                {loading ? (
                    <div>Loading profile...</div>
                ) : (
                    <form onSubmit={updateProfile}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ margin: '1.5rem 0' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Professional Title / Role</label>
                            <input
                                type="text"
                                name="profession_title"
                                placeholder="e.g. Software Engineer, Medical Student"
                                value={formData.profession_title}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Team / Company</label>
                                <input
                                    type="text"
                                    name="team_affiliation"
                                    value={formData.team_affiliation}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Cohort Year</label>
                                <input
                                    type="number"
                                    name="cohort_year"
                                    value={formData.cohort_year}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ margin: '1.5rem 0' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Bio</label>
                            <textarea
                                rows={4}
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about your journey..."
                            />
                        </div>

                        <div style={{ margin: '1.5rem 0' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <button className="btn" disabled={updating}>
                            <Save size={18} />
                            {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

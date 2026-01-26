import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Save, User, GraduationCap } from 'lucide-react'
import { UNIVERSITIES } from '../lib/constants'

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
        cohort_year: '',
        major: '',
        university: ''
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
                cohort_year: data.cohort_year || '',
                major: data.major || '',
                university: data.university || ''
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Cohort Year(s)</label>
                                <input
                                    type="text"
                                    name="cohort_year"
                                    placeholder="e.g. 2023, 2024"
                                    value={formData.cohort_year}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>University / Chapter</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="university"
                                        value={formData.university}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            paddingLeft: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--glass-border)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            color: formData.university ? 'white' : '#94a3b8',
                                            appearance: 'none',
                                            height: '46px'
                                        }}
                                    >
                                        <option value="" disabled>Select University</option>
                                        {UNIVERSITIES.map(uni => (
                                            <option key={uni} value={uni} style={{ color: 'black' }}>{uni}</option>
                                        ))}
                                    </select>
                                    <GraduationCap size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>LinkedIn URL</label>
                                <input
                                    type="url"
                                    name="linkedin_url"
                                    value={formData.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
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

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, MapPin, Briefcase, Linkedin, Mail, Calendar, User } from 'lucide-react'

export default function PublicProfile() {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [id])

    async function fetchProfile() {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()

        if (!error) {
            setProfile(data)
        }
        setLoading(false)
    }

    if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading profile...</div>
    if (!profile) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Profile not found.</div>

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={16} /> Back to Directory
            </Link>

            <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem', gap: '1rem' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', fontWeight: 'bold', color: 'white',
                        boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.4)'
                    }}>
                        {profile.first_name?.[0] || '?'}{profile.last_name?.[0] || '?'}
                    </div>

                    <div>
                        <h1 style={{ marginBottom: '0.5rem' }}>
                            {profile.first_name || 'Anonymous'} {profile.last_name || 'Alumnus'}
                        </h1>
                        <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: '20px',
                            background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.9rem',
                            textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600'
                        }}>
                            {profile.role || 'Member'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>

                    {/* Info Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Briefcase color="#94a3b8" />
                            <div>
                                <small style={{ display: 'block', color: '#94a3b8' }}>Profession / Title</small>
                                <span>{profile.profession_title || 'Not listed'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <MapPin color="#94a3b8" />
                            <div>
                                <small style={{ display: 'block', color: '#94a3b8' }}>Current Team / Company</small>
                                <span>{profile.team_affiliation || 'Not listed'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Calendar color="#94a3b8" />
                            <div>
                                <small style={{ display: 'block', color: '#94a3b8' }}>Cohort Year(s)</small>
                                <span>{profile.cohort_year || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Mail color="#94a3b8" />
                            <div>
                                <small style={{ display: 'block', color: '#94a3b8' }}>Email</small>
                                <a href={`mailto:${profile.email}`} style={{ color: 'var(--primary)' }}>{profile.email}</a>
                            </div>
                        </div>

                        {profile.linkedin_url && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Linkedin color="#94a3b8" />
                                <div>
                                    <small style={{ display: 'block', color: '#94a3b8' }}>LinkedIn</small>
                                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">View Profile</a>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Bio Section */}
                {profile.bio && (
                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} /> About
                        </h3>
                        <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>{profile.bio}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

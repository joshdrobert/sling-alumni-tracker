import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Briefcase } from 'lucide-react'

export default function Home() {
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchProfiles()
    }, [])

    async function fetchProfiles() {
        setLoading(true)
        // Fetch all profiles (RLS policies will filter what we can't see, but we set public=true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('last_name', { ascending: true })

        if (error) {
            console.error('Error fetching profiles:', error)
        } else {
            setProfiles(data || [])
        }
        setLoading(false)
    }

    const filteredProfiles = profiles.filter(profile => {
        const searchString = searchTerm.toLowerCase()
        const fullName = `${profile.first_name} ${profile.last_name}`.toLowerCase()
        const company = profile.profession_title?.toLowerCase() || ''

        return fullName.includes(searchString) || company.includes(searchString)
    })

    return (
        <div>
            <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Sling Alumni Network
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                    Connect with past and present members of the Sling Health community.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search color="#94a3b8" />
                <input
                    type="text"
                    placeholder="Search alumni by name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: 0, border: 'none', background: 'transparent' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading directory...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredProfiles.map(profile => (
                        <div key={profile.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{profile.first_name} {profile.last_name}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{profile.role} {profile.cohort_year && `'${profile.cohort_year.toString().slice(-2)}`}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                                {profile.profession_title && (
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <Briefcase size={16} color="#38bdf8" />
                                        <span>{profile.profession_title}</span>
                                    </div>
                                )}
                                {profile.team_affiliation && (
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <MapPin size={16} color="#818cf8" />
                                        <span>{profile.team_affiliation}</span>
                                    </div>
                                )}
                            </div>

                            {profile.bio && (
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: 'auto' }}>
                                    {profile.bio.length > 100 ? profile.bio.substring(0, 100) + '...' : profile.bio}
                                </p>
                            )}

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('View details not implemented in this demo')}>
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

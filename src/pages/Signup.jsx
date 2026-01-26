import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Briefcase, MapPin, Calendar, Linkedin, Phone, GraduationCap } from 'lucide-react'
import { UNIVERSITIES } from '../lib/constants'

export default function Signup() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        profession_title: '',
        team_affiliation: '',
        cohort_year: '',
        phone_number: '',
        linkedin_url: '',
        bio: '',
        university: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    profession_title: formData.profession_title,
                    team_affiliation: formData.team_affiliation,
                    cohort_year: formData.cohort_year,
                    phone_number: formData.phone_number,
                    linkedin_url: formData.linkedin_url,
                    bio: formData.bio,
                    university: formData.university
                }
            }
        })

        if (error) {
            alert(error.message)
        } else {
            alert('Success! Check your email to confirm your account.')
            window.location.href = '/login'
        }
        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <form onSubmit={handleSignup}>

                    {/* Account Info */}
                    <h3 style={{ marginBottom: '1rem', color: '#38bdf8' }}>Login Details</h3>
                    <div style={{ margin: '1rem 0' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                        </div>
                    </div>
                    <div style={{ margin: '1rem 0' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} />
                            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0' }} />

                    {/* Profile Info */}
                    <h3 style={{ marginBottom: '1rem', color: '#38bdf8' }}>Profile Information</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>First Name</label>
                            <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Last Name</label>
                            <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ margin: '1rem 0' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Current Role / Title</label>
                        <div style={{ position: 'relative' }}>
                            <input type="text" name="profession_title" required placeholder="e.g. Founder, Student, Engineer" value={formData.profession_title} onChange={handleChange} />
                            <Briefcase size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Team / Company</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" name="team_affiliation" value={formData.team_affiliation} onChange={handleChange} />
                                <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Sling Health Year(s)</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" name="cohort_year" placeholder="e.g. 2023, 2024" value={formData.cohort_year} onChange={handleChange} />
                                <Calendar size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>University / Chapter</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    name="university"
                                    required
                                    value={formData.university}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        paddingLeft: '12px', /* Standard padding */
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: formData.university ? 'white' : '#94a3b8',
                                        appearance: 'none'
                                    }}
                                >
                                    <option value="" disabled>Select University</option>
                                    {UNIVERSITIES.map(uni => (
                                        <option key={uni} value={uni} style={{ color: 'black' }}>{uni}</option>
                                    ))}
                                </select>
                                <GraduationCap size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>LinkedIn URL</label>
                            <div style={{ position: 'relative' }}>
                                <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                                <Linkedin size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Bio</label>
                        <textarea rows={3} name="bio" placeholder="Short bio..." value={formData.bio} onChange={handleChange} />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Phone (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                            <Phone size={18} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                        </div>
                    </div>

                    <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log in</Link>
                    </p>

                </form>
            </div>
        </div>
    )
}

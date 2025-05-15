import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProfileTest() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: 64}}>Loading...</div>;

  if (!user) {
    return <div style={{textAlign: 'center', marginTop: 64}}>You are not logged in. Please log in to view your profile.</div>;
  }

  return (
    <div style={{maxWidth: 600, margin: '48px auto', padding: 24, background: '#fafafa', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
      <h2 style={{marginBottom: 24}}>Your Supabase User Profile</h2>
      <pre style={{background: '#f6f6f6', padding: 24, borderRadius: 8, fontSize: 16}}>
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  );
} 
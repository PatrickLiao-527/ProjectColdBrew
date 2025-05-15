import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Welcome() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    if (user && profile) {
      router.replace('/welcome');
    }
  }, [user, profile, router]);

  if (loading) return <div style={{textAlign: 'center', marginTop: 64}}>Loading...</div>;

  if (!user || !profile) {
    return <div style={{textAlign: 'center', marginTop: 64}}>You are not logged in. Please log in to view this page.</div>;
  }

  return (
    <div style={{maxWidth: 600, margin: '48px auto', padding: 24, background: '#fafafa', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
      <h2 style={{marginBottom: 24}}>
        Welcome {profile.name || profile.email},<br />
        thanks for becoming a <span style={{color: '#8F6B58', fontWeight: 700}}>{profile.role}</span>!
      </h2>
    </div>
  );
} 
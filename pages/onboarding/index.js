import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/OnboardingWelcome.module.css';
import OnboardingButton from '../../components/OnboardingButton';
import LoginForm from '../../components/LoginForm';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function OnboardingWelcome() {
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState(null); // 'mentor' or 'mentee'
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleIdentity = (role) => {
    setIdentity(role);
    setStep(3);
  };

  // OAuth handler
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : undefined,
      },
    });
    if (error) alert('OAuth login failed: ' + error.message);
  };

  // On mount, check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Fetch user data from 'users' table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserData(data);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: 64}}>Loading...</div>;

  if (user && userData) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Welcome | ColdBrew</title>
        </Head>
        <div className={styles.centered}>
          <h2>Current User Data</h2>
          <pre style={{textAlign: 'left', background: '#f6f6f6', padding: 24, borderRadius: 8, maxWidth: 500, margin: '0 auto'}}>
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome | ColdBrew</title>
      </Head>
      <div className={styles.centered}>
        {step !== 3 && (
          <Image
            src="/icons/coffee-cup.svg"
            alt="Coffee Cup Icon"
            width={151}
            height={158}
            className={styles.icon}
          />
        )}
        <h1 className={styles.welcomeHeading}>
          <span className={styles.gold}>Welcome To</span> <span className={styles.coffee}>ColdBrew</span>
        </h1>
        {step !== 3 && (
          <p className={styles.subtitle}>
            One chat away from what's next.<br />
            Let your story brew...
          </p>
        )}
        {step === 1 && (
          <div className={styles.buttonRow}>
            <OnboardingButton
              variant="primary"
              onClick={() => setStep(2)}
            >
              Get Started
            </OnboardingButton>
          </div>
        )}
        {step === 2 && (
          <div className={styles.dualButtonRow}>
            <OnboardingButton variant="primary" onClick={() => handleIdentity('mentee')}>
              Find a Mentor
            </OnboardingButton>
            <OnboardingButton variant="secondary" onClick={() => handleIdentity('mentor')}>
              Become a Mentor
            </OnboardingButton>
          </div>
        )}
        {step === 3 && (
          <div style={{marginTop: 24}}>
            <LoginForm identity={identity} onOAuthLogin={handleOAuthLogin} />
          </div>
        )}
      </div>
    </div>
  );
} 
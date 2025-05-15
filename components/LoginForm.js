import { useState } from 'react';
import Image from 'next/image';
import styles from './LoginForm.module.css';

export default function LoginForm({ onLogin, onOAuthLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Log in to your account</h2>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <div className={styles.passwordWrapper}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <button className={styles.loginBtn} onClick={() => onLogin?.(username, password)}>
        Log in
      </button>
      <div className={styles.socialDivider}></div>
      <button className={styles.socialBtn} onClick={() => onOAuthLogin?.('linkedin_oidc')}>
        <Image src="/icons/Socials/LinkedIn.svg" alt="LinkedIn" width={24} height={24} />
        Continue with Linkedin
      </button>
      <button className={styles.socialBtn} onClick={() => onOAuthLogin?.('google')}>
        <Image src="/icons/Socials/Google.svg" alt="Google" width={24} height={24} />
        Continue with Google
      </button>
      <div className={styles.signupRow}>
        Don&apos;t have an account? <a className={styles.signupLink} href="#">Sign up</a>
      </div>
    </div>
  );
} 
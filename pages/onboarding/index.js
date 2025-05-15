import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/OnboardingWelcome.module.css';
import OnboardingButton from '../../components/OnboardingButton';
import { useState } from 'react';

export default function OnboardingWelcome() {
  const [step, setStep] = useState(1);

  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome | ColdBrew</title>
      </Head>
      <div className={styles.centered}>
        <Image
          src="/icons/coffee-cup.svg"
          alt="Coffee Cup Icon"
          width={151}
          height={158}
          className={styles.icon}
        />
        <h1 className={styles.welcomeHeading}>
          <span className={styles.gold}>Welcome To</span> <span className={styles.coffee}>ColdBrew</span>
        </h1>
        <p className={styles.subtitle}>
          One chat away from what's next.<br />
          Let your story brew...
        </p>
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
            <OnboardingButton variant="primary">
              Find a Mentor
            </OnboardingButton>
            <OnboardingButton variant="secondary">
              Become a Mentor
            </OnboardingButton>
          </div>
        )}
      </div>
    </div>
  );
} 
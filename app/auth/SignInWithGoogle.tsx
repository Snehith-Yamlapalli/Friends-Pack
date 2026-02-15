'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import Image from 'next/image';

export default function SignInWithGoogle() {
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      if (result.user) {
        const user = result.user;
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          firstname: user.displayName,
          lastname: '',
          photo: user.photoURL,
        });
        window.location.href = '/';
      }
    });
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && googleLogin()}
        style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
        onClick={googleLogin}
      >
        <Image
          src="/google-signin-button.png"
          width={150}
          height={50}
          alt="Sign in with Google"
        />


      </div>
    </div>
  );
}

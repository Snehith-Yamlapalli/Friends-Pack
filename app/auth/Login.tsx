'use client';

import SignInWithGoogle from './SignInWithGoogle';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();


  return (
    <div className="container-fluid pixel-bg d-flex justify-content-center align-items-center min-vh-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes arrowBounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }
        
        .arrow-hover:hover .arrow-icon {
          animation: arrowBounce 0.6s ease-in-out infinite;
        }
      `}</style>
      <div className="pixel-wrapper p-5 text-center">

        <h1
          className="text-sm text-black sm:text-xl md:text-2xl lg:text-3xl font-black border-4 sm:border-6 md:border-8 border-black inline-block px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            transform: 'perspective(500px) rotateX(-2deg)',
            lineHeight: '1.6'
          }}
        >
          Welcome Back Viking
        </h1>
        <p className="pixel-sub mb-4">Continue with your account</p>

        <div className="pixel-divider mb-4"></div>

        <SignInWithGoogle />

      </div>
    </div>

  );
}

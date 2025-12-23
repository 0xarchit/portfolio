'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export const ReCaptchaProvider = ({ children, captchaKey }: { children: React.ReactNode; captchaKey: string | undefined }) => {
  
  if (!captchaKey) {
      console.warn('⚠️ [ReCaptcha] No captchaKey provided. Check your .env CAPTCHA_KEY.');
      return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={captchaKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

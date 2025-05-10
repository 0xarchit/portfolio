import '@/index.css';
import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: '0xArchit | Archit Jain | The Developer',
  description: "Hi, I'm Archit Jain, aka '0xArchit', a programmer and student in India. I love exploring and learning new Tech. Currently I am learning MERN Stack, Python and Ai Implementation, Cyber Security, Ethical Hacking, and many more. By keeping my self diverse in tech field and following my passion. I am a self-taught programmer. I enjoys reading business, stock and crypto market news in free time.",
  icons: {
    icon: '/0xarchit.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="0xArchit | Archit Jain | The Developer" />
        <meta name="description" content="Hi, I'm Archit Jain, aka '0xArchit', a programmer and student in India. I love exploring and learning new Tech. Currently I am learning MERN Stack, Python and Ai Implementation, Cyber Security, Ethical Hacking, and many more. By keeping my self diverse in tech field and following my passion. I am a self-taught programmer. I enjoys reading business, stock and crypto market news in free time." />
        <meta name="keywords" content="0xarchit, 0xArchit, Archit Jain, ArchitJain, Programmer, Coder, Technologist, Archit The Developer, Archit Jain The Developer" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="0xArchit" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="preload" href="/custom_cur.webp" as="image" type="image/webp" />
        <link rel="preconnect" href="https://files.0xarchit.is-a.dev" />
        <title>0xArchit | Archit Jain | The Developer</title>
      </head>
      <body className="bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-[#E6F1FF] overflow-x-hidden min-h-screen min-w-full">{children}</body>
    </html>
  );
}

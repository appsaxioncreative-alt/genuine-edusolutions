import "./globals.css";
import "./auth.css";

import { AuthProvider } from "@/context/AuthContext";

import ScrollUI from "@/components/ScrollUI";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import Tracker from "@/components/Tracker";

export const metadata = {
  title: "Genuine Edu-Solutions | Your Education, Your Future",
  description:
    "Genuine Edu-Solutions helps students explore admissions and course opportunities in Kerala and across India.",
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1b1a4e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ScrollUI />

          <div id="topbar-container">
            <TopBar />
          </div>

          <div id="header-container">
            <Header />
          </div>

          <main id="main-content">
            {children}
          </main>

          <Footer />
          <FloatingButtons />
          <Tracker />
        </AuthProvider>
      </body>
    </html>
  );
}
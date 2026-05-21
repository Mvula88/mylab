import "./globals.css";

export const metadata = {
  title: "Food Tests Lab",
  description: "NSSCO Biology Practical — Testing for Biological Molecules",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

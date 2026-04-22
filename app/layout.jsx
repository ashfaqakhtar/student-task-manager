import "./globals.css";

export const metadata = {
  title: "Smart Study Planner",
  description: "A premium student task manager for coursework, deadlines, and focus sessions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

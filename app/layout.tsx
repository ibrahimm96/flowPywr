import { Sidebar } from "@/components/sidebar"
import { AuthProvider } from "@/contexts/AuthContext"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 bg-white">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

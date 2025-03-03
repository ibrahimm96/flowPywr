"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BarChart2, Eye, LogOut, Menu, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Eye, label: "Model Visualization", href: "/model-visualization" },
  { icon: Upload, label: "Model Parameters and Inputs", href: "/upload" },
  { icon: BarChart2, label: "Analysis", href: "/analysis" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/auth")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <motion.aside
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 80 }}
      className="h-screen bg-gray-800 text-white flex flex-col"
    >
      {/* Logo and Toggle Button Container */}
      <motion.div className="relative p-4 flex flex-col items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-0 right-0 text-white focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <img src="/logo.png" alt="Logo" className="w-34 h-20" />
        {isOpen && (
          <h1 className="mt-2 text-xl font-bold">
            FlowPywr
          </h1>
        )}
      </motion.div>

      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => (
            <motion.li key={item.label} whileHover={{ scale: 1.05 }}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors duration-200",
                  "hover:bg-gray-700"
                )}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div className="p-4" whileHover={{ scale: 1.05 }}>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full p-3 rounded-lg transition-colors duration-200",
            "hover:bg-gray-700"
          )}
        >
          <LogOut className="w-6 h-6 mr-3" />
          {isOpen && <span>Logout</span>}
        </button>
      </motion.div>
    </motion.aside>
  )
}

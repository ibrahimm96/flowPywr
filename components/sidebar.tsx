"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BarChart2, Eye, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Eye, label: "Model Visualization", href: "/model-visualization" },
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
      <motion.div className="p-4 flex items-center justify-between" whileHover={{ scale: 1.05 }}>
        <motion.h1 initial={{ opacity: 1 }} animate={{ opacity: isOpen ? 1 : 0 }} className="text-xl font-bold">
          FlowPywr
        </motion.h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? "<<" : ">>"}
        </button>
      </motion.div>

      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => (
            <motion.li key={item.label} whileHover={{ scale: 1.05 }}>
              <Link
                href={item.href}
                className={cn("flex items-center p-3 rounded-lg transition-colors duration-200", "hover:bg-gray-700")}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <motion.span initial={{ opacity: 1 }} animate={{ opacity: isOpen ? 1 : 0 }}>
                  {item.label}
                </motion.span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div className="p-4" whileHover={{ scale: 1.05 }}>
        <button
          onClick={handleLogout}
          className={cn("flex items-center w-full p-3 rounded-lg transition-colors duration-200", "hover:bg-gray-700")}
        >
          <LogOut className="w-6 h-6 mr-3" />
          <motion.span initial={{ opacity: 1 }} animate={{ opacity: isOpen ? 1 : 0 }}>
            Logout
          </motion.span>
        </button>
      </motion.div>
    </motion.aside>
  )
}


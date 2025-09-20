"use client"

import { useAuth } from "@/lib/supabase/auth"
import { UserAvatar } from "@/components/user-avatar"
import Link from "next/link"
import { LogOut, Bell, Shield, Info, Palette, User } from "lucide-react"
import { motion } from "framer-motion"
import PageWrapper from "@/components/page-wrapper"
import { AppBottombar } from "@/components/app/bottombar"

export default function SettingsPage() {
  const { user, signOut } = useAuth()

	const menuItems = [
		{ href: "/app/profile", icon: <User className="h-5 w-5 text-gray-500" />, label: "Account", desc: "Profile, Email, Password" },
		{ icon: <Bell className="h-5 w-5 text-gray-500" />, label: "Notifications" },
		{ icon: <Palette className="h-5 w-5 text-gray-500" />, label: "Appearance" },
		{ icon: <Shield className="h-5 w-5 text-gray-500" />, label: "Privacy & Security" },
		{ icon: <Info className="h-5 w-5 text-gray-500" />, label: "About" }
	]
	
  return (
    <>
      <AppBottombar />
      <PageWrapper>
        <motion.div
          className="p-6 max-w-lg mx-auto space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Profile Section */}
          <motion.div
              className="flex flex-col items-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
          >
              <UserAvatar user={user} size={160} textSize={40} />
              <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.user_metadata?.full_name || "Guest"}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
          </motion.div>

          {/* Settings List */}
          <div className="space-y-2">
						<motion.div
							initial="hidden"
							animate="show"
							variants={{
								hidden: {},
								show: {
									transition: { staggerChildren: 0.1 }
								}
							}}
						>
              {menuItems.map((item, idx) => (
                  <motion.div
										key={idx}
										variants={{
											hidden: { opacity: 0, y: 20 },
											show: { opacity: 1, y: 0 }
										}}
                  >
                  {item.href ? (
										<Link
                      href={item.href}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary"
										>
                      <div className="flex items-center gap-3">
												{item.icon}
												<div>
													<p>
														{item.label}
													</p>
													<span className="text-xs text-secondary-foreground">{item.desc}</span>
												</div>
                      </div>
										</Link>
                  ) : (
                      <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-secondary">
                      <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                      </div>
                      </button>
                  )}
                  </motion.div>
              ))}

              {/* Logout */}
              <motion.div
								variants={{
									hidden: { opacity: 0, y: 20 },
									show: { opacity: 1, y: 0 }
								}}
              >
								<button
									onClick={signOut}
									className="w-full flex items-center justify-between p-4 border rounded-lg text-destructive hover:text-destructive-foreground hover:bg-destructive transition"
								>
                  <div className="flex items-center gap-3">
										<LogOut className="h-5 w-5" />
										<span>Logout</span>
                  </div>
								</button>
              </motion.div>
						</motion.div>
          </div>
        </motion.div>
      </PageWrapper>
    </>
  )
}

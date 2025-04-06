"use client"

import React, { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, User, Wallet, MessageSquare, Plus, Home, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

interface Chat {
  id: string
  title: string
}

export function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // Use localStorage to persist expanded state if available
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Initialize from localStorage on client side
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded')
    if (savedState) {
      setIsExpanded(JSON.parse(savedState) === true)
    }
  }, [])
  
  // Toggle sidebar expanded state
  const toggleSidebar = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    localStorage.setItem('sidebar-expanded', JSON.stringify(newState))
    
    // Dispatch custom event for layout to detect change
    window.dispatchEvent(new CustomEvent('sidebar-state-changed'))
  }
  
  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(isExpanded))
  }, [isExpanded])
  
  const [chats, setChats] = useState<Chat[]>([])
  
  // Fetch user's chats
  useEffect(() => {
    if (session?.user) {
      fetchChats()
    }
  }, [session])
  
  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chat")
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }
  
  const handleNewChat = () => {
    router.push("/chat/new")
    setIsOpen(false)
  }
  
  const onChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`)
    setIsOpen(false)
  }

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${!isExpanded ? "hidden md:hidden" : ""}`}>Pandit AI</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden md:flex" 
          onClick={toggleSidebar}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {session?.user ? (
          <>
            <nav className="mb-6 space-y-1">
              <Link href="/" 
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname === "/" 
                    ? "bg-secondary text-secondary-foreground" 
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-4 w-4" />
                {isExpanded && <span>Home</span>}
              </Link>
              <Link href="/profile" 
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname === "/profile" 
                    ? "bg-secondary text-secondary-foreground" 
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                {isExpanded && <span>Profile</span>}
              </Link>
              <Link href="/wallet" 
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname === "/wallet" 
                    ? "bg-secondary text-secondary-foreground" 
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Wallet className="h-4 w-4" />
                {isExpanded && <span>Wallet</span>}
              </Link>
            </nav>
            
            {isExpanded && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Chats</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0" 
                    onClick={handleNewChat}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {!isExpanded && (
              <Button 
                variant="outline" 
                size="icon"
                className="mb-4 w-full h-9"
                onClick={handleNewChat}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            
            <div className="space-y-1">
              {isExpanded ? (
                chats.length > 0 ? (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left ${
                        pathname === `/chat/${chat.id}` 
                          ? "bg-secondary text-secondary-foreground" 
                          : "hover:bg-secondary/50"
                      }`}
                      onClick={() => onChatClick(chat.id)}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{chat.title || "New Chat"}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No chats yet</p>
                )
              ) : (
                chats.length > 0 ? (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      className={`w-full flex justify-center rounded-lg py-2 text-sm ${
                        pathname === `/chat/${chat.id}` 
                          ? "bg-secondary text-secondary-foreground" 
                          : "hover:bg-secondary/50"
                      }`}
                      onClick={() => onChatClick(chat.id)}
                      title={chat.title || "New Chat"}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  ))
                ) : null
              )}
            </div>
            
            <div className="mt-auto pt-4">
              <Button 
                variant="outline" 
                className={`w-full ${isExpanded ? "justify-start" : "justify-center"}`}
                onClick={() => signOut()}
              >
                {isExpanded ? "Sign out" : <User className="h-4 w-4" />}
              </Button>
            </div>
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center space-y-4 mt-8 ${!isExpanded ? "hidden" : ""}`}>
            <p className="text-center text-sm text-muted-foreground">
              Sign in to access your chats and profile
            </p>
            <Button onClick={() => signIn("google")} className="w-full">
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar (sheet) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar (permanent) */}
      <div className={`hidden md:flex fixed inset-y-0 left-0 z-30 flex-col border-r bg-background transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}>
        <SidebarContent />
      </div>
    </>
  )
} 
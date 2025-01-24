"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Sparkles, Import, Copy, FileCode, Layout, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ComponentBuilder() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
            <span className="font-bold text-xl">BuildAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent animate-gradient">
            Design. Build. Ship.
          </h1>
          <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto dark:text-zinc-400">
            Transform your ideas into production-ready components with AI-powered assistance
          </p>

          {/* Command Input */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
            <div className="relative">
              <Input
                placeholder="Describe the component you want to build..."
                className="h-16 px-6 text-lg shadow-lg"
              />
              <Button className="absolute right-2 top-2 h-12" size="lg">
                Generate <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button variant="outline" className="group">
              <Copy className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              Clone from Screenshot
            </Button>
            <Button variant="outline" className="group">
              <Import className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
              Import from Figma
            </Button>
            <Button variant="outline" className="group">
              <FileCode className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Code to UI
            </Button>
            <Button variant="outline" className="group">
              <Layout className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform" />
              Templates
            </Button>
          </div>
        </section>

        {/* Templates Section */}
        <section className="container mx-auto px-4 py-16">
          <Tabs defaultValue="starter" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList>
                <TabsTrigger value="starter">Starter Templates</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="apps">Full Apps</TabsTrigger>
              </TabsList>
              <Button variant="ghost">Request Template</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={`/placeholder.svg?height=200&width=400`}
                        alt={`Template ${i}`}
                        width={400}
                        height={200}
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-zinc-50/10" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">Template Name {i}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        A brief description of what this template includes and what it can be used for.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </section>
      </div>
    </div>
  )
}


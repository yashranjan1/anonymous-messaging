"use client"
 
import dynamic from "next/dynamic"
import * as React from "react"

// to remove the hydration error
const NextThemesProvider = dynamic(
    () => import('next-themes').then((mod) => mod.ThemeProvider),
    { ssr: false }
)
 
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
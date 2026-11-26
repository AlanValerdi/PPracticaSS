import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { next } = await searchParams
  const returnPath = typeof next === "string" ? next : undefined

  return (
    <main
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12"
      style={{
        backgroundColor: "#f7f8f6",
        backgroundImage:
          "radial-gradient(ellipse at 14% 16%, rgba(214, 232, 211, 0.72), transparent 35%), radial-gradient(ellipse at 88% 82%, rgba(242, 213, 228, 0.7), transparent 38%), linear-gradient(135deg, #fbfcfa 0%, #f5f7f5 52%, #faf8f7 100%)",
      }}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-45"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="#9ab5a0" strokeWidth="2">
          <path d="M-70 690C170 690 196 470 414 470s248 212 450 212 253-244 420-244 221 104 310 104" />
          <path d="M-90 240c180 0 212 175 385 175s236-220 420-220 211 189 390 189 226-142 422-142" />
          <path d="M228 930c0-162 152-188 152-326s-126-180-126-310" />
          <path d="M1110-20c0 175-142 212-142 362s154 185 154 342" />
        </g>
        <g fill="#a66a18" stroke="#f7f8f6" strokeWidth="8">
          <circle cx="414" cy="470" r="11" />
          <circle cx="864" cy="682" r="11" />
          <circle cx="1284" cy="438" r="11" />
          <circle cx="295" cy="415" r="11" />
          <circle cx="715" cy="195" r="11" />
          <circle cx="1160" cy="384" r="11" />
        </g>
      </svg>

      <Card className="relative z-10 w-full max-w-lg gap-0 rounded-3xl border border-border/80 bg-background/95 p-4 shadow-xl shadow-foreground/10 ring-1 ring-foreground/5 backdrop-blur-sm sm:p-8">
        <Button
          variant="ghost"
          className="min-h-11 w-fit rounded-full px-3 text-muted-foreground hover:text-foreground"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <ArrowLeft aria-hidden="true" />
          Volver al inicio
        </Button>

        <div className="mt-5 flex flex-col items-center gap-4 sm:mt-6 sm:gap-5">
          <div className="flex items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary shadow-md shadow-foreground/10">
              <Image src="/programass-logo.svg" alt="" width={44} height={44} priority />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">PProgramaSS</span>
              <span className="text-sm text-muted-foreground">Prácticas y servicio social</span>
            </span>
          </div>
          <LoginForm className="w-full" returnPath={returnPath} />
        </div>
      </Card>
    </main>
  )
}

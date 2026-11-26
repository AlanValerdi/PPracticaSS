import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { getGoogleLoginHref } from "@/lib/auth-routes"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginForm({
  className,
  returnPath,
  ...props
}: React.ComponentProps<"div"> & { returnPath?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="gap-0 rounded-none border-0 bg-transparent py-4 shadow-none ring-0 backdrop-blur-none sm:py-5">
        <CardHeader className="items-center gap-3 pb-6 text-center sm:pb-8">
          <CardTitle className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Bienvenido de vuelta
          </CardTitle>
          <CardDescription className="text-center text-base">
            Ingresa con tu cuenta de Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="min-h-12 w-full rounded-xl text-base"
            variant="outline"
            nativeButton={false}
            render={<a href={getGoogleLoginHref(returnPath)} />}
          >
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Ingresar con Google
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}

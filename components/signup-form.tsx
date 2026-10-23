import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>
            Añade tu correo y 
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nombre Completo</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Correo</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Contraseña:</FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirmar Contraseña:
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Debe contener al menos 8 carácteres.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Crear Cuenta</Button>
                <FieldDescription className="text-center">
                  ¿Ya tienes una cuenta? <a href="/login">Ingresa aquí</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    
    </div>
  )
}

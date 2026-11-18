"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginToast, LoginToaster } from "@/components/login-toast"

const loginSchema = z.object({
  email: z.email({ error: "Format email tidak valid" }),
  password: z.string().min(1, { error: "Password wajib diisi" }),
})

type LoginValues = z.infer<typeof loginSchema>

interface FieldConfig {
  name: keyof LoginValues
  label: string
  type: "email" | "text" | "password"
  placeholder?: string
}

const fields: FieldConfig[] = [
  { name: "email", label: "Email", type: "email", placeholder: "Masukkan email Anda" },
  { name: "password", label: "Password", type: "password", placeholder: "Masukkan password Anda" },
]

export function LoginForm() {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    if (!success) return
    const timeout = window.setTimeout(() => router.replace("/dashboard"), 1200)
    return () => window.clearTimeout(timeout)
  }, [router, success])

  async function onSubmit(values: LoginValues) {
    try {
      loginToast.close()
      await loginToast.promise(
        (async () => {
          const result = await signIn("credentials", { ...values, redirect: false })
          if (!result || result.error || !result.ok) throw new Error("Login gagal")
          return result
        })(),
        {
          loading: {
            title: "Sedang masuk...",
            positionerProps: { anchor: document.getElementById("login-heading"), side: "top", align: "center", sideOffset: 16 },
          },
          success: { title: "Login berhasil", description: "Mengalihkan ke dashboard..." },
          error: { title: "Login gagal", description: "Periksa email dan password Anda." },
        }
      )
      setSuccess(true)
    } catch {
      return
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} >
          <LoginToaster />
      <FieldGroup className="gap-6">
        {fields.map((field) => (
          <Field key={field.name} data-invalid={!!errors[field.name]}>
            <FieldLabel htmlFor={`login-${field.name}`}>{field.label}</FieldLabel>
            <Input id={`login-${field.name}`} type={field.type} autoComplete={field.name === "password" ? "current-password" : field.name} placeholder={field.placeholder} className="h-12" aria-invalid={!!errors[field.name]} {...register(field.name)} />
            {errors[field.name] && <FieldError errors={[errors[field.name]]} />}
          </Field>
        ))}
        <Button type="submit" size="lg" className="h-12" disabled={isSubmitting || success}>
          {(isSubmitting || success) && <LoaderCircle data-icon="inline-start" className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {success ? "Mengalihkan..." : isSubmitting ? "Sedang masuk..." : "Masuk"}
        </Button>
      </FieldGroup>
    </form>
  )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller,  useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {  registerSchema } from "@/lib/schemas/auth.schema"
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

type FormValues = z.infer<typeof registerSchema>

 interface FieldConfig  {
 name: keyof FormValues
 label:string
 type: "email" | "text" | "password"
 placeholder?: string
}

const fields : FieldConfig[] =
[
  {
    name: "name",
    label: "Nama",
    type: "text",
    placeholder: "Masukan Nama Anda disini"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Masukan Email Anda disini"
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Masukan password Anda disini"
  },
]


type RegisterResponse = {
  success: boolean
  message: string
}


export function RegisterForm() {
  const [success, setSucces] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const {handleSubmit, setError, reset, control, formState : {isSubmitting, errors}} = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "", 
      password: ""
    },
  })

  async function onSubmit(values: FormValues) {
    setSucces("")
   try {

    const res = await axios.post<RegisterResponse>("/api/auth/register", values)

   if (!res.data.success) {
    setError("root.server", {
      type: "server",
      message: res.data.message
    })
    return
  }
  setSucces(res.data.message)
    
   } catch (error) {
    if (axios.isAxiosError<RegisterResponse>(error)) {
     setError("root.server", {
      type: "server",
       message: error.response?.data?.message ?? "Registrasi gagal, silakan coba lagi"
     })
    } else {
      setError("root.server", {
        type: "server",
        message: "Terjadi kesalahan pada server",
      });
    }
   }
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        {success ? (
          
          <>
            <Alert className="text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Berhasil Register</AlertTitle>
              <AlertDescription>
                <div className="flex flex-col gap-1">
                  {success}
                  <a href="/login">silahkan ke halaman login</a>
                </div>
              </AlertDescription>
              
            </Alert>
        
        </>
        ) : errors.root?.server ? 
        (
        
        <>
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Gagal</AlertTitle>
                  <AlertDescription>
                    {errors.root.server.message}
                  </AlertDescription>
                </Alert>

        </>
        
      ) : null
        
      }
      </div>

      <FieldGroup className="gap-6">
        {fields.map((item) => (
          <FieldGroup key={item.name} className="gap-5">
            <Controller
              control={control}
              name={item.name}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={item.name}>{item.label}</FieldLabel>
                  <div className="relative">
                    <Input {...field} id={item.name} autoComplete={item.name === "password" ? "new-password" : item.name} placeholder={item.placeholder} className={item.name === "password" ? "h-12 pr-12" : "h-12"} aria-invalid={fieldState.invalid} type={item.name === "password" && showPassword ? "text" : item.type}/>
                    {item.name === "password" && (
                      <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} aria-controls="password" aria-pressed={showPassword} className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                        {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
  
          </FieldGroup>
        ))}
        <Button type="submit" disabled={isSubmitting || Boolean(success)} size="lg" className="h-12">   {isSubmitting
          ? "Mendaftarkan..."
          : success
            ? "Berhasil"
            : "Buat akun"}
            </Button>
      
        {success && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSucces(null)
              reset()
            }}
          >
            Register Lagi
          </Button>
        )}
      </FieldGroup>
    </form>
  )
}

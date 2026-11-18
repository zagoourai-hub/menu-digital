"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { productSchema, type ProductFormInput, type ProductFormValues } from "../_lib/product.schema"
import { loginToast, LoginToaster } from "@/components/login-toast"

interface FieldConfig {
  name: Exclude<
    keyof ProductFormInput,
    "published"
  >;
  label: string;
  type: "text" | "number" | "textarea" | "file";
  placeholder?: string;
  description?: string;
}

const fields: FieldConfig[] = [
  { name: "title", label: "Nama produk", type: "text", placeholder: "Contoh: Es Teh Original" },
  { name: "price", label: "Harga (Rp)", type: "number", placeholder: "Contoh: 10000", description: "Masukkan harga dalam rupiah tanpa tanda pemisah." },
  { name: "description", label: "Deskripsi (opsional)", type: "textarea", placeholder: "Ceritakan tentang produk ini" },
  { name: "image", label: "Gambar produk", type: "file", description: "JPG, PNG, atau WebP. Maksimal 5MB."},
]

const emptyValues: ProductFormInput = { title: "", price: "", description: "", published: false, image: undefined }

interface ProductFormProps {
  mode?: "create" | "edit"
  initialValues?: ProductFormInput
  onSubmit?: (values: ProductFormValues) => Promise<{ success: boolean, message: string, }>
}

export function ProductForm({ mode = "create", initialValues, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [success, setSuccess] = useState<string | null>(null)
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  async function submit(values: ProductFormValues) {
    setSuccess(null)
    if (!onSubmit) {
      setError("root", { message: "Penyimpanan belum terhubung. Data belum disimpan." })
      return
    }
    try {
      loginToast.close()
      const res = await loginToast.promise(onSubmit(values), {
        loading: { title: "Menyimpan produk..." },
        success: { title: "Produk berhasil dibuat", description: "Mengalihkan ke daftar produk..." },
        error: { title: "Produk gagal disimpan", description: "Periksa kembali data dan coba lagi." },
      })

      if (!res.success) {
        setError("root", { message: res.message })
        return
      }

      setSuccess(res.message)
      if (mode === "create") {
        window.setTimeout(() => {
          router.push("/dashboard/produk")
          router.refresh()
        }, 1200)
      }
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "prduk gagak di simpan "
      })
    }
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit(submit)}>
      <LoginToaster />
      <FieldGroup className="gap-6">
        {errors.root && <Alert variant="destructive"><CircleAlert /><AlertTitle>Belum tersimpan</AlertTitle><AlertDescription>{errors.root.message}</AlertDescription></Alert>}
        {success && <Alert role="status"><AlertTitle>Berhasil</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>}

        {fields.map((item) => (
          <Controller
            key={item.name}
            name={item.name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`product-${item.name}`}>
                  {item.label}
                </FieldLabel>

                {item.type === "file" ? (
                  <Input
                    id={`product-${item.name}`}
                    type="file"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                    }}
                  />
                ) : item.type === "textarea" ? (
                  <Textarea
                    id={`product-${item.name}`}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={field.onChange}
                    placeholder={item.placeholder}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={`product-${item.name}`}
                    type={item.type}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={
                      typeof field.value === "string" ||
                        typeof field.value === "number"
                        ? field.value
                        : ""
                    }
                    onChange={field.onChange}
                    placeholder={item.placeholder}
                    min={item.type === "number" ? 0 : undefined}
                  />
                )}

                {item.description && (
                  <FieldDescription>
                    {item.description}
                  </FieldDescription>
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}

        <Controller name="published" control={control} render={({ field }) => (
          <Field orientation="horizontal">
            <input id="product-published" type="checkbox" name={field.name} ref={field.ref} checked={field.value} onChange={field.onChange} onBlur={field.onBlur} className="size-4 accent-primary" />
            <FieldLabel htmlFor="product-published">Publikasikan produk</FieldLabel>
          </Field>
        )} />
        <Button type="submit" size="lg" disabled={isSubmitting || (mode === "edit" && !initialValues)}>{isSubmitting ? "Menyimpan..." : mode === "edit" ? "Simpan perubahan" : "Simpan produk"}</Button>
      </FieldGroup>
    </form>
  )
}

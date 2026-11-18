import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { EditProductForm } from "../../_components/edit-product-form"
import { ProductEditorPanel } from "../../_components/product-editor-panel"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <ProductEditorPanel title="Edit produk" description={`Perbarui informasi produk · ID: ${id}`}>
      <Link href="/dashboard/produk" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke produk</Link>
      <EditProductForm key={id} id={id} />
    </ProductEditorPanel>
  )
}

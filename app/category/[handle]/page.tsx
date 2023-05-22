import React from "react"
import Products from "@/app/components/products"

type Props = {
  params: {
    handle: string
  }
}

const searchPage = async ({ params }: Props) => {
  const categoryParam = { q: `product_type:${params.handle}` }
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <Products search={categoryParam} />
    </div>
  )
}

export default searchPage

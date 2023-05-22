import React from "react"
import Products from "../components/products"

type Props = {
  searchParams?: {
    q?: string
  }
}

const searchPage = async ({ searchParams }: Props) => {
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <Products search={searchParams} />
    </div>
  )
}

export default searchPage

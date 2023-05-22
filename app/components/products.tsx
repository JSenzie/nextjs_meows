import { Key } from "react"
import { Storefront, formatPrice } from "../../utils/index"
import Link from "next/link"

const productsQuery = `
  query Products($query: String) {
    products(first: 8, query: $query) {
      edges {
        node {
          title
          handle
          id
          tags
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 1) {
            edges {
              node {
                url(transform: { preferredContentType: PNG })
                altText
              }
            }
          }
        }
      }
    }
  }
`

type Props = {
  search?: {
    q?: string
  }
}

export default async function Products({ search }: Props) {
  let formattedQuery = "available_for_sale:true"
  if (search?.q) {
    formattedQuery = search?.q + " AND available_for_sale:true"
  }

  const {
    data: { products },
  } = await Storefront(productsQuery, "no-store", { query: formattedQuery })

  type Product = {
    node: {
      title: string
      handle: string
      id: string
      tags: [string]
      priceRange: {
        minVariantPrice: {
          amount: string
        }
      }
      images: {
        edges: [
          {
            node: {
              url: string
              altText?: string
            }
          }
        ]
      }
    }
  }

  return (
    <div className={`${!search?.q ? "bg-slate-300" : "min-h-[80vh]"}`} id="products">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Products</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.edges.map((item: Product, index: Key) => {
            const product = item.node
            const image = product.images.edges[0]?.node
            return (
              <Link key={index} href={`/products/${product.handle}`}>
                <div className="group relative">
                  <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-slate-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img src={image?.url} alt={image?.altText} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <h3 className="text-lg text-slate-800">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </h3>
                      <p className="mt-1 text-md text-slate-600">{product.tags[0]}</p>
                    </div>
                    <p className="text-md font-medium text-slate-900">{formatPrice(product.priceRange.minVariantPrice.amount)}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

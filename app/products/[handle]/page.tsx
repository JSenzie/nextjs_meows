import { Storefront, formatPrice } from "@/utils"
import AddToCart from "../../components/addToCart"

const allHandlesQuery = `
  query Products {
    products(first: 250) {
      edges {
        node {
          handle
        }
      }
    }
  }
`

const singleProductQuery = `
  query SingleProduct($handle: String!) {
    productByHandle(handle: $handle) {
      title
      variants(first: 1){
        edges{
          node{
            id
          }
        }
      }
      description
      tags
      priceRange {
        minVariantPrice {
          amount
        }
      }
      images(first: 4) {
        edges {
          node {
            url(transform: { preferredContentType: PNG })
            altText
          }
        }
      }
    }
  }
`

type Handle = {
  node: {
    handle: string
  }
}

type SingleProduct = {
  data: {
    productByHandle: {
      title: string
      variants: {
        edges: [
          {
            node: {
              id: string
            }
          }
        ]
      }
      description: string
      tags: [string]
      priceRange: {
        minVariantPrice: {
          amount: string
        }
      }
      images: {
        edges: Array<{
          node: {
            url: string
            altText: string
          }
        }>
      }
    }
  }
}

export async function generateStaticParams() {
  const {
    data: {
      products: { edges },
    },
  } = await Storefront(allHandlesQuery, "no-cache")

  return edges.map((h: Handle) => ({
    handle: h.node.handle,
  }))
}

export default async function Product({ params }: { params: { handle: string } }) {
  const {
    data: { productByHandle },
  }: SingleProduct = await Storefront(singleProductQuery, "force-cache", { handle: params.handle })

  // create the page that is returned when an invalid product is passed into the slug
  if (productByHandle === null) {
    return "asd"
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block">
            <img src={productByHandle.images.edges[0]?.node.url} className="h-full w-full object-cover object-center" />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img src={productByHandle.images.edges[1]?.node.url} className="h-full w-full object-cover object-center" />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img alt={productByHandle.images.edges[2]?.node.url} className="h-full w-full object-cover object-center" />
            </div>
          </div>
          <div className="hidden lg:block aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img alt={productByHandle.images.edges[3]?.node.url} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{productByHandle.title}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900 border-b-2 pb-2">{formatPrice(productByHandle.priceRange.minVariantPrice.amount)}</p>

            <AddToCart itemID={productByHandle.variants.edges[0].node.id} />
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{productByHandle.description}</p>
              </div>
            </div>
            <div className="mt-10">
              <div className="mt-4 space-y-6">
                <ul className="text-sm text-gray-600 list-disc">
                  {productByHandle.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

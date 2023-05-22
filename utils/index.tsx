export async function Storefront(query: string, store: RequestCache, variables = {}) {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
    cache: store,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  return response.json()
}

export function formatPrice(number: string) {
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(parseFloat(number))
}

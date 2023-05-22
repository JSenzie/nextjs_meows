import Products from "./components/products"

export default function Home() {
  return (
    <main>
      <div className="px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-24 sm:py-32 lg:py-52">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Premium Styles, delivered</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="#products" className="rounded-md bg-slate-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-300">
                <span>Start Shopping</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* @ts-expect-error Server Component */}
      <Products />
    </main>
  )
}

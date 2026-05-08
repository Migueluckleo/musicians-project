import { Guitar, Search } from "lucide-react";

export function HomeSearchBox() {
  return (
    <form
      action="/proveedores"
      method="get"
      className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
      role="search"
    >
      <label className="flex flex-1 items-center gap-3 rounded-2xl border border-airbnb-border bg-white px-5 py-4 shadow-card transition-all focus-within:border-airbnb-dark hover:shadow-card-hover">
        <Guitar className="h-5 w-5 flex-shrink-0 text-airbnb-red" />
        <span className="sr-only">Buscar por género, evento o ciudad</span>
        <input
          type="search"
          name="q"
          className="min-w-0 flex-1 bg-transparent text-sm text-airbnb-dark outline-none placeholder:text-airbnb-gray"
          placeholder="Busca por género, evento o ciudad..."
          autoComplete="off"
        />
      </label>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-2xl bg-airbnb-red px-6 py-4 font-semibold text-white transition-colors hover:bg-airbnb-red-hover sm:flex-shrink-0"
      >
        <Search className="h-4 w-4" />
        Buscar
      </button>
    </form>
  );
}

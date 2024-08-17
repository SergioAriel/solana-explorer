import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"

export const  Search = () => {
    const router = useRouter()
    const [search, setSearch] = useState<string>('')

    return (
        <div className="flex w-full rounded bg-white">
            <input
                type="search"
                className="w-full border-none bg-transparent px-4 py-1 text-gray-900 focus:outline-none"
                placeholder="Write/Paste your Address here!"
                onChange={e => setSearch(e.target.value)}
            />
            <button
                className={`m-2 rounded px-4 py-2 font-semibold text-white ${(search) ? 'bg-purple-500' : 'bg-gray-500 cursor-not-allowed'}`}
                disabled={!search}
                onClick={() => {
                    if (!(router.asPath === `search/${search}`)) {
                        router.push({
                            pathname: `/[...search]`,
                            query: {
                                search: search
                            }
                        })
                    }
                }
                }
            >
                search
            </button>
        </div>
    )
}
import { Inter } from "next/font/google";
import { useState } from "react";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Address({ data }: any) {
    const router = useRouter()
    const [tabSelected, setTabSelected] = useState<string>('')
    return (

        <div className="flex flex-col bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="flex justify-between w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">Transactions</h3>
                        <button
                            onClick={() => {
                                router.push({
                                    pathname: `/transactions/[...transactions]`,
                                    query: {
                                      transactions: [router?.query?.search?.[0], data?.transactions[data?.transactions?.length - 1].signature]
                                    }
                                  })
                            }}
                        >
                            See More
                        </button>
                    </div>
                </div>
            </div>
            <table className="items-center bg-transparent h-96 w-full">
                <thead
                    className="block w-full"
                >
                    <tr
                        className="table table-fixed w-full"
                    >
                        <th className="px-6 bg-gray-200 text-gray-600 border border-solid py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                            Signature
                        </th>
                        <th className="px-6 bg-gray-200 text-gray-600 border border-solid py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                            Block
                        </th>
                        <th className="px-6 bg-gray-200 text-gray-600 border border-solid py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                            Time
                        </th>
                        <th className="px-6 bg-gray-200 text-gray-600 border border-solid py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                            By
                        </th>
                    </tr>
                </thead>

                <tbody
                    className="block w-full h-[calc(100%-3rem)] overflow-y-auto"
                >
                    {
                        data?.transactions && data?.transactions?.map((txn: any) => {

                            const time = new Date(txn.timestamp * 1000);
                            const fullTime = time.toUTCString();

                            return (
                                <tr
                                    key={txn.signature}
                                    className={`table table-fixed w-full text-left [&>:first-child]:text-black text-gray-500`}
                                >
                                    <th
                                        className=" border-t-0 truncate px-6 align-middle border-l-0 border-r-0 text-xs p-4 "

                                    >
                                        {txn.signature}
                                    </th>
                                    <th
                                        className=" border-t-0 items-center text-center truncate px-6 align-middle border-l-0 border-r-0 text-xs p-4 "

                                    >
                                        {txn.slot}
                                    </th>
                                    <th
                                        className=" border-t-0  truncate px-6 align-middle border-l-0 border-r-0 text-xs p-4 "

                                    >
                                        {/* { `${hours}:${minutes}:${seconds} ${month}/${date}/${year}` } */}
                                        {fullTime}
                                    </th>
                                    <th
                                        className=" border-t-0  truncate px-6 align-middle border-l-0 border-r-0 text-xs p-4 "

                                    >
                                        {
                                            txn.feePayer
                                        }
                                    </th>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>

        </div>
    );
}


export const getStaticPaths = (async () => {
    return {
        paths: [],
        fallback: true, // false or "blocking"
    }
})

export const getStaticProps = (async ({ params }) => {
    const apiKey = '0b5915a2-c7b0-4978-958c-08f66e389f82'
    const search = params?.transactions


    const infoAddress = async () => {
        const responseBalance = await fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'my-id',
                method: 'getAssetsByOwner',
                params: {
                    ownerAddress: search?.[0],
                    page: 1, // Starts at 1
                    limit: 50,
                    displayOptions: {
                        showFungible: true, //return both fungible and non-fungible tokens
                        showNativeBalance: true,
                    }
                },
            }),
        });
        const { result: infoAddress } = await responseBalance.json();
        if (infoAddress) {
            const urlTransaction = `https://api.helius.xyz/v0/addresses/${search?.[0]}/transactions?api-key=${apiKey}${search?.[1] ? `&before=${search?.[1]}` : ""}`
            const responseTransactions = await fetch(urlTransaction, {
                method: 'GET',
            });
            const transactions = await responseTransactions.json();
            if (transactions.length) {
                const data = {
                    type: "address",
                    transactions,
                    infoAddress
                }
                return { props: { data } }
            }
        }
        const data = {
            type: "address",
            infoAddress
        }
        return { props: { data } }
    }

    const responseStaticProp = await Promise.any([infoAddress()])

    return responseStaticProp



}) satisfies GetStaticProps<{
    data: {}
}>
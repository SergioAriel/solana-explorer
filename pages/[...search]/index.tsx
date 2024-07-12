import { Inter } from "next/font/google";
import { useState } from "react";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Address({ data }: any) {
  const router = useRouter()
  console.log(data)
  return (
    <>
      <div
        className="w-full bg-white h-56 p-4"
      >
        <div
          className="flex flex-col text-black "
        >
          <h4>Overview</h4>
          <div
            className="flex gap-4 text-sm"
          >
            <span>SOL</span>
            <span>
              {
                data?.balance?.nativeBalance?.lamports / 1000000000
              }
            </span>
            <span>$ {data?.balance?.nativeBalance?.total_price.toFixed(6)}</span>
          </div>

        </div>
      </div>

      <div
        className="flex gap-10"
      >
        <div className="flex flex-col bg-white w-1/2 h-96 overflow-y-auto shadow-lg rounded ">
          <div className="flex flex-col w-full max-w-full flex-grow flex-1">
            <div className="flex justify-between w-full px-4 h-12 items-center">
              <h3 className="font-semibold text-base text-gray-700">Transactions</h3>
            </div>
            <div
              className="flex flex-col"
            >
              <table
                className="w-full"
              >
                <thead>
                  <tr
                    className="bg-gray-200 text-gray-600 border border-solid"
                  >
                    <th>symbol</th>
                    <th>balance</th>

                  </tr>
                </thead>
                <tbody>
                  {
                    data?.balance?.items?.map((item: any) => {
                      if (item.token_info.price_info) {

                        console.log(10 ^ item.token_info.decimals)
                        return (
                          <tr
                            key={item.id}
                            className="[&>:first-child]:text-black text-gray-500"
                          >
                            <th>{item.token_info.symbol}</th>
                            <th>{(item.token_info.balance / (10 ** item.token_info.decimals)).toFixed(5)}</th>

                          </tr>
                        )
                      }
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="flex flex-col bg-white w-1/2  h-96 overflow-y-auto shadow-lg rounded ">
          <div className=" sticky top-0 bg-white rounded-t h-12  px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="flex justify-between w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-gray-700">Transactions</h3>
                <button
                  onClick={() => {

                    console.log([router?.query?.search?.[0], data?.transactions[data?.transactions?.length - 1].signature])
                    router.push({
                      pathname: `/transactions/[...transactions]`,
                      query: {
                        transactions: [router?.query?.search?.[0], data?.transactions[data?.transactions?.length - 1].signature]
                      }
                    })
                  }}
                >
                  SeeAll
                </button>
              </div>
            </div>
          </div>
          <table className="items-center bg-transparent w-full">
            <thead
              className="sticky top-12 w-full"
            >
              <tr
                className="table table-fixed w-full bg-gray-200 text-gray-600 border border-solid"
              >
                <th className="px-6 py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                  Signature
                </th>
                <th className="px-6 py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                  Block
                </th>
                <th className="px-6 py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                  Time
                </th>
                <th className="px-6 py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold ">
                  By
                </th>
              </tr>
            </thead>

            <tbody
              className="block w-full"
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
                        className=" border-t-0  truncate px-6 align-middle border-l-0 border-r-0 text-xs p-4 "

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
      </div>

    </>
  );
}


export const getStaticPaths = (async () => {
  return {
    paths: [],
    fallback: true, // false or "blocking"
  }
})

export const getStaticProps = (async ({ params }) => {

  const search = params?.search


  const infoAddress = async () => {
    const url = `https://mainnet.helius-rpc.com/?api-key=${process.env.API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          ownerAddress: search?.[0],
          tokenType: 'fungible',
          displayOptions: {
            showNativeBalance: true,
          },
          page: 1
        },
      }),
    });
    const { result: balance } = await response.json();

    console.log(balance)


    if (balance) {
      const urlTransaction = `https://api.helius.xyz/v0/addresses/${search?.[0]}/transactions?api-key=${process.env.API_KEY}`
      console.log(urlTransaction)
      const responseTransactions = await fetch(urlTransaction, {
        method: 'GET',
      });
      const transactions = await responseTransactions.json();
      if (transactions.length) {
        const data = {
          type: "address",
          transactions,
          balance
        }
        return { props: { data } }
      }
    }
    const data = {
      type: "address",
      balance
    }
    return { props: { data } }
  }

  const responseStaticProp = await Promise.any([infoAddress()])

  return responseStaticProp

}) satisfies GetStaticProps<{
  data: {}
}>
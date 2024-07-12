import { useState } from "react"
import { IconGraphUpArrow, IconGraphDownArrow } from "./icons"


export const Table = ({ title, tabTitles, tabList }: { title: string, tabTitles: string[], tabList: string[][] }) => {


    return (
        <div className="flex flex-col bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">{title}</h3>
                    </div>
                </div>
            </div>
            <table className="items-center bg-transparent w-full">
                <thead
                    className="table table-fixed w-full"
                >
                    <tr
                        className=""
                    >
                        {
                            tabTitles.map((title: string) => {
                                return (
                                    <th
                                        key={title}
                                        className=" px-6 bg-gray-200 text-gray-600  border border-solid py-3 text-xs uppercase border-l-0 border-r-0 text-ellipsis font-semibold "
                                        
                                    >
                                        {title}
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>

                <tbody
                    className="block w-full"
                >
                    {
                        tabList?.map((row, index) => {
                            return (
                                <tr
                                    key={row[0]}
                                    className={`table table-fixed w-full text-left [&>:first-child]:text-black text-gray-500`}
                                >
                                    {
                                        row?.map(text => {
                                            return <th
                                                className="table table-fixed w-full border-t-0 truncate px-6 align-middle border-l-0 border-r-0 text-xs p-4 "
                                                key={text}
                                            >
                                                {text}
                                            </th>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>

        </div>

    )
}
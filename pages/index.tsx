import React from "react"

import Head from "next/head"

import AgileLayout from "@/components/layout"
import AgileFooter from "@/components/footer"


function Home() {
    return (
        <>
            <Head>
                <title>Home / Agile</title>
                <meta name="description" content="Home"/>
                <link rel="icon" href="/favicon.png"/>
            </Head>
            <>TODO</>
            <AgileFooter />
        </>
    )
}

export default AgileLayout(Home)

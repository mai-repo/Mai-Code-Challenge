"use client"
import { Button } from "flowbite-react"

export default function CodeButton({ Scrape, GPTGenerate, Clear}) {

    return (

        <section className="flex flex-row justify-between">
            <Button className="text-lg bg-red-950" onClick={Scrape}>Generate</Button>
            <Button className="text-lg bg-teal-700" onClick={GPTGenerate}>GPT Generate</Button>
            <Button className="text-lg bg-amber-500 text-black" onClick={Clear}> Clear </Button>
        </section>



    )
}
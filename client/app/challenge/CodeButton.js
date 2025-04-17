"use client"
import { Button } from "flowbite-react"

export default function CodeButton({GPTGenerate, Clear}) {

    return (

        <section className="flex flex-row justify-between">
            <Button className="text-lg bg-red-950">Generate</Button>
            <Button className="text-lg bg-teal-700" onClick={GPTGenerate}>GPT Generate</Button>
            <Button className="text-lg bg-amber-500 text-black" onClick={Clear}> Clear </Button>
        </section>



    )
}
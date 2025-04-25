import CodeEditor from "./CodeEditor"
import Terminal from "./Terminal"


export default function codeChallenge(){

    return (
        <section className="p-20">
            <div className="flex justify-center gap-8 w-full items-stretch">
                <div className="w-1/2">
                    <Terminal/>
                </div>
                <div className="w-1/2">
                    <CodeEditor/>
                </div>
            </div>
        </section>
    )
}
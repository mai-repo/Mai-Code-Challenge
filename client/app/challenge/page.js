import CodeEditor from "./CodeEditor"
import Terminal from "./Terminal"


export default function codeChallenge(){

    return (
        <section className="p-20">
            <div className="flex flex-row justify-center gap-8 w-full">
                <div className="flex-1">
                    <Terminal/>
                </div>
                <div className="flex-1">
                    <CodeEditor/>
                </div>
            </div>
        </section>
    )
}
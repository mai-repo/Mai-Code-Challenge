import CodeEditor from "./CodeEditor"
import Terminal from "./Terminal"


export default function codeChallenge(){

    return (
        <section className="p-20 px-30">
            <div className="flex flex-row w-full g-8">
                <div className="flex-1 pr-20">
                    <Terminal/>
                </div>
                <div className="flex-1">
                    <CodeEditor/>
                </div>
            </div>
        </section>
    )
}
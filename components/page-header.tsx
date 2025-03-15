'use client'

export function PageHeader({ title, highlightedText, description }: { title: string, highlightedText: string, description: string }) {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                {title}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    {highlightedText}
                </span>
                .fun
            </h1>
            <p className="max-w-[600px] text-gray-400">
                {description}
            </p>
        </div>
    );
}

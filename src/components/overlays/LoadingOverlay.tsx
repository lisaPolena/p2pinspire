




export function LoadingOverlay() {

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-zinc-800 z-[14] opacity-50">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <div className="w-32 h-32 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl text-white">Loading...</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}


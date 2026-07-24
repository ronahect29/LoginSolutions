export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-6">
            <div className="h-6 w-6 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
        </div>
    );
}
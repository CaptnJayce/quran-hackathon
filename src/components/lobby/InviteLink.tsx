import { useState } from 'react'

export function InviteLink({ code }: { code: string }) {
	const [copied, setCopied] = useState(false)
	const url = `${window.location.origin}/?join=${code}`

	function copy() {
		navigator.clipboard.writeText(url)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="flex flex-col items-center gap-2 w-full max-w-md">
			<p className="text-stone-400 text-sm">Share this code with your circle</p>
			<div className="flex items-center gap-3 w-full px-4 py-3 bg-stone-800 rounded-xl">
				<span className="flex-1 font-mono text-xl tracking-widest text-emerald-400 text-center">{code}</span>
				<button
					onClick={copy}
					className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
				>
					{copied ? 'Copied!' : 'Copy link'}
				</button>
			</div>
		</div>
	)
}

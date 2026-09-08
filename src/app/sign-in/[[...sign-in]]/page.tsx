import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] px-4 py-24">
      <div className="w-full max-w-md relative z-10">
        <SignIn appearance={{
          elements: {
            card: "bg-[#0a0a0a] border border-white/10 shadow-2xl",
            headerTitle: "text-white font-mono",
            headerSubtitle: "text-zinc-400 font-mono",
            socialButtonsBlockButton: "border border-white/10 text-white hover:bg-white/5",
            dividerLine: "bg-white/10",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300 font-mono text-xs",
            formFieldInput: "bg-black border border-white/10 text-white focus:border-blue-500",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-500 font-mono text-sm uppercase tracking-widest",
            footerActionText: "text-zinc-400 font-mono text-xs",
            footerActionLink: "text-blue-400 hover:text-blue-300 font-mono text-xs"
          }
        }} />
      </div>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}

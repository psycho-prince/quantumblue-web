export function MigrationTimeline() {
  return (
    <div className="glass p-8 border border-border-bright">
      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-8">MIGRATION_TIMELINE</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border-bright" />
        <div className="space-y-6">
          {[
            { label: "Discovery", desc: "Cryptographic assets identified and inventoried" },
            { label: "Assessment", desc: "Risk scored: algorithm, data sensitivity, exposure" },
            { label: "Planning", desc: "Migration plan with before/after state defined" },
            { label: "Execution", desc: "Migration event recorded with state transition" },
            { label: "Evidence", desc: "SHA-256 hash, signature, timestamp created" },
            { label: "Verification", desc: "Independently verifiable proof of migration" },
          ].map((step, i) => (
            <div key={i} className="relative flex gap-4 pb-6">
              <div className="shrink-0 relative z-10 w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/50 flex items-center justify-center">
                <span className="text-accent-blue text-xs font-bold font-mono">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white font-mono uppercase tracking-widest">{step.label}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

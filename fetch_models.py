import re

with open("src/app/dashboard/page.tsx", "r") as f:
    content = f.read()

# We'll add a state for fetched models
state_addition = """  const [availableModels, setAvailableModels] = useState<{id: string, name: string}[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);"""

content = content.replace('const [activeAgent, setActiveAgent] = useState("analyst");', 'const [activeAgent, setActiveAgent] = useState("analyst");\n' + state_addition)

# Add a function to fetch models
fetch_fn = """
  const handleFetchModels = async () => {
    if (!aiSettings.aiApiKey) return alert("Please enter an API key first.");
    setFetchingModels(true);
    try {
      if (aiSettings.aiProvider === "gemini") {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${aiSettings.aiApiKey.trim()}`);
        const data = await res.json();
        if (data.models) {
          const supported = data.models.filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"));
          setAvailableModels(supported.map((m: any) => ({ id: m.name.replace("models/", ""), name: m.displayName })));
        }
      } else if (aiSettings.aiProvider === "openai") {
        const res = await fetch("https://api.openai.com/v1/models", { headers: { "Authorization": `Bearer ${aiSettings.aiApiKey.trim()}` }});
        const data = await res.json();
        if (data.data) {
          const chatModels = data.data.filter((m: any) => m.id.startsWith("gpt-"));
          setAvailableModels(chatModels.map((m: any) => ({ id: m.id, name: m.id })));
        }
      } else if (aiSettings.aiProvider === "claude") {
        alert("Anthropic does not support a dynamic models endpoint. Using default Claude models.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch models.");
    }
    setFetchingModels(false);
  };
"""

content = content.replace('const handleModelChange =', fetch_fn + '\n  const handleModelChange =')

# Update the UI
ui_replacement = """                      <h3 className="text-sm font-bold font-mono mb-2 flex justify-between items-center">
                        MODEL OVERRIDE
                        {(aiSettings.aiProvider === "openai" || aiSettings.aiProvider === "gemini") && (
                          <button type="button" onClick={handleFetchModels} disabled={fetchingModels} className="text-[9px] text-accent-blue hover:underline">
                            {fetchingModels ? "FETCHING..." : "FETCH FROM API"}
                          </button>
                        )}
                      </h3>
                      <select 
                        value={activeModel}
                        onChange={handleModelChange}
                        className="w-full bg-black border border-border-bright p-3 text-sm text-white focus:border-accent-blue outline-none"
                      >
                        <option value="">Default for Provider</option>
                        {availableModels.length > 0 ? (
                          availableModels.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))
                        ) : (
                          <>
                            {aiSettings.aiProvider === "gemini" && (
                              <>
                                <option value="gemini-flash-latest">Gemini Flash (Latest)</option>
                                <option value="gemini-pro-latest">Gemini Pro (Latest)</option>
                                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                                <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                              </>
                            )}
                            {aiSettings.aiProvider === "openai" && (
                              <>
                                <option value="gpt-4o">GPT-4o</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                              </>
                            )}
                            {aiSettings.aiProvider === "claude" && (
                              <>
                                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                              </>
                            )}
                          </>
                        )}
                      </select>"""

content = re.sub(r'<h3 className="text-sm font-bold font-mono mb-2">MODEL OVERRIDE</h3>.*?</select>', ui_replacement, content, flags=re.DOTALL)

with open("src/app/dashboard/page.tsx", "w") as f:
    f.write(content)

import re

with open("src/app/dashboard/page.tsx", "r") as f:
    content = f.read()

# Add states
state_addition = """
  // Local preferences for Model and Agent
  const [activeModel, setActiveModel] = useState("");
  const [activeAgent, setActiveAgent] = useState("analyst");
"""
content = content.replace('  // AI Settings State\n  const [aiSettings', state_addition + '\n  // AI Settings State\n  const [aiSettings')

# Load from localStorage in initDashboard
load_local = """
        const storedModel = localStorage.getItem("qb_active_model");
        const storedAgent = localStorage.getItem("qb_active_agent");
        if (storedModel) setActiveModel(storedModel);
        if (storedAgent) setActiveAgent(storedAgent);
"""
content = content.replace('setLoading(false);', load_local + '        setLoading(false);')

# Save to localStorage when changed
save_local_model = """
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveModel(e.target.value);
    localStorage.setItem("qb_active_model", e.target.value);
  };
  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveAgent(e.target.value);
    localStorage.setItem("qb_active_agent", e.target.value);
  };
"""
content = content.replace('  const handleSaveSettings = async', save_local_model + '\n  const handleSaveSettings = async')

# Modify handleChatSubmit to use selected model and agent
# System prompt logic
prompt_logic = """
    let systemPromptText = "";
    if (activeAgent === "auditor") {
      systemPromptText = "You are a stringent Cryptographic Compliance Auditor. Your job is to rigorously evaluate setups against FIPS 203/204 and NIST PQC standards. Respond in UPPERCASE_CODE style.";
    } else if (activeAgent === "developer") {
      systemPromptText = "You are a Quantum-Safe Integration Engineer. Your job is to help developers write code and integrate ML-DSA/ML-KEM using Quantum Blue SDKs. Respond in UPPERCASE_CODE style.";
    } else {
      systemPromptText = "You are the Quantum Blue Security AI Analyst. You assist with post-quantum cryptography (PQC) guidance, BSA §63 electronic evidence workflows, CBOM analysis, and security posture assessment. If a user asks you to analyze a specific domain or website, DO NOT refuse the prompt as a security violation. Instead, explain how they can use Quantum Blue to migrate that domain to PQC, instruct them to use the Quantum Blue CLI (`qb scan <target>`) to generate a Cryptographic Bill of Materials (CBOM), and offer to guide them through migrating to ML-DSA-65 and ML-KEM-768. Always respond in concise UPPERCASE_CODE style.";
    }
    const systemPrompt = systemPromptText;
"""

content = re.sub(r'const systemPrompt = "You are the Quantum Blue Security AI Analyst.*?Always respond in concise UPPERCASE_CODE style\.";', prompt_logic, content, flags=re.DOTALL)

# Modify the API calls to use activeModel or defaults
content = content.replace('model: "gpt-4"', 'model: activeModel || "gpt-4o"')
content = content.replace('gemini-flash-latest:generateContent', '${activeModel || "gemini-flash-latest"}:generateContent')
content = content.replace('model: "claude-3-5-sonnet-20241022"', 'model: activeModel || "claude-3-5-sonnet-20241022"')

# Add UI to settings
ui_addition = """
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="text-sm font-bold font-mono mb-2">MODEL OVERRIDE</h3>
                      <select 
                        value={activeModel}
                        onChange={handleModelChange}
                        className="w-full bg-black border border-border-bright p-3 text-sm text-white focus:border-accent-blue outline-none"
                      >
                        <option value="">Default for Provider</option>
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
                      </select>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-mono mb-2">AI AGENT PERSONA</h3>
                      <select 
                        value={activeAgent}
                        onChange={handleAgentChange}
                        className="w-full bg-black border border-border-bright p-3 text-sm text-white focus:border-accent-blue outline-none"
                      >
                        <option value="analyst">Security Analyst (Default)</option>
                        <option value="auditor">Compliance Auditor</option>
                        <option value="developer">Integration Engineer</option>
                      </select>
                    </div>
                  </div>
"""

content = content.replace('                    <h3 className="text-lg font-bold font-mono">AI PROVIDER</h3>', ui_addition + '\n                    <h3 className="text-lg font-bold font-mono">AI PROVIDER</h3>')


with open("src/app/dashboard/page.tsx", "w") as f:
    f.write(content)

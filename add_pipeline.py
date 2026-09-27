import re

with open("src/app/dashboard/page.tsx", "r") as f:
    content = f.read()

# Add the pipeline option to the UI
ui_opt = '<option value="developer">Integration Engineer</option>'
content = content.replace(ui_opt, ui_opt + '\\n                        <option value="pipeline">Multi-Agent Pipeline (Analyst \u2192 Auditor \u2192 Developer)</option>')

# Update handleChatSubmit to handle the pipeline logic
# Since this is a massive change to the chat submit logic, let's inject a pipeline runner before the standard fetch if activeAgent === 'pipeline'.
pipeline_logic = """
    if (activeAgent === "pipeline") {
      try {
        // Multi-Agent Pipeline Execution
        // 1. Analyst
        const analystPrompt = "You are the Quantum Blue Security AI Analyst. Analyze this request and provide a high-level PQC migration strategy.";
        let res1;
        if (provider === "gemini") {
          const r1 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${activeModel || "gemini-flash-latest"}:generateContent?key=${aiSettings.aiApiKey.trim()}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: analystPrompt + " Request: " + userMsg }] }] })
          });
          const d1 = await r1.json();
          res1 = d1.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else if (provider === "openai") {
          const r1 = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${aiSettings.aiApiKey.trim()}` },
            body: JSON.stringify({ model: activeModel || "gpt-4o", messages: [{ role: "system", content: analystPrompt }, { role: "user", content: userMsg }] })
          });
          const d1 = await r1.json();
          res1 = d1.choices?.[0]?.message?.content || "";
        }
        
        // 2. Auditor
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "Pipeline Step 1/3: Analyst generated strategy. Passing to Auditor..." }]);
        const auditorPrompt = "You are a Cryptographic Compliance Auditor. Review the following strategy against FIPS 203/204 and NIST standards. Correct any compliance issues.";
        let res2;
        if (provider === "gemini") {
          const r2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${activeModel || "gemini-flash-latest"}:generateContent?key=${aiSettings.aiApiKey.trim()}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: auditorPrompt + " Strategy: " + res1 }] }] })
          });
          const d2 = await r2.json();
          res2 = d2.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else if (provider === "openai") {
          const r2 = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${aiSettings.aiApiKey.trim()}` },
            body: JSON.stringify({ model: activeModel || "gpt-4o", messages: [{ role: "system", content: auditorPrompt }, { role: "user", content: res1 }] })
          });
          const d2 = await r2.json();
          res2 = d2.choices?.[0]?.message?.content || "";
        }

        // 3. Developer
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "Pipeline Step 2/3: Auditor validated compliance. Passing to Integration Engineer..." }]);
        const devPrompt = "You are an Integration Engineer. Take the following audited strategy and provide actionable implementation steps or code snippets using Quantum Blue SDKs.";
        let res3;
        if (provider === "gemini") {
          const r3 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${activeModel || "gemini-flash-latest"}:generateContent?key=${aiSettings.aiApiKey.trim()}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: devPrompt + " Audited Strategy: " + res2 }] }] })
          });
          const d3 = await r3.json();
          res3 = d3.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else if (provider === "openai") {
          const r3 = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${aiSettings.aiApiKey.trim()}` },
            body: JSON.stringify({ model: activeModel || "gpt-4o", messages: [{ role: "system", content: devPrompt }, { role: "user", content: res2 }] })
          });
          const d3 = await r3.json();
          res3 = d3.choices?.[0]?.message?.content || "";
        }

        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: `**MULTI-AGENT PIPELINE COMPLETE**\n\n**1. Analyst Strategy:**\n${res1}\n\n**2. Auditor Review:**\n${res2}\n\n**3. Developer Implementation:**\n${res3}` }]);
      } catch (e) {
        setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "PIPELINE_ERROR: API connection failed during multi-agent execution." }]);
      }
      setIsTyping(false);
      return;
    }
"""

# Insert pipeline_logic at the very beginning of the try block in handleChatSubmit
content = content.replace('    try {\n      let response: string;', '    try {\n' + pipeline_logic + '      let response: string;')

with open("src/app/dashboard/page.tsx", "w") as f:
    f.write(content)

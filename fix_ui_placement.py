with open("src/app/dashboard/page.tsx", "r") as f:
    content = f.read()

# I want to move it to the end of the form, just before the buttons.
# Let's find the added code block.
import re

ui_addition = r'''                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="text-sm font-bold font-mono mb-2">MODEL OVERRIDE</h3>.*?</div>
                  </div>'''

match = re.search(ui_addition, content, flags=re.DOTALL)
if match:
    block = match.group(0)
    content = content.replace(block + '\n', '')
    
    # insert before buttons
    btn_marker = '<div className="flex gap-4 items-center">'
    content = content.replace(btn_marker, block + '\n                  ' + btn_marker)

with open("src/app/dashboard/page.tsx", "w") as f:
    f.write(content)

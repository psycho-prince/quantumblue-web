import re
import os

base = '/home/kali/Desktop/quantumblue-web/'

fixes = {
    'src/app/dashboard/anomalies/page.tsx': [
        (r'useUser,?', r'')
    ],
    'src/app/dashboard/overview/page.tsx': [
        (r'useUser,?', r'')
    ],
    'src/app/dashboard/page.tsx': [
        (r'useOrganization,?', r'')
    ],
    'src/app/dashboard/scans/[id]/page.tsx': [
        (r'useUser,?', r'')
    ],
    'src/app/dashboard/scans/page.tsx': [
        (r'useUser,?', r'')
    ],
    'src/app/page.tsx': [
        (r'import \{ BriefingShield \} from "@/components/icons/BriefingShield";\n', r'')
    ],
    'src/components/CheckoutButton.tsx': [
        (r'catch \(err: any\)', r'catch (err)')
    ],
    'src/components/Stats.tsx': [
        (r'Activity,?', r'')
    ],
    'src/lib/zoho.ts': [
        (r'description: string', r'')
    ]
}

for file_path, replacements in fixes.items():
    full_path = os.path.join(base, file_path)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            content = f.read()
        for old, new in replacements:
            content = re.sub(old, new, content)
        with open(full_path, 'w') as f:
            f.write(content)


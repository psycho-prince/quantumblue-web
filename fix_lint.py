import re
import os

base = '/home/kali/Desktop/quantumblue-web/'

fixes = {
    'src/app/api/pqc-keys/route.ts': [
        (r'async function GET\(_req: NextRequest', r'async function GET(req: NextRequest')
    ],
    'src/app/blog/[slug]/page.tsx': [
        (r'catch \(e\)', r'catch')
    ],
    'src/app/dashboard/anomalies/page.tsx': [
        (r'const { userId: _unusedUserId } = await auth\(\);', r'await auth();')
    ],
    'src/app/dashboard/local/page.tsx': [
        (r'import Link from "next/link";\n', r'')
    ],
    'src/app/dashboard/overview/page.tsx': [
        (r'import { motion } from "framer-motion";\n', r''),
        (r'const { userId: _user } = await auth\(\);', r'await auth();')
    ],
    'src/app/dashboard/page.tsx': [
        (r' Activity,', r''),
        (r'const { userId, organization } = await auth\(\);', r'const { userId } = await auth();')
    ],
    'src/app/dashboard/scans/[id]/page.tsx': [
        (r'import { motion } from "framer-motion";\n', r''),
        (r'const { userId: user } = await auth\(\);', r'await auth();')
    ],
    'src/app/dashboard/scans/page.tsx': [
        (r'import { motion } from "framer-motion";\n', r''),
        (r'const { userId: user } = await auth\(\);', r'await auth();')
    ],
    'src/app/page.tsx': [
        (r'import { BriefingShield } from "@/components/icons/BriefingShield";\n', r''),
        (r'import Link from "next/link";\n', r'')
    ],
    'src/components/CheckoutButton.tsx': [
        (r'catch \(err: any\)', r'catch')
    ],
    'src/components/Hero.tsx': [
        (r' Cpu,', r'')
    ],
    'src/components/HowItWorks.tsx': [
        (r'import { motion } from "framer-motion";\n', r'')
    ],
    'src/components/Stats.tsx': [
        (r' ShieldCheck,', r''),
        (r' Globe,', r''),
        (r' Lock,', r''),
        (r' Activity,', r'')
    ],
    'src/components/VerificationSection.tsx': [
        (r' StorageData,', r'')
    ],
    'src/lib/zoho.ts': [
        (r'export async function createZohoTicket\(name: string, email: string, description: string\)', r'export async function createZohoTicket(name: string, email: string)')
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
        print(f"Fixed {file_path}")
    else:
        print(f"Not found: {full_path}")


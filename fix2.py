import re
import os

base = '/home/kali/Desktop/quantumblue-web/'

def fix_file(path, old, new):
    full_path = os.path.join(base, path)
    if os.path.exists(full_path):
        with open(full_path, 'r') as f:
            content = f.read()
        content = content.replace(old, new)
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Fixed {path}")

fix_file('src/app/api/pqc-keys/route.ts', 'async function GET(_req: NextRequest', 'async function GET(req: NextRequest')
fix_file('src/app/dashboard/anomalies/page.tsx', 'const { userId: _unusedUserId } = await auth();', 'await auth();')
fix_file('src/app/dashboard/overview/page.tsx', 'const { userId: _user } = await auth();', 'await auth();')
fix_file('src/app/dashboard/page.tsx', 'const { userId, organization } = await auth();', 'const { userId } = await auth();')
fix_file('src/app/dashboard/scans/[id]/page.tsx', 'const { userId: user } = await auth();', 'await auth();')
fix_file('src/app/dashboard/scans/page.tsx', 'const { userId: user } = await auth();', 'await auth();')
fix_file('src/app/page.tsx', 'import { BriefingShield } from "@/components/icons/BriefingShield";\n', '')
fix_file('src/components/CheckoutButton.tsx', 'catch (err: any)', 'catch (err)')
fix_file('src/components/Stats.tsx', 'Activity,', '')
fix_file('src/components/VerificationSection.tsx', 'StorageData,', '')
fix_file('src/lib/zoho.ts', 'export async function createZohoTicket(name: string, email: string, description: string)', 'export async function createZohoTicket(name: string, email: string)')


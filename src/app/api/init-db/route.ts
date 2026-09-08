import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function GET() {
  try {
    // Run prisma db push from inside the Render runtime container!
    // Since this executes during runtime (not build time), it has full access 
    // to the internal database URL.
    const { stdout, stderr } = await execPromise('npx prisma db push --accept-data-loss');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database schema successfully pushed!', 
      stdout, 
      stderr 
    });
  } catch (error: any) {
    console.error('DB Push Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error)
    }, { status: 500 });
  }
}

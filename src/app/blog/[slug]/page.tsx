import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = fileContent.match(frontmatterRegex);
  if (!match) return { data: {}, content: fileContent };

  const data: any = {};
  match[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let val: any = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')) ;
      }
      data[key.trim()] = val;
    }
  });

  return { data, content: fileContent.replace(frontmatterRegex, '').trim() };
}

function parseMarkdown(md: string) {
  const html = md
    // Headers
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-12 mb-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-12 mb-6">$1</h1>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-accent-blue pl-4 py-1 my-6 bg-accent-blue/5 text-zinc-300 italic">$1</blockquote>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Code blocks
    .replace(/```[a-z]*\n([\s\S]*?)\n```/gim, '<pre class="bg-[#111] p-4 rounded border border-border-bright overflow-x-auto my-6 text-accent-red font-mono text-xs"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-[#111] text-accent-red px-1 py-0.5 text-xs rounded">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-accent-blue hover:underline font-bold">$1</a>')
    // Paragraphs (double newline)
    .replace(/\n\n/gim, '</p><p class="my-6">');

  return '<p>' + html + '</p>';
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(postsDirectory)) return [];
  
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.filter(f => f.endsWith('.md')).map(filename => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postsDirectory = path.join(process.cwd(), 'content', 'blog');
  const filePath = path.join(postsDirectory, `${slug}.md`);
  
  let fileContents = '';
  try {
    fileContents = fs.readFileSync(filePath, 'utf8');
  } catch {
    return <div className="p-24 text-white">Post not found.</div>;
  }

  const { data, content } = parseFrontmatter(fileContents);
  const htmlContent = parseMarkdown(content);

  return (
    <div className="min-h-screen bg-black py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/blog" className="text-xs font-mono text-zinc-500 hover:text-accent-blue uppercase tracking-widest">
          &larr; Back to Engineering Blog
        </Link>
        
        <div className="space-y-6 pb-12 border-b border-border-bright">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {data.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span>{data.date}</span>
            <span>&bull;</span>
            <div className="flex gap-2">
              {Array.isArray(data.tags) ? data.tags.map((tag: string) => (
                <span key={tag} className="text-accent-blue">{tag}</span>
              )) : null}
            </div>
          </div>
        </div>

        <div 
          className="max-w-none font-mono text-sm leading-relaxed text-zinc-400"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

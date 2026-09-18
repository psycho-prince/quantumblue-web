import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = fileContent.match(frontmatterRegex);
  if (!match) return { data: {}, content: fileContent };

  const data: Record<string, any> = {};
  match[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let val = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')) as any;
      }
      data[key.trim()] = val;
    }
  });

  return {
    data,
    content: fileContent.replace(frontmatterRegex, '').trim()
  };
}

export default async function BlogIndex() {
  const postsDirectory = path.join(process.cwd(), 'content', 'blog');
  
  let posts: any[] = [];
  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    posts = filenames.filter(f => f.endsWith('.md')).map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = parseFrontmatter(fileContents);
      return {
        slug: filename.replace(/\.md$/, ''),
        ...data,
      };
    });
  }

  return (
    <div className="min-h-screen bg-black py-24 px-6 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            ENGINEERING BLOG
          </h1>
          <p className="text-zinc-500 max-w-2xl text-sm leading-relaxed">
            Technical guides, compliance standards, and migration playbooks for the post-quantum era.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group glass p-8 border border-border-bright hover:border-accent-blue transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white group-hover:text-accent-blue transition-colors">{post.title}</h2>
                <span className="text-xs text-zinc-500 whitespace-nowrap">{post.date}</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{post.description}</p>
              <div className="flex gap-3">
                {Array.isArray(post.tags) ? post.tags.map((tag: string) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-accent-blue bg-accent-blue/10 px-2 py-1">
                    {tag}
                  </span>
                )) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

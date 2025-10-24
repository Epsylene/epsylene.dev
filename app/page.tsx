import { formatDate, getPostMeta, getPostSlugs } from "@/lib/utils";

export default function Home() {
  const info = getPostSlugs().map(slug => {
    const meta = getPostMeta(slug);
    return { slug: slug, title: meta.title, date: meta.date };
  });

  // Sort posts by date descending
  info.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center mb-[5%]">
        <h1 className="text-4xl mb-12">
          epsylene
        </h1>
        <ul className="flex flex-col gap-3">
          {info.map((info) => (
            <li key={info.slug}>
              <span className="text-neutral-500 mr-3">
                {formatDate(info.date)}
              </span>
              <a href={`/blog/${info.slug}`} className="hover:underline">
                {info.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

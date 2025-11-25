import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center mb-[5%]">
        <h1 className="text-4xl mb-8">
          epsylene
        </h1>
        <div className="space-x-12 text-xl text-gray-300 [&>a]:hover:underline">
          <Link href="/projects">Projects</Link>
          {/* <Link href="/blog">Blog</Link> */}
        </div>
      </div>
    </div>
  );
}

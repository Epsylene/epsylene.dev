import { postComponents } from "./components/post";
import { getPost } from "@/lib/utils";
import { compileMDX } from "next-mdx-remote/rsc";

export default async function Home() {
  const source = getPost('home');
  const { content } = await compileMDX({
    source,
    components: postComponents,
  });

  return (
      <>
        <div className="flex items-center mb-8">
          <h1 className="text-4xl">
            epsylene
          </h1>
          <hr className="flex-1 mt-[0.5ch] ml-4 border-t border-[#a8a095]" />
        </div>
        <div>
          {content}
        </div>
      </>
  );
}

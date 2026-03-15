import Link from "next/link";
import { Heading } from "./components/headings";

export default function Home() {
  return (
      <>
        <div className="flex items-center mb-8">
          <h1 className="text-4xl">
            epsylene
          </h1>
          <hr className="flex-1 mt-[0.5ch] ml-4 border-t border-[#a8a095]" />
        </div>
        <div>
          <p className="mb-6">
            Welcome to my personal website. Here you can find <Link href="#about-me">information about me</Link>, <Link href="#code">links to my programming projects</Link>, <Link href="/notes">miscellaneous notes and writings</Link>, and <Link href="/etc">some other things</Link>.
          </p>
          <div className="mb-6">
            <Heading>About Me</Heading>
            <p className="mb-4">
              I’m a HPC research engineer, currently working for the <Link href="https://www.lsce.ipsl.fr/en/climat-cycles/calculs/">CALCULS</Link> team at CEA/LSCE. I like understanding how computers work, and I’m particularly interested in performance optimization and parallel programming.
            </p>
            <p>
              Outside of work, I enjoy reading about languages and history, cooking, and passing time with friends.
            </p>
          </div>
          <Heading>Code</Heading>
          <p>
            {/* TODO: put description + this in a MDX */}
            <em>Work in progress</em>
          </p>
        </div>
      </>
  );
}

import Link from "next/link";

export default function Etc() {
  return (
    <ul>
      <li>A page with words and their etymologies: <Link href="/etc/words">words</Link></li>
      <li>A book of quotes and passages: <Link href="/etc/excerpts">excerpts</Link></li>
    </ul>
  )
}
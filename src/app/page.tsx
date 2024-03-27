import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>React Aria Playground</h1>
      <ul>
        <li>
          <Link href="/popover-suspense">Popover and Suspense</Link>
        </li>
        <li>
          <Link href="/tag-field">TagField</Link>
        </li>
      </ul>
    </main>
  );
}

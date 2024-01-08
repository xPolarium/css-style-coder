import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between">
      <div>CSS Coder</div>
      <Link href="/challenges/test">Challenges</Link>
    </div>
  );
}

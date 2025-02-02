import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-muted-foreground">
      <Link href="https://github.com/MagnusPladsen" className="hover:text-primary">
        GitHub
      </Link>
      <Link href="https://no.linkedin.com/in/magnus-pladsen-1a2738226" className="hover:text-primary">
        LinkedIn
      </Link>
    </footer>
  );
}

// Footer component - simplified version

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`bg-background py-8 text-center border-t border-primary/10 ${className || ""}`}>
      <p className="text-primary font-bold text-lg mb-2">TD CONSULTING</p>
      <p className="text-muted-foreground text-sm mb-4">A Trusted Recruitment Partner</p>

      <p className="text-muted-foreground/60 text-xs">
        © {new Date().getFullYear()} TD CONSULTING. All rights reserved.
      </p>
    </footer>
  );
}
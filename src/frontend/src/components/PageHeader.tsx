interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="relative py-14 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.14_0.025_260)] via-[oklch(0.12_0.018_260)] to-[oklch(0.1_0.015_260)]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, oklch(0.78 0.17 75 / 8%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.6 0.15 200 / 6%) 0%, transparent 40%)",
        }}
      />

      <div className="relative container mx-auto px-4 text-center">
        {breadcrumb && (
          <p className="text-gold text-sm font-medium uppercase tracking-widest mb-2">
            {breadcrumb}
          </p>
        )}
        <h1 className="font-display font-black text-3xl md:text-5xl text-foreground">
          <span className="text-gradient-gold">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-5 flex justify-center">
          <div className="h-0.5 w-20 gradient-gold rounded-full" />
        </div>
      </div>
    </div>
  );
}

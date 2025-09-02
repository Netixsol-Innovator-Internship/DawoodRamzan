import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-[#4A5AAF] mb-4">{title}</h1>
        <div className="w-16 h-1 bg-[#4A5AAF] mx-auto mb-6"></div>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>

        {/* Breadcrumbs */}
        <nav className="flex items-center justify-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">›</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[#4A5AAF] hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}

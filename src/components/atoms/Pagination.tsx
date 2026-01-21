import Link from 'next/link';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  preserveParams?: Record<string, string | undefined>;
}

export function Pagination({ currentPage, totalPages, baseUrl, preserveParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add preserved params
    if (preserveParams) {
      Object.entries(preserveParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }

    // Add page param (only if not page 1)
    if (page > 1) {
      params.set('page', String(page));
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-gray-500">
        Pagina {currentPage} di {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link href={getPageUrl(currentPage - 1)}>
            <Button variant="outline" size="sm">
              ←
            </Button>
          </Link>
        )}

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <Link key={page} href={getPageUrl(page)}>
              <Button
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                className="min-w-[36px]"
              >
                {page}
              </Button>
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link href={getPageUrl(currentPage + 1)}>
            <Button variant="outline" size="sm">
              →
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

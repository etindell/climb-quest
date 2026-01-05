import React from 'react';

export function PageContainer({
  children,
  title,
  subtitle,
  action,
  className = '',
  noPadding = false
}) {
  return (
    <div className={`min-h-screen pb-20 bg-[--color-background] ${className}`}>
      {/* Header */}
      {(title || action) && (
        <header className="sticky top-0 z-30 bg-[--color-background]/95 backdrop-blur-sm">
          <div className="px-4 py-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-[--color-secondary]">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-[--color-text-muted] mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && <div>{action}</div>}
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className={`max-w-lg mx-auto ${noPadding ? '' : 'px-4'}`}>
        {children}
      </main>
    </div>
  );
}

export function PageSection({ title, action, children, className = '' }) {
  return (
    <section className={`mb-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h2 className="text-lg font-bold text-[--color-secondary]">
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export default PageContainer;

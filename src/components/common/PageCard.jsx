export default function PageCard({
  title,
  subtitle,
  children,
  maxWidth = "max-w-2xl",
}) {
  return (
    <div className="min-h-screen bg-slate-100 p-6 flex justify-center">

      <div className={`w-full ${maxWidth}`}>

        <div className="bg-white rounded-3xl shadow-xl p-10">

          {(title || subtitle) && (
            <div className="mb-8">

              {title && (
                <h1 className="text-3xl font-bold text-navy-900">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="text-gray-500 mt-2">
                  {subtitle}
                </p>
              )}

            </div>
          )}

          {children}

        </div>

      </div>

    </div>
  );
}
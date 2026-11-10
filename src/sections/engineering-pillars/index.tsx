import type { IEngineeringPillarsProps } from "./interface";

export function EngineeringPillarsSection({ columns }: IEngineeringPillarsProps) {
  if (!columns || columns.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Engineering Pillars"
      className="bg-background text-foreground py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {columns.map((col, index) => (
            <div
              key={col._key || index}
              className="flex flex-col border-t border-foreground/15 pt-8"
            >
              <p className="font-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                {col.label}
              </p>

              <h2 className="mt-5 sm:mt-6 font-sans text-lg sm:text-[1.125rem] font-bold leading-[1.38] text-foreground tracking-tight text-balance">
                {col.statement}
              </h2>

              {col.items && col.items.length > 0 && (
                <ul className="mt-7 sm:mt-8 flex flex-col gap-3.5">
                  {col.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="font-sans text-sm sm:text-base italic font-normal text-muted-foreground leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EngineeringPillarsSection;

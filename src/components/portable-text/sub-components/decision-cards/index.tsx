import type { IDecisionCardsProps } from "./interface";

/**
 * Renders a 3-column grid of architectural or product decision cards
 * styled with the site's dark forest bento tile treatment.
 */
export function DecisionCardsBlock({ cards }: IDecisionCardsProps) {
  const validCards = (cards ?? []).filter(
    (card) => Boolean(card?.title?.trim()) || Boolean(card?.description?.trim()),
  );

  if (validCards.length === 0) {
    return null;
  }

  return (
    <div
      data-surface="forest"
      className="my-10 grid grid-cols-1 gap-6 bg-transparent! text-foreground bento:grid-cols-3"
    >
      {validCards.map((card, index) => {
        const eyebrow = card.eyebrow?.trim() || "DECISION";
        return (
          <article
            key={card._key || index}
            data-tone="forest"
            className="bento-tile justify-between gap-3 p-7"
          >
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label uppercase text-muted-sage">
                {eyebrow}
              </p>
              {card.title && (
                <h3 className="font-display text-title font-normal text-limestone">
                  {card.title}
                </h3>
              )}
              {card.description && (
                <p className="text-base leading-[1.6] text-muted-sage">
                  {card.description}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default DecisionCardsBlock;

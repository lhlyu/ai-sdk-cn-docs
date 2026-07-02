import type { ReactNode } from 'react';
import { safeHref } from '../safe-url';

type IndexCard = {
  title?: string;
  description?: ReactNode;
  href?: string;
};

export default function IndexCards({ cards }: { cards?: IndexCard[] }) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return <div className="doc-placeholder">IndexCards 缺少 cards</div>;
  }

  return (
    <div className="doc-index-cards">
      {cards.map((card, index) => {
        const href = safeHref(card.href);
        if (!href) return null;
        return (
          <a className="doc-index-card" href={href} key={index}>
            <div className="doc-index-card-title">{card.title}</div>
            {card.description ? <div className="doc-index-card-desc">{card.description}</div> : null}
          </a>
        );
      })}
    </div>
  );
}

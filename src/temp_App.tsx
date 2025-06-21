import { useEffect, useState } from "react";

interface CardInterface {
  id: number;
  title: string;
  description: string;
  matchingIds?: number[];
}

const matchingSets = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
  [19, 20],
  [21, 22],
  [23, 24],
  [25, 26],
  [27, 28],
  [29, 30, 31],
  [83],
];

function App() {
  const [cards, setCards] = useState<CardInterface[]>([]);

  const totalCards = 12;

  useEffect(() => {
    populateCards();
  }, []);

  const populateCards = () => {
    const newCards: CardInterface[] = [];
    matchingSets
      .sort(() => 0.5 - Math.random())
      .forEach((set) => {
        const setLength = set.length < 2 ? 2 : set.length;

        if (
          newCards.length + setLength > totalCards ||
          newCards.length + setLength === totalCards - 1
        )
          return;

        if (set.length === 1) {
          const card: CardInterface = {
            id: set[0],
            title: `Card ${set[0]}`,
            description: `${set[0]}.`,
            matchingIds: [set[0]],
          };
          newCards.push(card, card);
        } else {
          set.forEach((id) => {
            const card: CardInterface = {
              id,
              title: `Card ${id}`,
              description: `${id}.`,
              matchingIds: set.filter((mid) => mid !== id),
            };
            newCards.push(card);
          });
        }
      });

    newCards.sort(() => 0.5 - Math.random());
    setCards(newCards);
  };

  return (
    <div className="App">
      <h1>Cards</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              width: "200px",
            }}
          >
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            {card.matchingIds && card.matchingIds.length > 0 && (
              <p>Matches with: {card.matchingIds.join(", ")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

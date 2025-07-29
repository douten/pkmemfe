import { Button } from "@ui/Button";

export const Rules = () => {
  const rules = [
    {
      text: "Match cards by the Pokemon's evolution line. EX:",
      details: [
        "Charmander → Charmeleon → Charizard = 3 points",
        "Rattata → Raticate = 2 points",
      ],
    },
    {
      text: "If it's a single evolution Pokemon, there'll be two of the same card. EX:",
      details: ["Mew → Mew = 2 points"],
    },
    {
      text: "Order of flipping them doesn't matter, as long as the cards match. EX:",
      details: ["Charizard → Charmander → Charmeleon = 3 points"],
    },
    {
      text: "Depending on evolution line, you might get up to 3 cards to flip, like the Charmander family.",
    },
  ];

  return (
    <div className="flex flex-col h-[90dvh] overflow-y-auto p-6 max-w-2xl scrollbar-hidden">
      <>
        <h1 className="text-xl font-bold text-black-text mb-3 text-center">
          Game Rules
        </h1>
        <p className="text-black-text max-w-2xl text-md leading-relaxed">
          This is a memory matching game with Pokemon cards. You gotta know
          their evolutions to win!
        </p>
        <h2 className="text-lg font-semibold text-black-text mt-5 mb-1">
          🏆 Win Conditions
        </h2>
        <p className="mb-2">
          The first player to reach minimum of 15 points wins the game. Or if
          your opponent concedes, you win by default.
        </p>
        <p>
          You earn points by flipping cards and matching them. Each card matched
          is worth one point.
        </p>
        <h2 className="text-lg font-semibold text-black-text mt-5 mb-1">
          🎮 Turns
        </h2>
        <p className="mb-2">
          A random player is chosen to start the game. During their turn they
          need to flip cards over to find matches.
        </p>
        <p className="mb-2">
          If cards don't match they'll flip back over and it's the next player's
          turn. If they match you will score and get to go again. New cards will
          be drawn to replace the matched cards.
        </p>
        <h2 className="text-lg font-semibold text-black-text mt-5 mb-1">
          🃏 Matching Cards
        </h2>
        <ul className="list-disc list-outside text-black-text max-w-2xl space-y-2 pl-3 ms-3">
          {rules.map((rule, index) => (
            <li key={index}>
              {" "}
              {rule.text}
              {rule.details && (
                <ul className="list-disc list-outside mt-2 space-y-1 pl-2">
                  {rule.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="italic text-sm text-gray-600 font-normal"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold text-black-text mt-5 mb-1">
          🐣 Evolution Lines
        </h2>
        <p className="mb-2">
          Only Pokemon up to Generation 2 are included in the game, and so are
          their evolution lines. So a Murkrow card won't have a matching
          Honchkrow card. It will instead have a matching pair of itself.
        </p>

        <h2 className="text-lg font-semibold text-black-text mt-5 mb-1">
          🧑🏻‍🏫 Tips
        </h2>
        <p className="mb-2">
          The new cards that are drawn, after each match, won't form a matching
          set within themselves. That is, if you flip over cards that were just
          drawn, they are guaranteed to not match.
        </p>
        <p className="mb-2">
          As you match more sets from the original board, the drawn cards will
          start to have matching sets that you can find. So try to clear cards
          on the board initially before flipping over newly drawn cards.
        </p>
        <div className="flex justify-center mt-6 w-full">
          <Button label="Back" onClick={() => window.history.back()} />
        </div>
      </>
    </div>
  );
};

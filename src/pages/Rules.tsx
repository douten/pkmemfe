import { Button } from "../components/Button";

export const Rules = () => {
  const rules = [
    {
      text: "Flip cards to match them. Earn one point per card matched.",
      details: [
        "Charmander + Charmeleon + Charizard = 3 points",
        "Rattata + Raticate = 2 points",
      ],
    },
    {
      text: "Match cards by their evolution line, the order of flipping them doesn't matter.",
      details: ["ex: Charmander → Charmeleon → Charizard"],
    },
    {
      text: "You can flip up to 3 cards to form a match, depending on the evolution line.",
      details: [
        "Flipping Charmeleon first then Charizard will give you one more flip to find Charmander.",
        "Flipping Rattata will give you one more flip to find Raticate.",
        "Flipping Charizard then Rattata will end your turn since they don't match.",
      ],
    },
    {
      text: "If it's a single evolution, there'll be two of the same card.",
    },
    {
      text: "If cards are matched new ones will be drawn to the board.",
      details: ["You get to go again after a successful match."],
    },
    {
      text: "If cards are not matched, they will flip back over.",
      details: ["Your turn will end and your opponent will go."],
    },
    {
      text: "First to 15+ points wins!",
      isWinning: true,
    },
  ];

  return (
    <div className="flex flex-col h-[80dvh] overflow-y-auto p-[20px] max-w-[320px]">
      <>
        <h1 className="text-xl font-bold text-black-text mb-3 text-center">
          Game Rules
        </h1>
        <p className="mb-4 text-black-text max-w-2xl text-md leading-relaxed">
          This is a simple memory matching game with Pokemon cards. You gotta
          know their evolutions to win!
        </p>
        <ul className="list-disc list-outside text-black-text max-w-2xl mb-5 space-y-2 pl-3">
          {rules.map((rule, index) => (
            <li key={index}>
              {rule.isWinning && <span className="mr-2">🏆</span>}
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
        <Button label="Back" onClick={() => window.history.back()} />
      </>
    </div>
  );
};

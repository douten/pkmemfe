import { Button } from "../Button";

export const Rules = () => {
  return (
    <div className="flex flex-col flex-wrap items-center h-full p-[50px]">
      <>
        <ul className="list-disc list-inside text-black-text max-w-lg mb-5">
          <li>Click on a card to flip it.</li>
          <li>
            You can flip two to three cards, depending on the Pokemon's
            evolution.
          </li>
          <li>Cards that match will earn one point each.</li>
          <li>
            Match by Pokemon's evolution. If it's a single evolution, there'll
            be two of the same card.
          </li>
          <li>ex: Pikachu &gt; Raichu</li>
          <li>ex: Bulbasaur &gt; Ivysaur &gt; Venusaur</li>
        </ul>
        <Button label="Back" onClick={() => window.history.back()} />
      </>
    </div>
  );
};

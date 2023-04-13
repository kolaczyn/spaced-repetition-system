type Args = {
  card: {
    whenReview: number;
  };
  getNow: () => number;
};

export const isCardActive = ({ card, getNow = Date.now }: Args) =>
  card.whenReview <= getNow();

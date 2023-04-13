type Args = {
  card: {
    answer: string;
  };
  answer: string;
};

export const getIsAnswerCorrect = ({ card, answer }: Args) =>
  card.answer.toLocaleLowerCase() === answer.toLocaleLowerCase();

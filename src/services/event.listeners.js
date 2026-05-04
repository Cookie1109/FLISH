const { emitter, EVENTS } = require("./event.emitter");
const {
  handleCardViewed,
  handleQuizCompleted,
} = require("./progress.service");

emitter.on(EVENTS.CARD_VIEWED, (payload) => {
  handleCardViewed(payload).catch((error) => {
    console.error("card.viewed handler failed", error);
  });
});

emitter.on(EVENTS.QUIZ_COMPLETED, (payload) => {
  handleQuizCompleted(payload).catch((error) => {
    console.error("quiz.completed handler failed", error);
  });
});

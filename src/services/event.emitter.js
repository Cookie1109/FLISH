const EventEmitter = require("events");

const emitter = new EventEmitter();

const EVENTS = {
  CARD_VIEWED: "card.viewed",
  QUIZ_COMPLETED: "quiz.completed",
};

function emitAsync(event, payload) {
  setImmediate(() => {
    try {
      emitter.emit(event, payload);
    } catch (error) {
      console.error("Event handler error", error);
    }
  });
}

module.exports = {
  emitter,
  EVENTS,
  emitAsync,
};

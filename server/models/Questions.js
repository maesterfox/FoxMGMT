const mongoose = require("mongoose");

// Schema for individual questions
const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: false,
  },
  tags: [
    {
      type: String,
    },
  ],
});

// Schema for topics that include an array of questions
const TopicSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [QuestionSchema],
});

const Topic = mongoose.model("Topic", TopicSchema);

module.exports = Topic;

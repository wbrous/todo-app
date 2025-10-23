import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todoList: defineTable({
    ownerId: v.string(),
    listName: v.string(),
  }),
  todoItem: defineTable({
    listId: v.string(),
    title: v.string(),
    description: v.string(),
    createdAt: v.string(),
    dueDate: v.string(),
    completed: v.boolean(),
  }),
});

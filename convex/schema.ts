import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todoList: defineTable({
    ownerId: v.string(),
    name: v.string(),
  }),
  todoItem: defineTable({
    listId: v.id("todoList"),
    title: v.string(),
    description: v.string(),
    createdAt: v.optional(v.string()),
    dueDate: v.string(),
    completed: v.boolean(),
    ownerId: v.string(),
  }),
});

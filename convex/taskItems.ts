import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {
    taskListId: v.id("taskLists"),
  },
  handler: async (ctx, args) => {
    try {
      // Get the user's identity
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        return {
          code: 401,
          success: false,
          error: "Unauthorized",
          errorId: "unauthorized",
        };
      }

      if (!identity.tokenIdentifier) {
        return {
          code: 400,
          success: false,
          error: "Invalid identity",
          errorId: "invalid_identity",
        };
      }

      // Verify that the task list exists and belongs to the user
      const taskList = await ctx.db
        .query("taskLists")
        .filter((q) => q.eq(q.field("id"), args.taskListId))
        .first();

      if (!taskList || taskList.owner !== identity.tokenIdentifier) {
        return {
          code: 404,
          success: false,
          error: "List not found",
          errorId: "list_not_found",
        };
      }

      // Fetch the user's task lists using the identity token identifier
      const todoItems = await ctx.db
        .query("todoItems")
        .filter((q) => q.eq(q.field("listId"), args.taskListId))
        .collect();

      return {
        code: 200,
        success: true,
        todoItems,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        code: 500,
        success: false,
        error: "Internal server error",
        errorId: "internal_server_error",
      };
    }
  },
});

export const createTask = mutation({
  args: {
    listId: v.string(),
    title: v.string(),
    description: v.string(),
    dueDate: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Fetch the user's identity
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        return {
          code: 401,
          success: false,
          error: "Unauthorized",
          errorId: "unauthorized",
        };
      }

      if (!identity.tokenIdentifier) {
        return {
          code: 400,
          success: false,
          error: "Invalid identity",
          errorId: "invalid_identity",
        };
      }

      // Check if provided list exists and is owned by the user
      const todoList = await ctx.db
        .query("todoLists")
        .filter((q) => q.eq(q.field("id"), args.listId))
        .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
        .first();

      if (!todoList) {
        return {
          code: 404,
          success: false,
          error: "Task list not found",
          errorId: "task_list_not_found",
        };
      }

      // Create a new task item
      const taskItem = await ctx.db.insert("todoItems", {
        listId: args.listId,
        title: args.title,
        description: args.description,
        dueDate: args.dueDate,
        ownerId: identity.tokenIdentifier,
        completed: false,
      });

      return {
        code: 200,
        success: true,
        taskListId: taskItem,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        code: 500,
        success: false,
        error: "Internal server error",
        errorId: "internal_server_error",
      };
    }
  },
});

export const modifyTask = mutation({
  args: {
    taskId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Fetch the user's identity
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        return {
          code: 401,
          success: false,
          error: "Unauthorized",
          errorId: "unauthorized",
        };
      }

      if (!identity.tokenIdentifier) {
        return {
          code: 400,
          success: false,
          error: "Invalid identity",
          errorId: "invalid_identity",
        };
      }

      // Find the task item
      const taskItem = await ctx.db
        .query("todoItems")
        .filter((q) => q.eq(q.field("id"), args.taskId))
        .first();

      if (!taskItem) {
        return {
          code: 404,
          success: false,
          error: "Task not found",
          errorId: "task_not_found",
        };
      }

      // Check if the parent task is owned by the user
      const parentTask = await ctx.db
        .query("todoItems")
        .filter((q) => q.eq(q.field("id"), taskItem.parentId))
        .first();

      if (!parentTask || parentTask.ownerId !== identity.tokenIdentifier) {
        return {
          code: 404,
          success: false,
          error: "Task not found",
          errorId: "task_not_found",
        };
      }

      // Modify the task item
      await ctx.db.patch(taskItem.id, {
        title: args.title,
        description: args.description,
        dueDate: args.dueDate,
      });

      return {
        code: 200,
        success: true,
        taskListId: taskItem,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        code: 500,
        success: false,
        error: "Internal server error",
        errorId: "internal_server_error",
      };
    }
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Fetch the user's identity
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        return {
          code: 401,
          success: false,
          error: "Unauthorized",
          errorId: "unauthorized",
        };
      }

      if (!identity.tokenIdentifier) {
        return {
          code: 400,
          success: false,
          error: "Invalid identity",
          errorId: "invalid_identity",
        };
      }

      // Find the task item
      const taskItem = await ctx.db
        .query("todoItems")
        .filter((q) => q.eq(q.field("id"), args.taskId))
        .first();

      if (!taskItem) {
        return {
          code: 404,
          success: false,
          error: "Task not found",
          errorId: "task_not_found",
        };
      }

      // Check if the parent task is owned by the user
      const parentTask = await ctx.db
        .query("todoItems")
        .filter((q) => q.eq(q.field("id"), taskItem.parentId))
        .first();

      if (!parentTask || parentTask.ownerId !== identity.tokenIdentifier) {
        return {
          code: 404,
          success: false,
          error: "Task not found",
          errorId: "task_not_found",
        };
      }

      // Delete the task item
      await ctx.db.delete(taskItem.id);

      return {
        code: 200,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        code: 500,
        success: false,
        error: "Internal server error",
        errorId: "internal_server_error",
      };
    }
  },
});

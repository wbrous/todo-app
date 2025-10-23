import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {
    taskListId: v.id("todoList"),
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
      const taskList = await ctx.db.get(args.taskListId);

      if (!taskList || taskList.ownerId !== identity.tokenIdentifier) {
        return {
          code: 404,
          success: false,
          error: "List not found",
          errorId: "list_not_found",
        };
      }

      // Fetch the user's task items using the identity token identifier
      const todoItems = await ctx.db
        .query("todoItem")
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
    listId: v.id("todoList"),
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
      const todoList = await ctx.db.get(args.listId);

      if (!todoList || todoList.ownerId !== identity.tokenIdentifier) {
        return {
          code: 404,
          success: false,
          error: "Task list not found",
          errorId: "task_list_not_found",
        };
      }

      // Create a new task item
      const taskItem = await ctx.db.insert("todoItem", {
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
        taskItemId: taskItem,
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
    taskId: v.id("todoItem"),
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
      const taskItem = await ctx.db.get(args.taskId);

      if (!taskItem) {
        return {
          code: 404,
          success: false,
          error: "Task not found",
          errorId: "task_not_found",
        };
      }

      // Check if the task is owned by the user
      if (taskItem.ownerId !== identity.tokenIdentifier) {
        return {
          code: 403,
          success: false,
          error: "Forbidden",
          errorId: "forbidden",
        };
      }

      // Modify the task item
      await ctx.db.patch(args.taskId, {
        title: args.title,
        description: args.description,
        dueDate: args.dueDate,
      });

      return {
        code: 200,
        success: true,
        taskItemId: args.taskId,
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
    taskId: v.id("todoItem"),
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
      const taskItem = await ctx.db.get(args.taskId);

      if (!taskItem) {
        return {
          code: 404,
          success: false,
          error: "Task not found",
          errorId: "task_not_found",
        };
      }

      // Check if the task is owned by the user
      if (taskItem.ownerId !== identity.tokenIdentifier) {
        return {
          code: 403,
          success: false,
          error: "Forbidden",
          errorId: "forbidden",
        };
      }

      // Delete the task item
      await ctx.db.delete(args.taskId);

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

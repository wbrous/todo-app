import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTaskList = query({
  handler: async (ctx) => {
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

      // Fetch the user's task lists using the identity token identifier
      const taskLists = await ctx.db
        .query("todoList")
        .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
        .collect();

      return {
        code: 200,
        success: true,
        taskLists,
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

export const createTaskList = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
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

      // Check if task list of same name already exists
      const existingTaskList = await ctx.db
        .query("todoList")
        .filter((q) => q.eq(q.field("name"), args.name))
        .collect();
      if (existingTaskList.length > 0) {
        return {
          code: 409,
          success: false,
          error: "Task list with the same name already exists.",
          errorId: "task_list_exists",
        };
      }

      // Create task list and save ID to variable
      const taskListId = await ctx.db.insert("todoList", {
        name: args.name,
        ownerId: identity?.tokenIdentifier,
      });

      return {
        code: 200,
        success: true,
        taskListId: taskListId,
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

export const modifyTaskList = mutation({
  args: {
    id: v.id("todoList"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    try {
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

      // Check if task list of same name already exists that belongs to the user
      const existingTaskList = await ctx.db
        .query("todoList")
        .filter((q) => q.eq(q.field("name"), args.name))
        .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
        .collect();
      if (existingTaskList.length > 0) {
        return {
          code: 409,
          success: false,
          error: "Task list with the same name already exists.",
          errorId: "task_list_exists",
        };
      }

      // Modify the task list
      await ctx.db.patch(args.id, {
        name: args.name,
      });

      return {
        code: 200,
        success: true,
        taskListId: args.id,
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

export const deleteTaskList = mutation({
  args: {
    id: v.id("todoList"),
  },
  handler: async (ctx, args) => {
    try {
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

      // Check if task list exists
      const taskList = await ctx.db.get(args.id);

      if (!taskList) {
        return {
          code: 404,
          success: false,
          error: "Task list not found",
          errorId: "task_list_not_found",
        };
      }

      // Check if task list belongs to the user
      if (taskList.ownerId !== identity.tokenIdentifier) {
        return {
          code: 403,
          success: false,
          error: "Forbidden",
          errorId: "forbidden",
        };
      }

      // Delete the task list
      await ctx.db.delete(args.id);

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

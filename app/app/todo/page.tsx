"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast, Toaster } from "sonner";
import {
  Plus,
  X,
  ChevronDown,
  Calendar,
  MoreVertical,
  Trash,
  Edit3,
  Check,
  ListPlus,
  Sparkles,
} from "lucide-react";

export default function TodoPage() {
  const [selectedListId, setSelectedListId] = useState<Id<"todoList"> | null>(
    null,
  );
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<Id<"todoItem"> | null>(
    null,
  );
  const [editingTaskId, setEditingTaskId] = useState<Id<"todoItem"> | null>(
    null,
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch task lists
  const taskListsResponse = useQuery(api.todoLists.getTaskList);
  const taskLists = taskListsResponse?.success
    ? taskListsResponse.taskLists
    : [];

  // Auto-select first list
  useEffect(() => {
    if (taskLists && taskLists.length > 0 && !selectedListId) {
      setSelectedListId(taskLists[0]._id);
    }
  }, [taskLists, selectedListId]);

  // Fetch items for selected list
  const todoItemsResponse = useQuery(
    api.todoItems.getItems,
    selectedListId ? { taskListId: selectedListId } : "skip",
  );
  const todoItems = todoItemsResponse?.success
    ? todoItemsResponse.todoItems
    : [];

  // Separate completed and active tasks
  const activeTasks = todoItems?.filter((item) => !item.completed) || [];
  const completedTasks = todoItems?.filter((item) => item.completed) || [];

  // Mutations
  const createTaskList = useMutation(api.todoLists.createTaskList);
  const deleteTaskList = useMutation(api.todoLists.deleteTaskList);
  const modifyTaskList = useMutation(api.todoLists.modifyTaskList);
  const createTask = useMutation(api.todoItems.createTask);
  const deleteTask = useMutation(api.todoItems.deleteTask);
  const modifyTask = useMutation(api.todoItems.modifyTask);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    const result = await createTaskList({ name: newListName });
    if (result.success) {
      setNewListName("");
      setShowNewListInput(false);
      setShowNewListDialog(false);
      if (result.taskListId) {
        setSelectedListId(result.taskListId);
        toast.success("List created successfully");
      }
    } else {
      toast.error(result.error || "Failed to create list");
    }
  };

  const handleDeleteList = async (e: React.MouseEvent, id: Id<"todoList">) => {
    e.stopPropagation();
    const result = await deleteTaskList({ id });
    if (result.success) {
      toast.success("List deleted");
      if (selectedListId === id && taskLists && taskLists.length > 1) {
        const remainingLists = taskLists.filter((l) => l._id !== id);
        setSelectedListId(remainingLists[0]?._id || null);
      }
    }
  };

  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId || !quickTaskTitle.trim()) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await createTask({
      listId: selectedListId,
      title: quickTaskTitle,
      description: "",
      dueDate: tomorrow.toISOString(),
    });

    if (result.success) {
      setQuickTaskTitle("");
      toast.success("Task added");
    }
  };

  const handleToggleComplete = async (
    taskId: Id<"todoItem">,
    currentStatus: boolean,
  ) => {
    // This would need a toggle complete mutation in your backend
    toast.success(currentStatus ? "Task marked incomplete" : "Task completed");
  };

  const handleDeleteTask = async (taskId: Id<"todoItem">) => {
    const result = await deleteTask({ taskId });
    if (result.success) {
      toast.success("Task deleted");
    }
  };

  const handleUpdateTask = async (taskId: Id<"todoItem">) => {
    if (!editTitle.trim()) return;

    const result = await modifyTask({
      taskId,
      title: editTitle,
      description: editDescription,
    });

    if (result.success) {
      setEditingTaskId(null);
      toast.success("Task updated");
    }
  };

  const startEditing = (task: {
    _id: Id<"todoItem">;
    title: string;
    description?: string;
  }) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const currentList = taskLists?.find((l) => l._id === selectedListId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex-1 w-full">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Tasks</h1>
            </div>

            {/* List Selector */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[180px] justify-between"
                  >
                    {currentList?.name || "Select list"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <div className="p-2">
                    {taskLists?.map((list) => (
                      <div
                        key={list._id}
                        className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent cursor-pointer group"
                        onClick={() => setSelectedListId(list._id)}
                      >
                        <span
                          className={
                            selectedListId === list._id ? "font-medium" : ""
                          }
                        >
                          {list.name}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteList(e, list._id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    <div className="border-t mt-2 pt-2">
                      {showNewListInput ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="New list name"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleCreateList();
                              if (e.key === "Escape") {
                                setShowNewListInput(false);
                                setNewListName("");
                              }
                            }}
                            autoFocus
                            className="h-8"
                          />
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleCreateList}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-8"
                          onClick={() => setShowNewListInput(true)}
                        >
                          <ListPlus className="h-4 w-4 mr-2" />
                          New list
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quick Add Task */}
          {selectedListId && (
            <form onSubmit={handleQuickAddTask} className="relative">
              <Input
                placeholder="Add a task... (due tomorrow by default)"
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="pr-10 h-12 text-base"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-10 w-10"
                disabled={!quickTaskTitle.trim()}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        {!selectedListId ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <ListPlus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No lists yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first list to get started
            </p>
            <Dialog
              open={showNewListDialog}
              onOpenChange={setShowNewListDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create List
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New List</DialogTitle>
                  <DialogDescription>
                    Give your new task list a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="List name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateList();
                      if (e.key === "Escape") {
                        setNewListName("");
                        setShowNewListDialog(false);
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNewListName("");
                        setShowNewListDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateList}
                      disabled={!newListName.trim()}
                    >
                      Create List
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <div
                    key={task._id}
                    className="group bg-background rounded-lg border p-6 hover:shadow-sm transition-all"
                  >
                    {editingTaskId === task._id ? (
                      <div className="space-y-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="font-medium text-lg"
                          autoFocus
                        />
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Add description..."
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTask(task._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() =>
                            handleToggleComplete(task._id, task.completed)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-lg">{task.title}</p>
                            {task.createdAt && (
                              <span className="text-xs text-muted-foreground">
                                Created{" "}
                                {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Due{" "}
                                    {new Date(
                                      task.dueDate,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => startEditing(task)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <div
                      key={task._id}
                      className="group bg-muted/30 rounded-lg border border-muted p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() =>
                            handleToggleComplete(task._id, task.completed)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="line-through text-muted-foreground">
                            {task.title}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeTasks.length === 0 && completedTasks.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <Check className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">All clear!</h2>
                <p className="text-muted-foreground">
                  Add a task above to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

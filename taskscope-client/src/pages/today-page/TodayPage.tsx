import { useEffect, useState } from "react";
import "./TodayPage.scss";
import { 
    DndContext, 
    DragOverlay,
    useSensors, 
    useSensor, 
    PointerSensor,
    type DragEndEvent,
} from "@dnd-kit/core";
import dayjs from "dayjs";
import { getTasksForUser, updateTaskStatus } from "../../services/tasksService";
import type { TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { TaskCard } from "../../components/public/task-card/TaskCard";
import { DroppableColumn } from "../../components/public/droppable-column/DroppableColumn";
import { message } from "antd";

interface TaskGroups {
    [key: number]: TaskEntityDto[];
    [TaskEntityStatus.Todo]: TaskEntityDto[];
    [TaskEntityStatus.InProgress]: TaskEntityDto[];
    [TaskEntityStatus.Done]: TaskEntityDto[];
}

export const TodayPage = () => {
    const [taskGroups, setTaskGroups] = useState<TaskGroups>({
        [TaskEntityStatus.Todo]: [],
        [TaskEntityStatus.InProgress]: [],
        [TaskEntityStatus.Done]: []
    });
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // const today = dayjs().format("YYYY-MM-DD");
                const today = dayjs('2025-10-24').format("YYYY-MM-DD");
                const result = await getTasksForUser(today, today);
                
                // Group tasks by status
                const grouped = result.reduce((acc, task) => ({
                    ...acc,
                    [task.status]: [...(acc[task.status] || []), task]
                }), {
                    [TaskEntityStatus.Todo]: [],
                    [TaskEntityStatus.InProgress]: [],
                    [TaskEntityStatus.Done]: []
                } as TaskGroups);
                
                setTaskGroups(grouped);
            } catch (error) {
                console.error("Error fetching tasks", error);
                message.error("Failed to fetch tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleTaskStatusChange = async (taskId: string, newStatus: TaskEntityStatus) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, newStatus);
            
            // Remove task from old status group
            const oldStatus = Object.values(TaskEntityStatus)
                .filter((status): status is TaskEntityStatus => typeof status === "number")
                .find(status => 
                    taskGroups[status as number]?.some((t: TaskEntityDto) => t.id === taskId)
                ) as TaskEntityStatus;

            if (oldStatus !== undefined) {
                setTaskGroups(prev => ({
                    ...prev,
                    [oldStatus]: prev[oldStatus].filter((t: TaskEntityDto) => t.id !== taskId),
                    [newStatus]: [...prev[newStatus], updatedTask]
                }));
            }

            message.success(`Task moved to ${TaskEntityStatus[newStatus]}`);
        } catch (error) {
            console.error("Failed to update task status", error);
            message.error("Failed to update task status");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) return;

        const taskId = active.id as string;
        const newStatus = Number(over.id) as TaskEntityStatus;
        const currentStatus = Object.values(TaskEntityStatus).find(status => 
            taskGroups[status as number]?.some((t: TaskEntityDto) => t.id === taskId)
        ) as TaskEntityStatus;

        if (currentStatus !== undefined && currentStatus !== newStatus) {
            await handleTaskStatusChange(taskId, newStatus);
        }

        setActiveId(null);
    };

    if (loading) return <div className="today-page">Loading...</div>;

    return (
        <div className="today-page">
            <h1 className="today-page-title">Today</h1>
            <DndContext
                sensors={sensors}
                onDragStart={({ active }) => setActiveId(active.id as string)}
                onDragEnd={handleDragEnd}
            >
                <div className="today-page-columns">
                    <DroppableColumn
                        key={TaskEntityStatus.Todo}
                        id={TaskEntityStatus.Todo.toString()}
                        title="Todo"
                        tasks={taskGroups[TaskEntityStatus.Todo]}
                        onStatusChange={handleTaskStatusChange}
                    />
                    <DroppableColumn
                        key={TaskEntityStatus.InProgress}
                        id={TaskEntityStatus.InProgress.toString()}
                        title="In Progress"
                        tasks={taskGroups[TaskEntityStatus.InProgress]}
                        onStatusChange={handleTaskStatusChange}
                    />
                    <DroppableColumn
                        key={TaskEntityStatus.Done}
                        id={TaskEntityStatus.Done.toString()}
                        title="Done"
                        tasks={taskGroups[TaskEntityStatus.Done]}
                        onStatusChange={handleTaskStatusChange}
                    />
                </div>
                <DragOverlay>
                    {activeId ? (
                        <div className="dragging-task-overlay">
                            <TaskCard
                                task={Object.values(taskGroups)
                                    .flat()
                                    .find((task: TaskEntityDto) => task.id === activeId)!}
                                onStatusChange={handleTaskStatusChange}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default TodayPage;
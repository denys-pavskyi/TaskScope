import { useEffect, useState } from "react";
import "./TodayPage.scss";
import { getTodaysTasks, updateTaskStatus } from "../../services/tasksService";
import type { TasksGroupedByStatus } from "../../models/TasksGroupedByStatus";
import type { TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { TaskCard } from "../../components/public/task-card/TaskCard";
import { message } from "antd";

export const TodayPage = () => {
    const [taskGroups, setTaskGroups] = useState<TasksGroupedByStatus>({
        Todo: [],
        InProgress: [],
        Done: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const result = await getTodaysTasks();
                setTaskGroups(result);
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
            const oldStatus = Object.entries(taskGroups).find(([_, tasks]) => 
                tasks.some((t: TaskEntityDto) => t.id === taskId)
            )?.[0] as keyof TasksGroupedByStatus;

            if (oldStatus) {
                setTaskGroups(prev => ({
                    ...prev,
                    [oldStatus]: prev[oldStatus].filter(t => t.id !== taskId),
                    [TaskEntityStatus[newStatus]]: [...prev[TaskEntityStatus[newStatus] as keyof TasksGroupedByStatus], updatedTask]
                }));
            }

            message.success(`Task moved to ${TaskEntityStatus[newStatus]}`);
        } catch (error) {
            console.error("Failed to update task status", error);
            message.error("Failed to update task status");
        }
    };

    if (loading) return <div className="today-page">Loading...</div>;

    return (
        <div className="today-page">
            <h1 className="today-page-title">Today</h1>
            <div className="today-page-columns">
                {Object.entries(taskGroups).map(([status, tasks]) => (
                    <div key={status} className="task-column">
                        <h2 className="column-title">{status}</h2>
                        <div className="task-list">
                            {tasks.map((task: TaskEntityDto) => (
                                <TaskCard 
                                    key={task.id}
                                    task={task}
                                    onStatusChange={handleTaskStatusChange}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodayPage;
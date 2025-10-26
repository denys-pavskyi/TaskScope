import { useEffect, useState } from "react";
import "./TodayPage.scss";
import dayjs from "dayjs";
import { getTasksForUser, updateTaskStatus } from "../../services/tasksService";
import { type TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { TaskCard } from "../../components/public/task-card/TaskCard";
import { message } from "antd";

export const TodayPage = () => {
    const [tasks, setTasks] = useState<TaskEntityDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                //const today = dayjs().format("YYYY-MM-DD");
                const today = dayjs('2025-10-24').format("YYYY-MM-DD");
                const result = await getTasksForUser(today, today);
                setTasks(result);
            } catch (error) {
                console.error("Error fetching tasks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) return <div className="today-page">Loading...</div>;

    return (
        <div className="today-page">
            <h1 className="today-page-title">Today</h1>
            <div className="today-page-list max-w-2xl mx-auto space-y-4">
                {tasks.map((task) => (
                <TaskCard 
                    key={task.id} 
                    task={task}
                    onStatusChange={async (taskId, newStatus) => {
                        try {
                            const updatedTask = await updateTaskStatus(taskId, newStatus);
                            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
                            message.success(`Task status updated to ${TaskEntityStatus[newStatus]}`);
                        } catch (error) {
                            console.error("Failed to update task status", error);
                            message.error("Failed to update task status");
                        }
                    }}
                />
                ))}
            </div>
        </div>
  );
};

export default TodayPage;
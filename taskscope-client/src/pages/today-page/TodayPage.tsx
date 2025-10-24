import { useEffect, useState } from "react";
import "./TodayPage.scss";
import dayjs from "dayjs";
import { getTasksForUser } from "../../services/tasksService";
import { type TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskCard } from "../../components/public/task-card/TaskCard";

export const TodayPage = () => {
    const [tasks, setTasks] = useState<TaskEntityDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const today = dayjs().format("YYYY-MM-DD");
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
                <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
  );
};

export default TodayPage;
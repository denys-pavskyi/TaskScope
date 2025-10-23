import { useEffect, useState } from "react";
import "./TodayPage.scss";
import dayjs from "dayjs";
import { getTasksForUser } from "../../services/tasksService";
import { TaskEntityDto } from "../../models/TaskEntityDto";
import exp from "constants";

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
            {tasks.length === 0 ? (
                <div>No tasks for today.</div>
            ) : (
                <ul>
                    {tasks.map((t) => (
                        <li key={t.id}>{t.title}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TodayPage;
import { useEffect, useState } from "react";
import "./TodayPage.scss";
import { getTodaysTasks, updateTaskStatus } from "../../services/tasksService";
import type { TasksGroupedByStatus } from "../../models/TasksGroupedByStatus";
import type { TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { TaskCard } from "../../components/public/task-card/TaskCard";
import { Card, Badge, message } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';

const columnConfig = {
    Todo: {
        icon: <InboxOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />,
        color: '#fafafa',
        badge: '#8c8c8c'
    },
    InProgress: {
        icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#4ca1f0ff' }} />,
        color: '#e6f7ff',
        badge: '#1890ff'
    },
    Done: {
        icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#457d29ff' }} />,
        color: '#f6ffed',
        badge: '#52c41a'
    }
};
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
                        <Card 
                            key={status}
                            className="task-column"
                            title={
                                <div className="column-header">
                                    {columnConfig[status as keyof typeof columnConfig].icon}
                                    <span className="column-title">{status}</span>
                                    <Badge 
                                        count={tasks.length} 
                                        style={{ 
                                            backgroundColor: columnConfig[status as keyof typeof columnConfig].badge,
                                            marginLeft: 'auto'
                                        }} 
                                    />
                                </div>
                            }
                            style={{ 
                                backgroundColor: columnConfig[status as keyof typeof columnConfig].color
                            }}
                            bodyStyle={{ padding: '8px' }}
                        >
                            <div className="task-list">
                            {tasks.map((task: TaskEntityDto) => (
                                <TaskCard 
                                    key={task.id}
                                    task={task}
                                    onStatusChange={handleTaskStatusChange}
                                />
                            ))}
                        </div>
                        </Card>
                ))}
            </div>
        </div>
    );
};

export default TodayPage;
import { useEffect, useCallback } from "react";
import "./TodayPage.scss";
import type { TaskEntityDto } from "../../models/TaskEntityDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { TaskCard } from "../../components/public/task-card/TaskCard";
import { Card, Badge, message } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTodayTasks, changeTaskStatus } from "../../store/slices/tasksSlice";
import type { TasksGroupedByStatus } from "../../models/TasksGroupedByStatus";

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

const COLUMN_ORDER: (keyof TasksGroupedByStatus)[] = ['Todo', 'InProgress', 'Done'];

export const TodayPage = () => {
    const dispatch = useAppDispatch();
    const { todayTasks, loading } = useAppSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTodayTasks());
    }, [dispatch]);

    const handleTaskStatusChange = useCallback(async (taskId: string, newStatus: TaskEntityStatus) => {
        try {
            await dispatch(changeTaskStatus({ taskId, newStatus })).unwrap();
            message.success(`Task moved to ${TaskEntityStatus[newStatus]}`);
        } catch (error) {
            console.error("Failed to update task status", error);
        }
    }, [dispatch]);

    if (loading) return <div className="today-page">Loading...</div>;

    return (
        <div className="today-page">
            <h1 className="today-page-title">Today</h1>
            <div className="today-page-columns">
                {COLUMN_ORDER.map((status) => (
                        <Card 
                            key={status}
                            className="task-column"
                            title={
                                <div className="column-header">
                                    {columnConfig[status as keyof typeof columnConfig].icon}
                                    <span className="column-title">{status}</span>
                                    <Badge 
                                        count={todayTasks[status].length} 
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
                        >
                            <div className="task-list">
                            {todayTasks[status].map((task: TaskEntityDto) => (
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
import { useEffect, useCallback, useState, useMemo } from "react";
import "./TodayPage.scss";
import type { TaskEntityDto } from "../../models/TaskEntityDto";
import type { CreateTaskDto } from "../../models/CreateTaskDto";
import type { UpdateTaskDto } from "../../models/UpdateTaskDto";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";
import { TaskCard } from "../../components/public/task-card/TaskCard";
import { TaskModal } from "../../components/public/task-modal/TaskModal";
import { Card, Badge, message } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTodayTasks, changeTaskStatus, addTask, editTask } from "../../store/slices/tasksSlice";
import type { TasksGroupedByStatus } from "../../models/TasksGroupedByStatus";
import addPostIcon from "../../assets/add-post.png";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskEntityDto | undefined>(undefined);

    // Sort tasks by priority (Critical > High > Medium > Low)
    const sortedTasks = useMemo(() => {
        const sorted: TasksGroupedByStatus = {
            Todo: [...todayTasks.Todo].sort((a, b) => b.priority - a.priority),
            InProgress: [...todayTasks.InProgress].sort((a, b) => b.priority - a.priority),
            Done: [...todayTasks.Done].sort((a, b) => b.priority - a.priority),
        };
        return sorted;
    }, [todayTasks]);

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

    const handleOpenModal = (task?: TaskEntityDto) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(undefined);
    };

    const handleSubmitTask = async (taskData: CreateTaskDto | UpdateTaskDto) => {
        try {
            if ('id' in taskData) {
                await dispatch(editTask(taskData)).unwrap();
                message.success('Task updated successfully');
            } else {
                await dispatch(addTask(taskData)).unwrap();
                message.success('Task created successfully');
            }
        } catch (error) {
            message.error('Failed to save task');
            throw error;
        }
    };

    if (loading) return <div className="today-page">Loading...</div>;

    return (
        <div className="today-page">
            <div className="today-page-header">
                <button className="add-task-button" onClick={() => handleOpenModal()}>
                    <img src={addPostIcon} alt="Add task" />
                    <span>Add</span>
                </button>
                <h1 className="today-page-title">Today</h1>
            </div>
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
                                        count={sortedTasks[status].length} 
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
                            {sortedTasks[status].map((task: TaskEntityDto) => (
                                <TaskCard 
                                    key={task.id}
                                    task={task}
                                    onStatusChange={handleTaskStatusChange}
                                    onEdit={handleOpenModal}
                                />
                            ))}
                        </div>
                        </Card>
                ))}
            </div>
            
            <TaskModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitTask}
                task={editingTask}
            />
        </div>
    );
};

export default TodayPage;
import { useEffect, useMemo, useState } from "react";
import "./UpcomingPage.scss";
import type { TaskEntityDto } from "../../models/tasks/TaskEntityDto";
import type { CreateTaskDto } from "../../models/tasks/CreateTaskDto";
import type { UpdateTaskDto } from "../../models/tasks/UpdateTaskDto";
import { TaskColumn } from "../../components/public/task-column/TaskColumn";
import { TaskModal } from "../../components/public/task-modal/TaskModal";
import { CalendarOutlined } from '@ant-design/icons';
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUpcomingTasks, changeTaskStatus, editTask } from "../../store/slices/tasksSlice";
import { TaskEntityStatus } from "../../models/enums/TaskEntityStatus";

interface GroupedUpcomingTasks {
    tomorrow: TaskEntityDto[];
    dayAfterTomorrow: TaskEntityDto[];
    later: TaskEntityDto[];
}

export const UpcomingPage = () => {
    const dispatch = useAppDispatch();
    const { upcomingTasks, loading } = useAppSelector((state) => state.tasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskEntityDto | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchUpcomingTasks());
    }, [dispatch]);

    const groupedTasks = useMemo<GroupedUpcomingTasks>(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        
        const dayAfterTomorrowEnd = new Date(dayAfterTomorrow);
        dayAfterTomorrowEnd.setDate(dayAfterTomorrowEnd.getDate() + 1);

        const groups: GroupedUpcomingTasks = {
            tomorrow: [],
            dayAfterTomorrow: [],
            later: []
        };

        upcomingTasks.forEach((task) => {
            if (!task.dueDate) {
                groups.later.push(task);
                return;
            }

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            if (dueDate.getTime() === tomorrow.getTime()) {
                groups.tomorrow.push(task);
            } else if (dueDate.getTime() === dayAfterTomorrow.getTime()) {
                groups.dayAfterTomorrow.push(task);
            } else {
                groups.later.push(task);
            }
        });

        return groups;
    }, [upcomingTasks]);

    const handleTaskStatusChange = async (taskId: string, newStatus: TaskEntityStatus) => {
        try {
            await dispatch(changeTaskStatus({ taskId, newStatus })).unwrap();
        } catch (error) {
            console.error("Failed to update task status", error);
        }
    };

    const handleOpenModal = (task: TaskEntityDto) => {
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
            }
            await dispatch(fetchUpcomingTasks());
        } catch (error) {
            message.error('Failed to save task');
            throw error;
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getDayAfterTomorrowDate = () => {
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);
        return dayAfter.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) return <div className="tasks-page">Loading...</div>;

    return (
        <div className="tasks-page">
            <h1 className="tasks-page-title">Upcoming</h1>
            <div className="tasks-page-columns">
                <TaskColumn
                    title={`Tomorrow (${getTomorrowDate()})`}
                    icon={<CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    tasks={groupedTasks.tomorrow}
                    color="#1a2332"
                    badgeColor="#1890ff"
                    onStatusChange={handleTaskStatusChange}
                    onEdit={handleOpenModal}
                />

                <TaskColumn
                    title={`Day After (${getDayAfterTomorrowDate()})`}
                    icon={<CalendarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
                    tasks={groupedTasks.dayAfterTomorrow}
                    color="#1f2b1f"
                    badgeColor="#52c41a"
                    onStatusChange={handleTaskStatusChange}
                    onEdit={handleOpenModal}
                />

                <TaskColumn
                    title="Later"
                    icon={<CalendarOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />}
                    tasks={groupedTasks.later}
                    color="#2a2416"
                    badgeColor="#fa8c16"
                    onStatusChange={handleTaskStatusChange}
                    onEdit={handleOpenModal}
                />
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
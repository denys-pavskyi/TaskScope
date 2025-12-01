import { Card, Badge } from "antd";
import type { ReactNode } from "react";
import type { TaskEntityDto } from "../../../models/tasks/TaskEntityDto";
import { TaskCard } from "../task-card/TaskCard";
import { TaskEntityStatus } from "../../../models/enums/TaskEntityStatus";
import "./TaskColumn.scss";

interface TaskColumnProps {
    title: string;
    icon: ReactNode;
    tasks: TaskEntityDto[];
    color: string;
    badgeColor: string;
    onStatusChange: (taskId: string, newStatus: TaskEntityStatus) => void;
    onEdit?: (task: TaskEntityDto) => void;
}

export const TaskColumn = ({ 
    title, 
    icon, 
    tasks, 
    color, 
    badgeColor, 
    onStatusChange,
    onEdit 
}: TaskColumnProps) => {
    // Sort tasks by priority (Critical > High > Medium > Low)
    const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

    return (
        <Card 
            className="task-column"
            title={
                <div className="column-header">
                    {icon}
                    <span className="column-title">{title}</span>
                    <Badge 
                        count={sortedTasks.length} 
                        style={{ 
                            backgroundColor: badgeColor,
                            marginLeft: 'auto'
                        }} 
                    />
                </div>
            }
            style={{ backgroundColor: color }}
        >
            <div className="task-list">
                {sortedTasks.map((task: TaskEntityDto) => (
                    <TaskCard 
                        key={task.id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </Card>
    );
};

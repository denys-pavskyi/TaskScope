import { Card, Tag, Dropdown } from "antd";
import { DownOutlined } from '@ant-design/icons';
import type { TaskEntityDto } from "../../../models/tasks/TaskEntityDto";
import { TaskPriority } from "../../../models/enums/TaskPriority";
import { TaskEntityStatus } from "../../../models/enums/TaskEntityStatus";
import "./TaskCard.scss";

const statusMap: Record<TaskEntityStatus, { text: string; color: string }> = {
  [TaskEntityStatus.Todo]: { text: "Todo", color: "text-gray-500" },
  [TaskEntityStatus.InProgress]: { text: "In Progress", color: "text-blue-500" },
  [TaskEntityStatus.Done]: { text: "Done", color: "text-green-600" },
};

const priorityColorMap: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "#52c41a",     // Green
  [TaskPriority.Medium]: "#faad14",   // Yellow
  [TaskPriority.High]: "#f5222d",     // Red
  [TaskPriority.Critical]: "#722ed1",  // Purple
};

interface TaskCardProps {
    task: TaskEntityDto;
    onStatusChange?: (taskId: string, newStatus: TaskEntityStatus) => void;
    onEdit?: (task: TaskEntityDto) => void;
}

export const TaskCard = ({ task, onStatusChange, onEdit }: TaskCardProps) => {
    const handleStatusChange = (newStatus: TaskEntityStatus) => {
        if (onStatusChange) {
            onStatusChange(task.id, newStatus);
            console.log(`Status changed to ${newStatus} for task ${task.id}`);
        }
    };

    const handleCardClick = () => {
        if (onEdit) {
            onEdit(task);
        }
    };

    const items = [
        { key: TaskEntityStatus.Todo, label: 'Todo' },
        { key: TaskEntityStatus.InProgress, label: 'In Progress' },
        { key: TaskEntityStatus.Done, label: 'Done' }
    ];

    return (
        <Card 
            className="task-card"
            onClick={handleCardClick}
            title={
                <div className="task-header">
                    <span className="task-title">{task.title}</span>
                </div>
            }
            style={{ 
                borderLeft: `3px solid ${priorityColorMap[task.priority as TaskPriority]}`,
                width: '100%',
                cursor: onEdit ? 'pointer' : 'default',
                backgroundColor: '#1f1f1f'
            }}
        >
            <p className="task-description">{task.description || "No description"}</p>
            <div className="task-footer">
                <div className="task-tags">
                    {task.tags?.map((t) => (
                        <Tag 
                            key={t.id} 
                            color={t.color || undefined}
                            style={{
                                borderRadius: '12px',
                            }}
                        >
                            {t.name}
                        </Tag>
                    ))}
                </div>
                <div className="task-meta" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        menu={{
                            items,
                            onClick: ({ key }) => handleStatusChange(Number(key) as TaskEntityStatus),
                            selectedKeys: [task.status.toString()]
                        }}
                        trigger={['click']}
                    >
                        <span className={`status-dropdown font-medium ${statusMap[task.status as TaskEntityStatus].color}`}>
                            {statusMap[task.status as TaskEntityStatus].text} <DownOutlined />
                        </span>
                    </Dropdown>
                    {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                </div>
            </div>
        </Card>
    );
}
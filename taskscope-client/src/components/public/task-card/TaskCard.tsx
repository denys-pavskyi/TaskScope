import { Card, Tag } from "antd";
import { TaskEntityDto } from "../../../models/TaskEntityDto";
import "./TaskCard.scss";

interface TaskCardProps {
    task: TaskEntityDto;
}

export const TaskCard = ({ task}: TaskCardProps) => {
    return (
        <Card className="task-card" title={task.title} >
            <p>{task.description || "No description"}</p>
            {task.tags?.map((t) => (
                <Tag key={t.id}>{t.name}</Tag>
            ))}
            <p>Status: {task.status}</p>
            {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
        </Card>
    );
}
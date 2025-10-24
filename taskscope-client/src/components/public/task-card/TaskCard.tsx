import { Card, Tag } from "antd";
import type { TaskEntityDto } from "../../../models/TaskEntityDto";
import "./TaskCard.scss";

const statusMap = {
  0: { text: "Todo", color: "text-gray-500" },
  1: { text: "In Progress", color: "text-blue-500" },
  2: { text: "Done", color: "text-green-600" },
};

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
            <span className={`font-medium ${statusMap[task.status].color}`}>
                {statusMap[task.status].text}
            </span>
            {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
        </Card>
    );
}
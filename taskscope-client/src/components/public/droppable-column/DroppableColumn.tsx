import { useDroppable } from "@dnd-kit/core";
import type { TaskEntityDto } from "../../../models/TaskEntityDto";
import { TaskCard } from "../task-card/TaskCard";
import { TaskEntityStatus } from "../../../models/enums/TaskEntityStatus";
import "./DroppableColumn.scss";

interface DroppableColumnProps {
    id: string;
    title: string;
    tasks: TaskEntityDto[];
    onStatusChange: (taskId: string, status: TaskEntityStatus) => Promise<void>;
}

export const DroppableColumn = ({ id, title, tasks, onStatusChange }: DroppableColumnProps) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="task-column">
            <h2 className="column-title">{title}</h2>
            <div ref={setNodeRef} className="task-list">
                {tasks.map((task) => (
                    <div key={task.id} className="task-wrapper">
                        <TaskCard
                            task={task}
                            onStatusChange={onStatusChange}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
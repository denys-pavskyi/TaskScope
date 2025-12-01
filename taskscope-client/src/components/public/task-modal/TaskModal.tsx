import { Modal, Form, Input, Select, DatePicker, Card } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { useEffect } from "react";
import { TaskPriority } from "../../../models/enums/TaskPriority";
import { TaskEntityStatus } from "../../../models/enums/TaskEntityStatus";
import type { TaskEntityDto } from "../../../models/TaskEntityDto";
import type { CreateTaskDto } from "../../../models/CreateTaskDto";
import type { UpdateTaskDto } from "../../../models/UpdateTaskDto";
import dayjs from 'dayjs';
import "./TaskModal.scss";

const { TextArea } = Input;

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: CreateTaskDto | UpdateTaskDto) => Promise<void>;
    task?: TaskEntityDto;
}

export const TaskModal = ({ open, onClose, onSubmit, task }: TaskModalProps) => {
    const [form] = Form.useForm();
    const isEditing = !!task;

    useEffect(() => {
        if (open) {
            if (task) {
                form.setFieldsValue({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
                });
            } else {
                form.setFieldsValue({
                    title: undefined,
                    description: undefined,
                    priority: TaskPriority.Medium,
                    status: TaskEntityStatus.Todo,
                    dueDate: undefined,
                });
            }
        }
    }, [open, task, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const taskData: CreateTaskDto | UpdateTaskDto = {
                ...(isEditing && { id: task.id }),
                title: values.title,
                description: values.description || undefined,
                priority: values.priority,
                status: values.status,
                dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') + 'T00:00:00' : undefined,
            };

            await onSubmit(taskData);
            form.resetFields();
            onClose();
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={isEditing ? "Edit Task" : "Create New Task"}
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText={isEditing ? "Update" : "Create"}
            cancelText="Cancel"
            width={600}
            className="task-modal"
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        { required: true, message: "Task title is required" },
                        { max: 200, message: "Task title cannot exceed 200 characters" }
                    ]}
                >
                    <Input placeholder="Enter task title" maxLength={200} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { max: 2000, message: "Task description cannot exceed 2000 characters" }
                    ]}
                >
                    <TextArea 
                        placeholder="Enter task description (optional)" 
                        rows={4} 
                        maxLength={2000}
                        showCount
                    />
                </Form.Item>

                <div className="form-row">
                    <Form.Item
                        name="priority"
                        label="Priority"
                        rules={[{ required: true, message: "Please select priority" }]}
                    >
                        <Select>
                            <Select.Option value={TaskPriority.Low}>Low</Select.Option>
                            <Select.Option value={TaskPriority.Medium}>Medium</Select.Option>
                            <Select.Option value={TaskPriority.High}>High</Select.Option>
                            <Select.Option value={TaskPriority.Critical}>Critical</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: "Please select status" }]}
                    >
                        <Select>
                            <Select.Option value={TaskEntityStatus.Todo}>Todo</Select.Option>
                            <Select.Option value={TaskEntityStatus.InProgress}>In Progress</Select.Option>
                            <Select.Option value={TaskEntityStatus.Done}>Done</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="dueDate"
                    label="Due Date"
                >
                    <DatePicker 
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>

                {isEditing && task.tags && task.tags.length > 0 && (
                    <div className="task-tags-section">
                        <label className="ant-form-item-label">Tags</label>
                        <div className="tags-container">
                            {task.tags.map((tag) => (
                                <Card 
                                    key={tag.id}
                                    className="tag-card"
                                    size="small"
                                    style={{ 
                                        backgroundColor: tag.color || '#f0f0f0',
                                        border: 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <span className="tag-name">{tag.name}</span>
                                    <CloseOutlined className="tag-delete-icon" />
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </Form>
        </Modal>
    );
};

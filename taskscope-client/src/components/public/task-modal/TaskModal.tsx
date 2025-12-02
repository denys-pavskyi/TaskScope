import { Modal, Form, Input, Select, DatePicker, Card, Button } from "antd";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { TaskPriority } from "../../../models/enums/TaskPriority";
import { TaskEntityStatus } from "../../../models/enums/TaskEntityStatus";
import type { TaskEntityDto } from "../../../models/tasks/TaskEntityDto";
import type { CreateTaskDto } from "../../../models/tasks/CreateTaskDto";
import type { UpdateTaskDto } from "../../../models/tasks/UpdateTaskDto";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchTags } from "../../../store/slices/tagsSlice";
import { linkTagToTask, unlinkTagFromTask } from "../../../store/slices/taskTagsSlice";
import { deleteTask, openDeleteConfirm, closeDeleteConfirm } from "../../../store/slices/tasksSlice";
import dayjs from 'dayjs';
import binIcon from "../../../assets/bin.png";
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
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [initialTaskId, setInitialTaskId] = useState<string | undefined>(undefined);
    const dispatch = useAppDispatch();
    const { tags } = useAppSelector(state => state.tags);
    const { loading: taskTagsLoading } = useAppSelector(state => state.taskTags);
    const { isDeleteConfirmOpen } = useAppSelector(state => state.tasks);
    const isEditing = !!task;

    useEffect(() => {
        if (open) {
            dispatch(fetchTags());
            if (task && task.id !== initialTaskId) {
                // only reset form when it's a different task or new modal open
                setInitialTaskId(task.id);
                form.setFieldsValue({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
                });
            } else if (!task) {
                setInitialTaskId(undefined);
                form.setFieldsValue({
                    title: undefined,
                    description: undefined,
                    priority: TaskPriority.Medium,
                    status: TaskEntityStatus.Todo,
                    dueDate: undefined,
                });
            }
        }
    }, [open, task, form, dispatch, initialTaskId]);

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
        setShowTagSelector(false);
        setInitialTaskId(undefined);
        onClose();
    };

    const handleAddTag = async (tagId: string) => {
        if (isEditing && task) {
            await dispatch(linkTagToTask({ taskId: task.id, tagId }));
            setShowTagSelector(false);
        }
    };

    const handleRemoveTag = async (tagId: string) => {
        if (isEditing && task) {
            await dispatch(unlinkTagFromTask({ taskId: task.id, tagId }));
        }
    };

    const availableTags = tags.filter(
        tag => !task?.tags.some(taskTag => taskTag.id === tag.id)
    );

    const handleDeleteClick = () => {
        if (isEditing && task) {
            dispatch(openDeleteConfirm());
        }
    };

    const handleConfirmDelete = async () => {
        if (isEditing && task) {
            await dispatch(deleteTask(task.id));
            onClose();
        }
    };

    const handleCancelDelete = () => {
        dispatch(closeDeleteConfirm());
    };

    return (
        <>
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

                {isEditing && (
                    <div className="task-tags-section">
                        <div className="tags-header">
                            <label className="ant-form-item-label">Tags</label>
                            <Button 
                                type="dashed" 
                                icon={<PlusOutlined />} 
                                size="small"
                                onClick={() => setShowTagSelector(!showTagSelector)}
                                disabled={availableTags.length === 0}
                            >
                                Add Tag
                            </Button>
                        </div>

                        {showTagSelector && availableTags.length > 0 && (
                            <div className="tag-selector">
                                <Select
                                    placeholder="Select a tag to add"
                                    style={{ width: '100%' }}
                                    onChange={handleAddTag}
                                    loading={taskTagsLoading}
                                    value={undefined}
                                >
                                    {availableTags.map(tag => (
                                        <Select.Option key={tag.id} value={tag.id}>
                                            <div className="tag-option-preview">
                                                <div 
                                                    className="tag-color-box"
                                                    style={{ backgroundColor: tag.color }}
                                                />
                                                {tag.name}
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        {task && task.tags && task.tags.length > 0 && (
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
                                        <CloseOutlined 
                                            className="tag-delete-icon" 
                                            onClick={() => handleRemoveTag(tag.id)}
                                        />
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {isEditing && (
                    <div className="delete-task-section">
                        <Button 
                            danger 
                            block 
                            size="large"
                            onClick={handleDeleteClick}
                            icon={<img src={binIcon} alt="" className="delete-button-icon" />}
                        >
                            Delete Task
                        </Button>
                    </div>
                )}
            </Form>
        </Modal>

        <Modal
            title="Delete Task"
            open={isDeleteConfirmOpen}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
        >
            <p>Are you sure you want to delete this task?</p>
        </Modal>
        </>
    );
};

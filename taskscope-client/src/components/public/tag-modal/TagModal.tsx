import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import type { TagDto } from "../../../models/TagDto";
import type { CreateTagDto } from "../../../models/CreateTagDto";
import type { UpdateTagDto } from "../../../models/UpdateTagDto";
import "./TagModal.scss";

interface TagModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (tag: CreateTagDto | UpdateTagDto) => Promise<void>;
    tag?: TagDto;
}

export const TagModal = ({ open, onClose, onSubmit, tag }: TagModalProps) => {
    const [form] = Form.useForm();
    const isEditing = !!tag;

    useEffect(() => {
        if (open) {
            if (tag) {
                form.setFieldsValue({
                    name: tag.name,
                    color: tag.color || '#1890ff',
                });
            } else {
                form.setFieldsValue({
                    name: undefined,
                    color: '#1890ff',
                });
            }
        }
    }, [open, tag, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const tagData: CreateTagDto | UpdateTagDto = {
                ...(isEditing && { id: tag.id, createdAt: tag.createdAt }),
                name: values.name,
                color: values.color,
            };

            await onSubmit(tagData);
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
            title={isEditing ? "Edit Tag" : "Create New Tag"}
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText={isEditing ? "Update" : "Create"}
            cancelText="Cancel"
            width={400}
            className="tag-modal"
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    label="Tag Name"
                    name="name"
                    rules={[
                        { required: true, message: "Please enter tag name" },
                        { max: 20, message: "Tag name must be less than 20 characters" }
                    ]}
                >
                    <Input placeholder="Enter tag name" />
                </Form.Item>

                <Form.Item
                    label="Color"
                    name="color"
                    rules={[{ required: true, message: "Please select a color" }]}
                >
                    <Input type="color" className="color-picker" />
                </Form.Item>

                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        const color = getFieldValue('color') || '#1890ff';
                        const name = getFieldValue('name') || 'Tag Preview';
                        return (
                            <div className="tag-preview-section">
                                <label className="preview-label">Preview:</label>
                                <div 
                                    className="tag-preview" 
                                    style={{ backgroundColor: color }}
                                >
                                    {name}
                                </div>
                            </div>
                        );
                    }}
                </Form.Item>
            </Form>
        </Modal>
    );
};

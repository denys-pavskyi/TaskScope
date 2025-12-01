import { useEffect, useState } from "react";
import { Button, Card, Empty, Modal } from "antd";
import { PlusOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTags, addTag, editTag, removeTag } from "../../store/slices/tagsSlice";
import { TagModal } from "../../components/public/tag-modal/TagModal";
import type { TagDto } from "../../models/TagDto";
import type { CreateTagDto } from "../../models/CreateTagDto";
import type { UpdateTagDto } from "../../models/UpdateTagDto";
import "./TagsPage.scss";

const { confirm } = Modal;

export const TagsPage = () => {
    const dispatch = useAppDispatch();
    const { tags, loading } = useAppSelector((state) => state.tags);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TagDto | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleCreateTag = () => {
        setEditingTag(undefined);
        setIsModalOpen(true);
    };

    const handleEditTag = (tag: TagDto) => {
        setEditingTag(tag);
        setIsModalOpen(true);
    };

    const handleDeleteTag = (tag: TagDto) => {
        confirm({
            title: 'Delete Tag',
            content: `Are you sure you want to delete "${tag.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                await dispatch(removeTag(tag.id));
            },
        });
    };

    const handleModalSubmit = async (tagData: CreateTagDto | UpdateTagDto) => {
        if ('id' in tagData) {
            await dispatch(editTag(tagData));
        } else {
            await dispatch(addTag(tagData));
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTag(undefined);
    };

    return (
        <div className="tags-page">
            <div className="tags-header">
                <h1>Tags</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateTag}
                >
                    New Tag
                </Button>
            </div>

            {loading && tags.length === 0 ? (
                <div className="tags-loading">Loading tags...</div>
            ) : tags.length === 0 ? (
                <Empty 
                    description="No tags yet"
                    className="tags-empty"
                >
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={handleCreateTag}
                    >
                        Create First Tag
                    </Button>
                </Empty>
            ) : (
                <div className="tags-grid">
                    {tags.map((tag) => (
                        <Card
                            key={tag.id}
                            className="tag-card"
                            hoverable
                        >
                            <div className="tag-card-content">
                                <div 
                                    className="tag-color-indicator"
                                    style={{ backgroundColor: tag.color || '#1890ff' }}
                                />
                                <div className="tag-info">
                                    <h3 className="tag-name">{tag.name}</h3>
                                    <span className="tag-color-hex">{tag.color || '#1890ff'}</span>
                                </div>
                                <div className="tag-actions">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditTag(tag)}
                                        className="edit-button"
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleDeleteTag(tag)}
                                        className="delete-button"
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <TagModal
                open={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                tag={editingTag}
            />
        </div>
    );
};
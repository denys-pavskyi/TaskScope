import { useEffect } from "react";
import { Button, Card, Empty, Modal } from "antd";
import { PlusOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { 
    fetchTags, 
    addTag, 
    editTag, 
    removeTag,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm
} from "../../store/slices/tagsSlice";
import { TagModal } from "../../components/public/tag-modal/TagModal";
import type { TagDto } from "../../models/tags/TagDto";
import type { CreateTagDto } from "../../models/tags/CreateTagDto";
import type { UpdateTagDto } from "../../models/tags/UpdateTagDto";
import "./TagsPage.scss";

export const TagsPage = () => {
    const dispatch = useAppDispatch();
    const { tags, loading, isModalOpen, editingTag, deletingTag } = useAppSelector((state) => state.tags);

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const handleCreateTag = () => {
        dispatch(openCreateModal());
    };

    const handleEditTag = (tag: TagDto) => {
        dispatch(openEditModal(tag));
    };

    const handleDeleteTag = (tag: TagDto) => {
        dispatch(openDeleteConfirm(tag));
    };

    const handleConfirmDelete = async () => {
        if (!deletingTag) return;
        
        try {
            await dispatch(removeTag(deletingTag.id)).unwrap();
        } catch (error) {
            console.error('Failed to delete tag:', error);
        }
    };

    const handleCancelDelete = () => {
        dispatch(closeDeleteConfirm());
    };

    const handleModalSubmit = async (tagData: CreateTagDto | UpdateTagDto) => {
        if ('id' in tagData) {
            await dispatch(editTag(tagData));
        } else {
            await dispatch(addTag(tagData));
        }
    };

    const handleModalClose = () => {
        dispatch(closeModal());
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
                            style={{ backgroundColor: '#1f1f1f' }}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditTag(tag);
                                        }}
                                        className="edit-button"
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTag(tag);
                                        }}
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
                tag={editingTag || undefined}
            />

            <Modal
                title="Delete Tag"
                open={!!deletingTag}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true, loading: loading }}
                cancelButtonProps={{ disabled: loading }}
            >
                <p>Are you sure you want to delete "{deletingTag?.name}"?</p>
            </Modal>
        </div>
    );
};
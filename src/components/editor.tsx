import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import produce from "immer";
import { get, set } from "lodash";

type Criterion = {
    type: "criterion";
    id: string;
    title: string;
    description?: string;
};

type Section = {
    type: "section";
    id: string;
    title: string;
    description?: string;
    sections: Array<Section | Criterion>;
};

const Criterion = styled.div`
    padding: 20px;
    width: 300px;
    border: 2px #000 solid;
    background-color: #ccc;
`;

const sections: Array<Section | Criterion> = [
    {
        id: "root",
        sections: [
            {
                id: "1",
                sections: [
                    {
                        id: "c-1",
                        title: "Criterion A",
                        type: "criterion",
                    },
                    {
                        id: "c-2",
                        title: "Criterion B",
                        type: "criterion",
                    },
                    {
                        id: "c-3",
                        title: "Criterion C",
                        type: "criterion",
                    },
                ],
                title: "Section A",
                type: "section",
            },
            {
                id: "2",
                sections: [
                    {
                        id: "c-4",
                        title: "Criterion D",
                        type: "criterion",
                    },
                    {
                        id: "c-5",
                        title: "Criterion E",
                        type: "criterion",
                    },
                    {
                        id: "c-6",
                        title: "Criterion F",
                        type: "criterion",
                    },
                ],
                title: "Section B",
                type: "section",
            },
            {
                id: "4",
                title: "Criterion AAA",
                type: "criterion",
            },
            {
                id: "3",
                sections: [
                    {
                        id: "c-7",
                        title: "Criterion G",
                        type: "criterion",
                    },
                    {
                        id: "c-8",
                        title: "Criterion H",
                        type: "criterion",
                    },
                    {
                        id: "c-9",
                        title: "Criterion I",
                        type: "criterion",
                    },
                ],
                title: "Section C",
                type: "section",
            },
        ],
        title: "Root",
        type: "section",
    },
];

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number): Array<T> {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

const getPathToSections = (
    sections: Array<Section | Criterion>,
    sectionId: string,
    list: Array<number> = [],
): Array<number> | undefined => {
    for (const [i, section] of sections.entries()) {
        if (section.type === "section") {
            if (section.id === sectionId) {
                return [...list, i];
            } else {
                const subtree = getPathToSections(section.sections, sectionId, [...list, i]);
                if (subtree) {
                    return [...list, ...subtree];
                }
            }
        }
    }
};

interface SectionProps {
    section: Section;
}

const Section: React.FC<SectionProps> = ({ section }) => (
    <div style={{ border: "2px #000 solid", padding: 20 }}>
        <h4>{section.title}</h4>
        <Droppable droppableId={section.id}>
            {(provided) => (
                <Row
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                        border: "2px #000 solid",
                        margin: 20,
                        padding: 20,
                        width: 500,
                    }}
                >
                    {section.sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                                <Col
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        ...provided.draggableProps.style,
                                        paddingBottom: 10,
                                        paddingTop: 10,
                                    }}
                                    span={24}
                                >
                                    {section.type === "section" ? (
                                        <Section section={section} />
                                    ) : (
                                        <Criterion>{section.title}</Criterion>
                                    )}
                                </Col>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </Row>
            )}
        </Droppable>
    </div>
);

const Editor: React.FC = () => {
    const [items, setItems] = useState<Array<Section | Criterion>>(sections);
    const onDragEnd = (result: DropResult): void => {
        if (result.destination) {
            if (result.destination.droppableId === result.source.droppableId) {
                const sourcePath = getPathToSections(items, result.source.droppableId);
                if (sourcePath) {
                    setItems(
                        produce(items, (draftItems) => {
                            const sourceItems = get(items, sourcePath);
                            if (result.destination) {
                                set(draftItems, sourcePath, {
                                    ...sourceItems,
                                    sections: reorder(
                                        sourceItems.sections,
                                        result.source.index,
                                        result.destination.index,
                                    ),
                                });
                            }
                        }),
                    );
                }
            } else {
                const destinationPath = getPathToSections(items, result.destination.droppableId);
                const sourcePath = getPathToSections(items, result.source.droppableId);
                if (destinationPath && sourcePath) {
                    setItems(
                        produce(items, (draftItems) => {
                            const sourceItems = get(items, sourcePath) as Section;
                            const destinationItems = get(items, destinationPath) as Section;
                            if (result.destination) {
                                const newItem = sourceItems.sections[result.source.index];
                                set(draftItems, destinationPath, {
                                    ...destinationItems,
                                    sections: [
                                        ...destinationItems.sections.slice(
                                            0,
                                            result.destination.index,
                                        ),
                                        newItem,
                                        ...destinationItems.sections.slice(
                                            result.destination.index,
                                        ),
                                    ],
                                });
                                set(draftItems, sourcePath, {
                                    ...sourceItems,
                                    sections: sourceItems.sections.filter(
                                        (section, index) => index !== result.source.index,
                                    ),
                                });
                            }
                        }),
                    );
                }
            }
        }
    };

    const root = sections[0];

    if (!root || root.type !== "section") {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Section section={root} />
        </DragDropContext>
    );
};

export default Editor;

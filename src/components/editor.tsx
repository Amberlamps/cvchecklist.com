/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import produce from "immer";
import { get, set, cloneDeep } from "lodash";

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
                    // {
                    //     id: "c-2",
                    //     title: "Criterion B",
                    //     type: "criterion",
                    // },
                    // {
                    //     id: "c-3",
                    //     title: "Criterion C",
                    //     type: "criterion",
                    // },
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
                    // {
                    //     id: "c-5",
                    //     title: "Criterion E",
                    //     type: "criterion",
                    // },
                    // {
                    //     id: "c-6",
                    //     title: "Criterion F",
                    //     type: "criterion",
                    // },
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
                    // {
                    //     id: "c-8",
                    //     title: "Criterion H",
                    //     type: "criterion",
                    // },
                    // {
                    //     id: "c-9",
                    //     title: "Criterion I",
                    //     type: "criterion",
                    // },
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
): Array<number | string> | undefined => {
    for (const [i, section] of sections.entries()) {
        if (section.type === "section") {
            if (section.id === sectionId) {
                return list.length === 0 ? [i] : [...list, i];
            } else {
                const subtree = getPathToSections(section.sections, sectionId, [i]);
                if (subtree) {
                    return [...list, ...subtree];
                }
            }
        }
    }
};

interface SectionProps {
    section: Section;
    isDragging?: boolean;
}

const Section: React.FC<SectionProps> = ({ section, isDragging = false }) => (
    <div style={{ background: "#aaa", border: "2px #000 solid", margin: 20, padding: 20 }}>
        <h4>{section.title}</h4>
        <Droppable droppableId={section.id}>
            {(provided) => (
                <Row
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                        background: "#ccc",
                        border: "2px #000 solid",
                        minHeight: 50,
                        // margin: 20,
                        // padding: 20,
                    }}
                >
                    {section.sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided, snapshot) => (
                                <Col
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        ...provided.draggableProps.style,
                                        // paddingBottom: 10,
                                        // paddingTop: 10,
                                    }}
                                    span={24}
                                >
                                    {section.type === "section" ? (
                                        <Section
                                            section={section}
                                            isDragging={snapshot.isDragging}
                                        />
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
                    const _sourcePath = sourcePath.join(" sections ").split(" ");
                    setItems(
                        produce(items, (draftItems) => {
                            const sourceItems = get(items, _sourcePath);
                            if (result.destination) {
                                set(draftItems, _sourcePath, {
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
                console.log(result);
                console.log(sourcePath);
                console.log(destinationPath);
                if (destinationPath && sourcePath) {
                    const _sourcePath = sourcePath.join(" sections ").split(" ");
                    const _destinationPath = destinationPath.join(" sections ").split(" ");
                    console.log(_sourcePath);
                    console.log(_destinationPath);
                    setItems(
                        produce(items, (draftItems) => {
                            const sourceItems = get(draftItems, _sourcePath) as Section;
                            if (result.destination) {
                                const newItem = cloneDeep(
                                    sourceItems.sections[result.source.index],
                                );
                                console.log(sourceItems);
                                set(draftItems, _sourcePath, {
                                    ...sourceItems,
                                    sections: sourceItems.sections.filter(
                                        (section, index) => index !== result.source.index,
                                    ),
                                });
                                const destinationItems = get(
                                    draftItems,
                                    _destinationPath,
                                ) as Section;
                                console.log(destinationItems);
                                set(draftItems, _destinationPath, {
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
                            }
                        }),
                    );
                }
            }
        }
    };

    const root = items[0];

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

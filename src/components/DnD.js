import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

class DnD extends Component{
    constructor(){
        super();
        this.state = {
            pengColumns: {},
            exercise: ""
        };
        this._onDragEnd = this._onDragEnd.bind(this);
    }
    componentDidMount(){
        this.setState({
            pengColumns : { 
                ["col-1"]: {
                    name: "Data",
                    items: this.props.data,
                    done: "false",
                    purple: 0
                },
                ["col-2"]: {
                    name: "Penguin",
                    items: [],
                    done: "false",
                    purple: 0
                }
            },
            // exercise: this.props.exercise
        });
    }

    _onDragEnd = (result, columns) => {
        
        
        if (!result.destination) return;
        const { source, destination } = result;
      
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns[source.droppableId];
          const destColumn = columns[destination.droppableId];
          const sourceItems = [...sourceColumn.items];
          const destItems = [...destColumn.items];
          const [removed] = sourceItems.splice(source.index, 1);
          if(removed.id.charAt(1) === 'p'){
            destColumn["purple"] += 1;
            sourceColumn["purple"] -= 1;
          }
          destItems.splice(destination.index, 0, removed);
          console.log(destItems);
          if(destination.droppableId === "col-2"){
            let ids = "";
            destItems.forEach(item => {
                ids += item.id.substring(3);
            });
            if(ids === "12345"){
                console.log("Done!");
                destColumn["done"] = "true";
                this.props.done();
                this.props.countPurple(destColumn["purple"]);
            }
          }
          this.setState({ pengColumns: {
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems
            }
          }});
        } else {
          const column = columns[source.droppableId];
          const copiedItems = [...column.items];
          const [removed] = copiedItems.splice(source.index, 1);
          copiedItems.splice(destination.index, 0, removed);
          this.setState({ pengColumns: {
            ...columns,
            [source.droppableId]: {
              ...column,
              items: copiedItems
            }
          }});
        }
    }

    render(){
        return(
            <div className="Dnd">
                <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                    <DragDropContext
                    onDragEnd={result => this._onDragEnd(result, this.state.pengColumns)}
                    >
                    {Object.entries(this.state.pengColumns).map(([columnId, column], index) => {
                        return (
                        <div
                            style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                            }}
                            key={columnId}
                        >
                            <h2>{column.name}</h2>
                            <div style={{ margin: 8, border: this.props.border }}>
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => {
                                return (
                                    <div
                                    {...provided.droppableProps}
                                    id="droppable"
                                    ref={provided.innerRef}
                                    style={{
                                        border: this.props.border === 'none' && column.done === "true" ? 
                                        "5px solid green"
                                        : "none",
                                        background: this.props.border !== 'none' ? 
                                        "#BE7474"
                                        : column.done === "true" 
                                        ? "DarkSeaGreen" 
                                        : snapshot.isDraggingOver 
                                        ? "lightblue" 
                                        : "lightgrey",
                                        padding: 4,
                                        width: 500,
                                        height: 400,
                                        scrollBehavior:"smooth",
                                        overflowY: "scroll"
                                    }}
                                    >
                                    {column.items.map((item, index) => {
                                        return (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => {
                                            return (
                                                <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    userSelect: "none",
                                                    margin: 8,
                                                    minHeight: "40px",
                                                    backgroundColor: snapshot.isDragging
                                                    ? "#263B4A"
                                                    : "#456C86",
                                                    color: "white",
                                                    ...provided.draggableProps.style
                                                }}
                                                >
                                                <div className="image-container">
                                                <img src={item.content} alt="triangle"/>
                                                </div>
                                                </div>
                                            );
                                            }}
                                        </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                    
                                    </div>
                                );
                                }}
                            </Droppable>
                            </div>
                        </div>
                        );
                    })}
                    </DragDropContext>
                </div>
            </div>
        );
    }
}
export default DnD;
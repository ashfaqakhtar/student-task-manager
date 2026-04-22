import TaskForm from "./TaskForm";

export default function NewTaskModal(props) {
  return (
    <div className="modal-backdrop" onClick={props.onClose}>
      <div className="modal-card modal-card--slide" onClick={(event) => event.stopPropagation()}>
        <TaskForm {...props} title="New task" />
      </div>
    </div>
  );
}

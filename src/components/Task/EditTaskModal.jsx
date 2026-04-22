import TaskForm from "./TaskForm";

export default function EditTaskModal(props) {
  return (
    <div className="modal-backdrop" onClick={props.onClose}>
      <div className="modal-card modal-card--slide" onClick={(event) => event.stopPropagation()}>
        <TaskForm {...props} title="Edit task" />
      </div>
    </div>
  );
}

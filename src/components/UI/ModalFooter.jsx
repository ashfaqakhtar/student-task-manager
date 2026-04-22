import Button from "./Button";

export default function ModalFooter({
  cancelLabel = "Cancel",
  submitLabel = "Save",
  onCancel,
}) {
  return (
    <footer className="modal-footer">
      <Button type="button" variant="ghost" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit">{submitLabel}</Button>
    </footer>
  );
}

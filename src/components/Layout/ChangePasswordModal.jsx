"use client";

import { useState } from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";

export default function ChangePasswordModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card--slide" onClick={(event) => event.stopPropagation()}>
        <form
          className="task-form"
          onSubmit={async (event) => {
            event.preventDefault();
            if (form.newPassword !== form.confirmPassword) {
              return setError("New passwords do not match.");
            }
            setLoading(true);
            setError("");
            try {
              await onSubmit({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
              });
              onClose();
            } catch (submitError) {
              setError(submitError.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="modal-card__header modal-card__header--stacked">
            <div>
              <p className="modal-card__eyebrow">Security</p>
              <h2>Change password</h2>
            </div>
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
          <label>
            <span>Current password</span>
            <Input
              type="password"
              value={form.currentPassword}
              onChange={(event) =>
                setForm({ ...form, currentPassword: event.target.value })
              }
            />
          </label>
          <label>
            <span>New password</span>
            <Input
              type="password"
              value={form.newPassword}
              onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
            />
          </label>
          <label>
            <span>Confirm new password</span>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm({ ...form, confirmPassword: event.target.value })
              }
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{loading ? "Saving" : "Update password"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

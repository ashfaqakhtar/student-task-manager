"use client";

import { useEffect } from "react";
import Button from "../UI/Button";

export default function AdminView({ data, onLoad, onUpdateRole, onDeleteTask }) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className="view-stack">
      <section className="stats-grid">
        <article className="metric-tile">
          <strong>{data.users.length}</strong>
          <span>Users</span>
        </article>
        <article className="metric-tile">
          <strong>{data.tasks.length}</strong>
          <span>Tasks indexed</span>
        </article>
        <article className="metric-tile">
          <strong>{data.users.filter((user) => user.role === "admin").length}</strong>
          <span>Admins</span>
        </article>
        <article className="metric-tile">
          <strong>{data.users.filter((user) => user.isVerified).length}</strong>
          <span>Verified users</span>
        </article>
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>Users</h2>
        </div>
        <div className="admin-table">
          {data.users.map((user) => (
            <div key={user.id} className="admin-table__row">
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <div>
                <span>{user.taskCount} tasks</span>
                <span>{user.isVerified ? "Verified" : "Pending"}</span>
              </div>
              <div className="admin-table__actions">
                <Button
                  variant="secondary"
                  onClick={() => onUpdateRole(user.id, user.role === "admin" ? "user" : "admin")}
                >
                  Make {user.role === "admin" ? "user" : "admin"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>Recent tasks</h2>
        </div>
        <div className="admin-table">
          {data.tasks.map((task) => (
            <div key={task.id} className="admin-table__row">
              <div>
                <strong>{task.title}</strong>
                <span>{task.subject}</span>
              </div>
              <div>
                <span>{task.status}</span>
                <span>{task.priority}</span>
              </div>
              <div className="admin-table__actions">
                <Button variant="ghost" onClick={() => onDeleteTask(task.id)}>
                  Delete task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

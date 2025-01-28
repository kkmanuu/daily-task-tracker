import React, { useState, useEffect } from "react";
import { Button, Card, Form, Badge } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import axios from "axios";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [status, setStatus] = useState("Not Done");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTodos(response.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!date || !day || !activity) {
      setError("All fields are required.");
      return;
    }
    setError("");

    const newTodo = { date, day, activity, status };
    try {
      const response = await axios.post("http://localhost:5000/todos", newTodo);
      setTodos([...todos, response.data]);
      setDate("");
      setDay("");
      setActivity("");
      setStatus("Not Done");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center py-5 text-white" style={{ background: "linear-gradient(90deg, #007bff, #6610f2)" }}>
        <h1>📋 Todo Planner</h1>
        <p>Organize your tasks and stay productive!</p>
      </div>
      <Card className="shadow mt-4">
        <Card.Header className="bg-dark text-white">
          <h5>Add New Task</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddTodo}>
            <Form.Group className="mb-3">
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Day:</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Monday"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Activity:</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Grocery Shopping"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status:</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Not Done">Not Done</option>
                <option value="Done">Done</option>
              </Form.Select>
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
            <Button type="submit" variant="primary" className="w-100">
              Add Task
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-5">
        <h4 className="mb-3">Your Tasks</h4>
        {todos.length > 0 ? (
          <div className="row">
            {todos.map((todo) => (
              <div className="col-md-6 mb-4" key={todo.id}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{todo.activity}</h5>
                        <p className="mb-1">
                          <strong>Date:</strong> {todo.date}
                        </p>
                        <p className="mb-1">
                          <strong>Day:</strong> {todo.day}
                        </p>
                        <Badge bg={todo.status === "Done" ? "success" : "danger"}>
                          {todo.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <TrashFill />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No tasks to display. Add some tasks to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Todo;

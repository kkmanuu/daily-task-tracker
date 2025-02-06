import React, { useState, useEffect } from "react";
import { Button, Card, Form, Badge, Container, Row, Col } from "react-bootstrap";
import { TrashFill, PencilFill } from "react-bootstrap-icons";
import axios from "axios"; 
import { addTodo } from "./addTodo"; 
import { deleteTodo } from "./deleteTodo";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [status, setStatus] = useState("Not Done");
  const [error, setError] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

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
      const addedTodo = await addTodo(newTodo); 
      setTodos([...todos, addedTodo]);
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
      await deleteTodo(id); 
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setDate(todo.date);
    setDay(todo.day);
    setActivity(todo.activity);
    setStatus(todo.status);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (!date || !day || !activity) {
      setError("All fields are required.");
      return;
    }
    setError("");

    const updatedTodo = { date, day, activity, status };
    try {
      const response = await axios.put( 
        `http://localhost:5000/todos/${editingTodo.id}`,
        updatedTodo
      );
      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? response.data : todo))
      );
      setEditingTodo(null); // Clear the editing state
      setDate("");
      setDay("");
      setActivity("");
      setStatus("Not Done");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <Container className="mt-5 p-4 shadow-lg rounded" style={{ backgroundColor: "#f8f9fa", maxWidth: "800px" }}>
      <div className="text-center py-4 text-white rounded-top" style={{ background: "linear-gradient(90deg, #007bff, #6610f2)" }}>
        <h1>📋 Todo Planner</h1>
        <p>Organize your tasks and stay productive!</p>
      </div>

      <Card className="mt-4 shadow-sm">
        <Card.Header className="bg-dark text-white">
          <h5>{editingTodo ? "Edit Task" : "Add New Task"}</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date:</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Day:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Monday"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
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
              {editingTodo ? "Update Task" : "Add Task"}
            </Button>
            {editingTodo && (
              <Button
                variant="secondary"
                className="w-100 mt-2"
                onClick={() => {
                  setEditingTodo(null);
                  setDate("");
                  setDay("");
                  setActivity("");
                  setStatus("Not Done");
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-5">
        <h4 className="mb-4">Your Tasks</h4>
        {todos.length > 0 ? (
          <Row>
            {todos.map((todo) => (
              <Col md={12} key={todo.id} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={8}>
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
                      </Col>
                      <Col md={4} className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditTodo(todo)}
                        >
                          <PencilFill />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <TrashFill />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">No tasks to display. Add some tasks to get started!</p>
        )}
      </div>
    </Container>
  );
};

export default Todo;
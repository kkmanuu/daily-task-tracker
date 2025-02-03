import axios from "axios";

export const addTodo = async (newTodo) => {
  try {
    const response = await axios.post("http://localhost:5000/todos", newTodo);
    return response.data; 
  } catch (err) {
    console.error("Error adding todo:", err);
    throw err;
  }
};
import axios from "axios";

export const deleteTodo = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    return id; 
  } catch (err) {
    console.error("Error deleting todo:", err);
    throw err;
  }
};
import React, { useState, useEffect } from "react";

const Home = () => {
    const [taskLabel, setTaskLabel] = useState("");
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const USER_NAME = "CristhianS-17";
    const API_URL_USER = "https://playground.4geeks.com/todo/users/CristhianS-17";
    const API_URL_TODOS = "https://playground.4geeks.com/todo/todos/CristhianS-17";
;

    const loadTasks = () => {
        fetch(API_URL_USER)
            .then((response) => {
                if (response.status === 404) {
                    createUser();
                    return { todos: [] };
                }
                if (!response.ok) throw new Error("Error en el servidor");
                return response.json();
            })
            .then((data) => {
                
                setAllTasks(data.todos || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error cargando:", error);
                setLoading(false);
            });
    };

    const createUser = () => {
        fetch(API_URL_USER, { method: "POST" })
            .then(() => loadTasks())
            .catch((err) => console.error("Error al crear usuario", err));
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleAddTask = (e) => {
        if (e.key === "Enter" && taskLabel.trim() !== "") {
            const newTask = { label: taskLabel.trim(), is_done: false };
            fetch(API_URL_TODOS, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            })
            .then(res => res.json())
            .then(data => {
                setAllTasks([...allTasks, data]);
                setTaskLabel("");
            });
        }
    };

    const deleteTask = (todoId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, { 
        method: "DELETE" 
    })
    .then(res => {
        if (res.ok) {
            setAllTasks(allTasks.filter(t => t.id !== todoId));
        } else {
            console.error("No se pudo borrar la tarea en el servidor");
        }
    })
    .catch(err => console.error("Error al borrar:", err));
};

    
    if (loading) return <div className="container"><h1 className="title">Loading...</h1></div>;

    return (
        <div className="container">
            <h1 className="title">todos</h1>
            <div className="todo-card">
                <input
                    className="todo-input"
                    type="text"
                    placeholder="What needs to be done?"
                    value={taskLabel}
                    onChange={(e) => setTaskLabel(e.target.value)}
                    onKeyDown={handleAddTask}
                />
                <ul className="todo-list">
                    {allTasks && allTasks.length === 0 ? (
                        <li className="todo-item empty-msg">No tasks, add a new one!</li>
                    ) : (
                        allTasks.map((task) => (
                            <li key={task.id} className="todo-item fade-in">
                                <div className="todo-content">
                                    <span className="bullet"></span>
                                    <span className="task-text">{task.label}</span>
                                </div>
                                <button className="delete-button" onClick={() => deleteTask(task.id)}>×</button>
                            </li>
                        ))
                    )}
                </ul>
                <div className="footer">
                    <span>{allTasks.length} items left</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
//fetch("http://localhost:3000/posts").then(res =>res.json()).then(data=> console.log(data))

//MVC - 
// Model manage the data
// View manage the UI, what users will see
// Controller handle events, interact with Model and View



//UI

//MVC

//db

let idNumber =1;

const APIs = (()=>{
    const baseURL ="http://localhost:3000/todos";
    const getTodos = ()=>{
        return fetch(baseURL).then((res)=>res.json());
    }
   
    const createTodo = (newTodo)=>{
       return fetch(baseURL,{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
       }).then((res) => res.json());
    } 
   
    const deleteTodo = (id) =>{

        return fetch(`${baseURL}/${id}`,{
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
            }
        }).then((res)=> res.json())
    }


    return {
        getTodos,
        createTodo,
        deleteTodo
    }
})();

const Model=(() =>{
  class State {
    #todos;
    #onChange;
    constructor(){
        this.#todos = [];
    }

    get todos(){
        return this.#todos;
    }

    set todos(newTodos){
        this.#todos = newTodos;
        this.#onChange();
    }

    subscribe(cb){
        this.#onChange = cb;
    }
  }
const {getTodos,createTodo,deleteTodo} = APIs;
  return { State, getTodos, createTodo, deleteTodo}
})();

const View = (() =>{
  const todolistEl = document.querySelector(".todo__list");
  const inputEl = document.querySelector(".todo__input");
  const addBtnEl = document.querySelector(".todo__add-btn")

  const getInputValue = () =>{
   return inputEl.value;
   
  };

  const clearInput = ()=>{
    inputEl.value="";
  };

  const renderTodos = (todos) =>{
    let todosTemplate ="";
    todos.forEach((todo)=>{
        const content = todo.content
        const todoItem = `
        <li id=${todo.id}>
        <span class="list_font">${content}</span>
        <button class="todo__delete-btn">Delete</button>
        </li>
        `;
        todosTemplate +=todoItem;
    })

    todolistEl.innerHTML= todosTemplate
  }

  return{
    getInputValue,
    clearInput,
    renderTodos,
    addBtnEl,
    todolistEl
  };

})();

const Controller = ((view,model) =>{
  const state = new model.State();
  
  const setUpAddHandler = ()=>{
    View.addBtnEl.addEventListener("click",(event) =>{
        event.preventDefault();
        const inputValue = View.getInputValue();
        console.log(inputValue);
        const newTodo ={
            content: inputValue,
        };
        model.createTodo(newTodo).then((data)=>{

            console.log("create todo",data);
            state.todos = [...state.todos, data];
            View.clearInput();
        })
    })
  }

  const setUpDeleteHandler = () =>{
    view.todolistEl.addEventListener("click",(event)=>{
        const element = event.target;
        console.log(element.className);
        if(element.className === "todo__delete-btn"){
            const id = element.parentElement.getAttribute("id");
            model.deleteTodo(id).then((data)=>{
                state.todos = state.todos.filter((item) => item.id !==  id);
            })
        }
    })
  }

  const init = ()=>{
    model.getTodos().then((data) =>{
        state.todos =data;
    })
  }

  const bootstrap = () =>{
    init();
    state.subscribe(()=>{
        view.renderTodos(state.todos)
    })
    setUpAddHandler();
    setUpDeleteHandler();
  }

  return{
    bootstrap,
  }
})(View,Model);

Controller.bootstrap();


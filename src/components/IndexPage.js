// src/components/IndexPage.js
import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

// import React from 'react';
// import AthletePreview from './AthletePreview';
// import athletes from '../models/athletes';
// import TodoApp from './ticket_form';

const Title = ({todoCount}) => {
  return (
    <div>
       <div>
          <h1>to-do ({todoCount})</h1>
       </div>
    </div>
  );
}

const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>
      <input className="form-control col-md-12" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};

const Todo = ({todo, remove}) => {
  // Each Todo
  console.log("HERE"+ todo._id);
  return (<a href="#" className="list-group-item" onClick={() => {
  console.log("TODO:"+todo._id);
  	remove(todo._id)}}>{todo.text}</a>);
}

const TodoList = ({todos, remove}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
  	console.log("todoKEy: "+ todo._id);
  	console.log("This"+ remove);
    return (<Todo todo={todo} key={todo._id} remove={remove}/>)
  });
  return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

// Contaner Component
// Todo Id
export default class IndexPage extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    }
    this.apiUrl = '/api/list';
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }

  componentWillMount(){
  	this._fetchList();
  }

  _fetchList(){
  	    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }

  // Add todo handler
  addTodo(val){
  	console.log("Value: "+val);
    // Assemble data
    let todo = {text: val};
    console.log(todo);
    // Update data
    console.log(this.apiUrl);
    axios.post(this.apiUrl, todo)
       .then((res) => {
       	console.log(res);
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       })
       .catch((error) =>{
       		console.log(error);
       });
       this._fetchList();
  }
  // Handle remove
  handleRemove(id){
  	    console.log("id:"+id);
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
    	console.log("R:"+todo._id);
      if(todo._id !== id) return todo;
    });

    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      })
  }

  render(){
    // Render JSX
    return (
      <div>
        <Title todoCount={this.state.data.length}/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}/>
      </div>
    );
  }
}
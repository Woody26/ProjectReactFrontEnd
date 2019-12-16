import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DinosaurList from '../../components/dinosaurs/DinosaurList';
import DinosaurDetail from '../../components/dinosaurs/DinosaurDetail';
import DinosaurCreateForm from '../../components/dinosaurs/DinosaurCreateForm';
import DinosaurEditForm from '../../components/dinosaurs/DinosaurEditForm';
import Request from '../../helpers/request';

class DinosaurContainer extends Component {

  constructor(props){
    super(props);
    this.state = {
      dinosaurs: []
    }
    this.findDinosaurById = this.findDinosaurById.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }
  componentDidMount(){
    const request = new Request();

    request.get('http://localhost:8080/api/dinosaurs')
    .then((data) => {
      // console.log("Data: ", data);
      this.setState({dinosaurs: data._embedded.dinosaurs})
    }
  )
}

findDinosaurById(id){
  return this.state.dinosaurs.find((dinosaur) => {
    return dinosaur.id === parseInt(id);
  });
}

handleDelete(id){
  const request = new Request();
  const url = 'http://localhost:8080/api/dinosaurs/' + id;
  request.delete(url).then(() => {
    window.location = '/dinosaurs'
  })
}

handlePost(dinosaur){
  const request = new Request();
  request.post('http://localhost:8080/api/dinosaurs/', dinosaur).then(() => {
    window.location = '/dinosaurs'
  })
}

handleUpdate(dinosaur, id){
  const request = new Request();
  request.patch('http://localhost:8080/api/dinosaurs/' + id, dinosaur).then(() => {
    window.location = '/dinosaurs/' + id
  })
}

render(){
  return(
    <Router>
    <Fragment>
    <Switch>

    <Route exact path="/dinosaurs/new" render={() => {
      return <DinosaurCreateForm onFormSubmit={this.handlePost}/>
    }}/>

    <Route exact path="/dinosaurs/:id/edit" render={(props) => {
      const id = props.match.params.id;
      const dinosaur = this.findDinosaurById(id);
      return <DinosaurEditForm dinosaur={dinosaur} handleDinosaurUpdate={this.handleUpdate} />
    }}/>

    <Route exact path='/dinosaurs/:id' render={(props) => {
      const id = props.match.params.id;
      const dinosaur = this.findDinosaurById(id);
      return <DinosaurDetail dinosaur={dinosaur} onDelete={this.handleDelete}/>
    }}/>

    <Route render={(props) => {
      return <DinosaurList dinosaurs={this.state.dinosaurs}/>
    }}/>


    </Switch>
    </Fragment>
    </Router>
  )
}
}
export default DinosaurContainer;

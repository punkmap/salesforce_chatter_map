import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import config from './config'
import ReactMap from './components/organisms/ReactMap'

const nodeAppRoot = 'https://woesoflightning.com/esri_salesforce_api/'
//const nodeAppRoot = 'http://localhost:4001/'
const sandboxRoot = 'https://carync--zeus.lightning.force.com/'
//const callbackRoot = "https://localhost:8080"
const callbackRoot = "https://woesoflightning.com"

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      sessionTokenObj: null,
      sessionParameters: null,
    }
  }
  componentWillMount(){
    const self = this
    const port = '8080'
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');
    if(code === null){
      const url = nodeAppRoot+"getclientid/"
      axios({
        method: 'post'
        , url:  url
      })
      .then(function (response) {
        window.location = sandboxRoot + "services/oauth2/authorize?response_type=code&client_id="+response.data+"&redirect_uri="+callbackRoot+"&state="+urlParams.get('state');  
      })
    }  
    else{
      var reqBody = 'code='+code;
      self.setState({sessionParameters:urlParams.get('state')})
      axios({
        method: 'post'
        , url:  nodeAppRoot+"settoken/"
        , data: {
          code:code
        }
      })
      .then(function(response){
        self.setState({sessionTokenObj:response.data.data})
      })
      .catch(function (error) {
      });
    }  
  }
  render() {
    return (
      <div className="App">
        <ReactMap 
          nodeAppRoot={nodeAppRoot}
          sessionParameters={this.state.sessionParameters}
          sandboxRoot = {sandboxRoot}
        />
      </div>
    );
  }
}

export default App;
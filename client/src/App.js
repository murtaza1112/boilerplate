import './App.css';
import {useState,useEffect} from "react";
import axios from "axios";

function App() {
  const [user,setUser] = useState({});

  useEffect(()=>{
    const fetchData = async ()=>{
      const cur = await axios.post("/api/login", {
        email: "mur@dsa.com",
        password: "mustafa",
      });
      console.log(cur);
      setUser(cur);
    };
    fetchData();

  },[]);
  console.log(user);
  return (
    <div className="App">
    </div>
  );
}

export default App;

import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore"
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyAMJbLHscz5AIoAk_sDgKj5HQ35Rxg1wK8",
  authDomain: "requiem-collective.firebaseapp.com",
  projectId: "requiem-collective",
  storageBucket: "requiem-collective.appspot.com",
  messagingSenderId: "533584097808",
  appId: "1:533584097808:web:ce8bf693bb6e1dd67e1095"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/art" element={<Art/>} />
          <Route path="/music" element={<Music/>} />
          <Route path="/fashion" element={<Fashion/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function HeaderNav(props) {
  const active = props.active
  return (
    <div className="HeaderNav">
      <header>
        <h1>REQUIEM BULLETIN</h1>
      </header>
      <nav>
        <div className={`nav-item ${active === "main"? "active": ""}`}><Link to="/">Main</Link></div>
        <div className={`nav-item ${active === "art"? "active": ""}`}><Link to="/art">Art</Link></div>
        <div className={`nav-item ${active === "music"? "active": ""}`}><Link to="/music">Music</Link></div>
        <div className={`nav-item ${active === "fashion"? "active": ""}`}><Link to="/fashion">Fashion</Link></div>
      </nav>
    </div>
  )
}

function Footer() {
  return (
    <div className="Footer">
      ©REQUIEM Collective 2022
    </div>
  )
}

function AddPost(props) {
  const category = props.category
  const [text, setText] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, category), {
        name: name || "Anonymous",
        text: text,
        created: Timestamp.now()
      })
      alert("Post submitted!")
    }catch (e) {
      alert(e)
    }

    setName("")
    setText("")
  }

  return (
    <div className="AddPost">
      <form onSubmit={handleSubmit}>
        <div className="row-one">
          <textarea value={text} onChange={(e) => {setText(e.target.value)}} placeholder="Enter text here..." required/>
          <button type="submit">Post</button>
        </div>
        <input value={name} onChange={(e) => {setName(e.target.value)}} type="text" placeholder="Name (leave blank for anonymous)"/>
      </form>
    </div>
  )
}

function Posts(props) {
  const category = props.category
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    let test = false
    const q = query(collection(db, category), orderBy('created', 'desc'))
    onSnapshot(q, (querySnapshot) => {
      if(!test)
      setPosts(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
    return () => {
      test=true
    }
  }, [category])


  return (
    <div className="Posts">
      {posts.map((post) => {return <Post key={post.id} post={post.data}/>})}
    </div>
  )
}

function Post(props) {
  const post = props.post
  return (
    <div className="Post">
      <div className="title">
        <h4>{post.name}</h4>
        <p>{post.created.toDate().toUTCString()}</p>
      </div>
      <p>{post.text}</p>
    </div>
  )
}

function Home() {
  return (
    <div className="Home">
      <HeaderNav active="main"/>
      <AddPost category="main"/>
      <Posts category="main"/>
      <Footer/>
    </div>
  )
}

function Art() {
  return (
    <div className="Art">
      <HeaderNav active="art"/>
      <AddPost category="art"/>
      <Posts category="art"/>
      <Footer/>
    </div>
  )
}

function Music() {
  return (
    <div className="Music">
      <HeaderNav active="music"/>
      <AddPost category="music"/>
      <Posts category="music"/>
      <Footer/>
    </div>
  )
}

function Fashion() {
  return (
    <div className="Fashion">
      <HeaderNav active="fashion"/>
      <AddPost category="fashion"/>
      <Posts category="fashion"/>
      <Footer/>
    </div>
  )
}

export default App;

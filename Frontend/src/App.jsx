import './App.css'

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold text-cyan-600">Hello world!</h1>
      <button onClick={() => window.open("http://localhost:8000/api/v1/auth/google", "_self")}>
        Login with Google
      </button>
    </>
  )
}

export default App

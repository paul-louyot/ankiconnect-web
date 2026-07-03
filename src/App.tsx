import {useState} from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center">
        <form className="flex flex-col gap-4">
          <input type="text" name="front" className="input" />
          <input type="text" name="back" className="input" />
          <select name="deckName" className="select">
            <option>All::Dev</option>
            <option>All::Gen</option>
            <option>All::Quotes</option>
            <option>All::Lang::English</option>
          </select>
          <button type="submit" className="btn">
            submit
          </button>
        </form>
      </div>
    </>
  );
}

export default App;

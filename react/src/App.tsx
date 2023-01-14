import { Home } from '../views/Home';
import { ThemeProvider } from '../contexts';
function App() {

  return (
    <div className="App">
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </div>
  );
};

export default App;

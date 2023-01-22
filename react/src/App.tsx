import { LanguageProvider } from './contexts/LanguageContext/LanguageProvider';
import { Home } from './views/Home';

function App() {

  return (
    <div className="App">
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </div>
  );
};

export default App;

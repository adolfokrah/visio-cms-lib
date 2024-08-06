import { Cms } from './components';
import './styles/tailwind.css';

function App() {
  return (
    <Cms
      projectId="urhvrfatpmdbwttotlwc"
      supabaseProjectUrl="https://urhvrfatpmdbwttotlwc.supabase.co"
      supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyaHZyZmF0cG1kYnd0dG90bHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MTIyNDAsImV4cCI6MjAzNzk4ODI0MH0.6oTSoUtEAVdSxUa4ws9PgXEnHCiFCsgXTawwbtOBDh8"
    />
  );
}

export default App;

import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PropertyList } from './pages/PropertyList'
import { PropertyDetail } from './pages/PropertyDetail'
import { Search } from './pages/Search'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PropertyList />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="search" element={<Search />} />
      </Route>
    </Routes>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { Home } from './pages/Home'
import { Lobby } from './pages/Lobby'
import { Session } from './pages/Session'
import { Summary } from './pages/Summary'

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/room/:id" element={<Lobby />} />
					<Route path="/session/:id" element={<Session />} />
					<Route path="/summary/:id" element={<Summary />} />
					<Route path="/auth/callback" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

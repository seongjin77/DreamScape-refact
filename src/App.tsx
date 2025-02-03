import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import GlobalStyle from './common/global-styled';
import ModalProvider from './context/ModalProvider';
import ModalContainer from './container/ModalContainer';
import { DeviceTypeProvider } from './context/DeviceTypeProvider';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <DeviceTypeProvider>
        <ModalProvider>
          <AppRoutes />
          <GlobalStyle />
          <ModalContainer />
        </ModalProvider>
      </DeviceTypeProvider>
      <ToastContainer
        limit={3}
        position="top-center"
        autoClose={2000}
        style={{ zIndex: 10000 }}
        theme="colored"
      />
    </Router>
  );
}

export default App;

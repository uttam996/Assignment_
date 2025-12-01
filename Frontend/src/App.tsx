import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/home";
import LoginPage from "./page/login";
import SignupPage from "./page/sign-up";
import { RequestList } from "./page/Request/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Userlist } from "./page/User/page";

function App() {

  const queryClient = new QueryClient();
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Route for Login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Nested Routes for Home */}
          <Route path="/" element={<Home />}>
          <Route path="/request" element={<RequestList />} />
          <Route path="/user" element={<Userlist />} />
            {/* Nested Routes under /home */}
          </Route>

          {/* Redirect unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </>
  );
}

export default App;

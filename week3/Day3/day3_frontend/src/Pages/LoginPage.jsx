import Loginform from "../components/LoginForm";
function LoginPage({ onLoginSuccess }) {
  return (
    <>
      <Loginform onLoginSuccess={onLoginSuccess} />
    </>
  );
}
export default LoginPage;

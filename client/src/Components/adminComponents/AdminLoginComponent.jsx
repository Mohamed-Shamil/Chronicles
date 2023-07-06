import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginValidation from "../../hooks/loginValidation";
import toastifyNotifications from "../../Config/toastifyConfig";
import { useDispatch } from "react-redux";
import { setDetails } from "../../redux/Slices/adminSlice";
import adminApi from "../../Api/adminApi";

export const Adminlogin = () => {
    // eslint-disable-next-line no-unused-vars
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  const { adminLogin } = adminApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { handleInputs, isValidForm, loginForm, errors } = loginValidation();
  const { invalidCredToast, invalidLogin } = toastifyNotifications();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setPassword(e.target.value);

      const validForm = await isValidForm(e);

      if (!validForm) {
        invalidCredToast();
        return;
      }

      const adminVerify = await adminLogin(loginForm);
      const { adminId, email, accessToken } = adminVerify;
      dispatch(setDetails({ id: adminId, email, accessToken }));
      navigate("/dashboard");
    } catch (err) {
      invalidLogin();
      console.log(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section className="bg-gray-500  dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <p className="text-3xl font-bold text-gray-200 mb-3 dark:text-white">
            Chronicles
          </p>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Welcome Back Admin
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleInputs}
                    value={loginForm.email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                  <p className="text-red-500 text-sm font-size: 0.75rem">
                    {errors.email}
                  </p>
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handleInputs}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-12"
                    required=""
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-900 dark:text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        {/* Hide password icon */}
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        {/* Show password icon */}
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-44 border bg-gray-800 hover:bg-gray-900 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Adminlogin;

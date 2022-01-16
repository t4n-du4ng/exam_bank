import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { login } from "../store/slices/userSlice";

function SignIn() {
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);
		const handleLogin = async () => {
			try {
				const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;
				const res = await axios.post(url, data);
				//const res = await authApi.login(data);

				if (res.data.message === "Success") {
					localStorage.setItem("REFRESH_TOKEN", res.data.refreshToken);
					const cookies = new Cookies();

					cookies.set("access_token", res.data.refreshToken, { path: "/" });

					const user = res.data.user;
					const action = login(user);
					dispatch(action);
				} else {
				}
			} catch (error) {
				if (error.toString().includes("401")) {
					setLoading(false);
					setError("Sai mật khẩu");
				} else if (error.toString().includes("406")) {
					setLoading(false);
					setError("Tài khoản không tồn tại");
				}
				console.log("Failed to login", error);
			}
		};
		handleLogin();
	};

	return (
		<>
			<div className="w-72 sm:w-80 max-w-xs absolute top-12 -right-20">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
				>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="email"
						>
							Tài khoản
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							{...register("email", (require = true))}
							type="text"
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Mật khẩu
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							{...register("password", (require = true))}
							type="password"
						/>
						{error && (
							<span className="text-sm bg-red-200 py-1 px-2 rounded text-red-900 font-semibold">
								{error}
							</span>
						)}
					</div>

					<div className="flex items-center justify-between">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded focus:outline-none focus:shadow-outline relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border-2 before:border-transparent before:rounded before:tranform hover:before:scale-x-110 hover:before:scale-y-125
                        before:transition before:ease-out hover:before:border-blue-500"
							type="submit"
						>
							Đăng nhập
						</button>
						<a
							className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
							href="#"
						>
							Quên mật khẩu?
						</a>
					</div>
					<div className="flex justify-center">
						{loading ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="animate-ping h-5 w-5 mt-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
								/>
							</svg>
						) : null}
					</div>
				</form>
			</div>
		</>
	);
}

export default SignIn;

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ExamItem from "../components/ExamItem";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Loading from "../components/Loading";

// Done form: question-answer-rightAnswer - 14-10-2021

export default function Exam() {
	const router = useRouter();
	const user = useSelector((state) => state.user);
	const [exams, setExams] = useState([]);
	const [loading, setLoading] = useState(false);
	// useEffect(() => {
	// 	setExams([...examList]);
	// }, []);

	// Fetch dữ liệu
	useEffect(() => {
		const fetchExamList = async () => {
			try {
				const url = `${process.env.NEXT_PUBLIC_API_URL}/exams?subject=${router.query.subject}`;

				const token = localStorage.getItem("REFRESH_TOKEN");
				const res = await axios.get(url, {
					headers: {
						access_token: token,
					},
				});

				setExams(res.data);
				setLoading(true);
			} catch (error) {
				console.log("Failed to fetch exam list:", error);
			}
		};
		fetchExamList();
	}, [router.query.subject]);

	const handleDeleteExam = async (id) => {
		const index = exams.findIndex((e) => e._id == id);
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/exams/${id}/delete`;
			const token = localStorage.getItem("REFRESH_TOKEN");
			const res = await axios.delete(url, {
				headers: {
					access_token: token,
				},
			});

			if (res.data.message == "Success") {
				setExams([...exams.slice(0, index), ...exams.slice(index + 1)]);
			}
		} catch (error) {
			console.log("Failed to delete exam:", error);
		}
	};

	return (
		<div>
			<Head>
				<title>Exam</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<section className="flex py-5 px-5">
				<div className="flex-1 py-5 md:py-10 p-0 sm:px-5 md:px-20 ">
					<div className="xl:w-4/5 bg-gray-200 bg-opacity-40 shadow-md">
						<div className="flex justify-between items-center sm:px-5 sm:py-3 p-3">
							<h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-800">
								Đề thi theo môn {router.query.subject}
							</h1>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
								/>
							</svg>
						</div>

						{loading ? (
							exams.map((e) => (
								<div
									key={e._id}
									className="flex justify-between border-t-2 cursor-pointer px-4 py-1 hover:bg-gray-200"
									onClick={() =>
										router.push({
											pathname: e.isDone ? "result" : "takeExam",
											query: {
												idExam: e._id,
											},
										})
									}
								>
									<ExamItem
										id={e._id}
										name={e.name}
										minuteLimit={e.minuteLimit}
										creator={e.creator.name}
										openDate={moment
											.utc(e.openedAt)
											.local()
											.format("DD/MM/YYYY")}
										isDone={e.isDone}
									/>

									{e.isEditable && user?.role == "teacher" && (
										<div className="flex flex-col">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 cursor-pointer mt-3"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												onClick={() =>
													router.push({
														pathname: "editExam",
														query: {
															idExam: e._id,
														},
													})
												}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 cursor-pointer mt-3"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												onClick={() => handleDeleteExam(e._id)}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</div>
									)}
								</div>
							))
						) : (
							<>
								<Loading />
								<Loading />
								<Loading />
								<Loading />
								<Loading />
							</>
						)}

						{loading && exams?.length == 0 && (
							<h1 className="text-md sm:text-xl lg:text-2xl p-4">
								Chưa có đề thi của môn {router.query.subject}
							</h1>
						)}
					</div>
				</div>

				<div className="hidden lg:block border-l-2 border-gray-200 pl-10 pr-3 mb-10">
					<h1 className="text-2xl font-bold text-green-800 mb-3">
						Đề thi theo môn học
					</h1>
					<div className="grid grid-cols-1 gap-3 place-items-center">
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Toán",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/math.jpg"
								alt="math"
							/>
							<h3 className="text-center w-full py-1 text-md ">Toán</h3>
						</div>
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Tiếng anh",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/english.jpg"
								alt="english"
							/>
							<h3 className="text-center w-full py-1 text-md ">Tiếng Anh</h3>
						</div>
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Vật lý",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/physics.jpg"
								alt="physics"
							/>
							<h3 className="text-center w-full py-1 text-md ">Vật Lý</h3>
						</div>
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Hóa học",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/chemistry.jpg"
								alt="chemistry"
							/>
							<h3 className="text-center w-full py-1 text-md ">Hóa Học</h3>
						</div>
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Sinh học",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/biology.jpg"
								alt="biology"
							/>
							<h3 className="text-center w-full py-1 text-md ">Sinh Học</h3>
						</div>
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Lịch sử",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/history.jpg"
								alt="history"
							/>
							<h3 className="text-center w-full py-1 text-md ">Lịch Sử</h3>
						</div>
						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Địa lý",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/geography.jpg"
								alt="geography"
							/>
							<h3 className="text-center w-full py-1 text-md">Địa Lý</h3>
						</div>

						<div
							className="border border-gray-300 cursor-pointer"
							onClick={() =>
								router.push({
									pathname: "exam",
									query: {
										subject: "Giáo dục công dân",
									},
								})
							}
						>
							<img
								className="object-cover w-64 h-16"
								src="/img/civiceducation.jpg"
								alt="civic education"
							/>
							<h3 className="text-center w-full py-1 text-md ">
								Giáo Dục Công Dân
							</h3>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

// export async function getServerSideProps(context) {
// 	const params = context.query;
// 	const token = localStorage.getItem("REFRESH_TOKEN");
// 	console.log(token);
// 	const res = await examApi.getAll(params);

// 	return {
// 		props: {
// 			examList: res,
// 		},
// 	};
// }

import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";
import SimpleSidebar from "../components/Sidebar";
import { useRouter } from "next/router";
import UserAdmin from "../components/UserAdmin";
import Dashboard from "../components/Dashboard";

export default function Admin() {
	const router = useRouter();
	return (
		<div>
			<Head>
				<title>Exam Bank - DKG</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<SimpleSidebar>
				{router.query.name == "User" && <UserAdmin />}
				{(router.query.name == undefined ||
					router.query.name == "Dashboard") && <Dashboard />}
			</SimpleSidebar>
			<Footer />
		</div>
	);
}

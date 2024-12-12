import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () : React.ReactElement => {

	return (
		<div className="flex-1 flex gap-4 py-4 flex-col items-center justify-center">
			<h1 className="text-2xl font-bold tracking-wide sm:text-5xl text-center">
				Effortless Anonymous <span className="bg-gradient-to-r from-purple-950 to-indigo-700 bg-clip-text text-transparent">Feedback</span> 
			</h1>
			<p className="text-lg sm:text-2xl font-thin">In just a few clicks.</p>
			<Link href={'/dashboard'}>
				<Button variant="link">
					Get Started
					<ArrowRight />
				</Button> 
			</Link>
		</div>
	);
};

export default Page;
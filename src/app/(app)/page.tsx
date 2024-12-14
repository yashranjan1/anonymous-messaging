"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
  } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"
  

const Page = () : React.ReactElement => {

	const messagesList = [
		{
			name: "SilentCipher",
			message: "I love this! How'd you finish the fine detailing on the website?"
		},
		{
			name: "Wanderer",
			message: "I would love to see some more color schemes!"
		},
		{
			name: "FadingLight",
			message: "How'd you achieve such smooth animations?"
		}
	]

	return (
		<div className="flex-1 flex flex-col items-center justify-center sm:gap-24">
			<div className="flex flex-row items-center justify-center sm:gap-36">
				<div className="flex gap-1 sm:gap-4 py-4 flex-col justify-center">
					<h1 className="text-md font-bold tracking-wide sm:text-5xl text-left">
						Effortless Anonymous <span className="text-violet-900 dark:bg-gradient-to-r to-purple-950 from-indigo-700 bg-clip-text dark:text-transparent">Feedback</span>
					</h1>
					<p className="text-sm sm:text-2xl font-thin">In just a few clicks.</p>
					<Link href={'/dashboard'}>
						<Button variant="link" className="px-0 t text-sm sm:text-2xl">
							Get Started
							<ArrowRight className="lucide-icon" size={15}/>
						</Button> 
					</Link>
				</div>
				<div className="">
					<Image priority src="https://utfs.io/a/zzhaqm5h82/o5pu0HejsNJBOBkoxh6ymo8bG36aXDUerYwP4uERj5lZsKNH" alt="home" width={100} height={100} className="max-w-32 sm:w-56 sm:max-w-64 lg:max-w-96 lg:w-80" />
				</div>
			</div>
			<Carousel
				opts={{
					align: "start",
					watchDrag: false,
					loop: true
				}}
				className="w-96 max-w-sm"
				plugins={[
					Autoplay({
						delay: 5000
					})
				]}
				>
				<CarouselContent>
					{
						messagesList.map(({ name, message}) => (
							<CarouselItem key={name} className="p-10 mx-0.5">
								<div className="p-1">
									<Card className="select-none pulse-message">
										<CardHeader className="pb-2">
											<CardTitle className="font-medium flex flex-row items-center gap-2">
												<Mail size={18}/>
												<span className="text-lg">Message from {name}</span>
											</CardTitle>
										</CardHeader>
										<CardContent className="flex items-center justify-center">
											<span className="font-thin text-md">{message}</span>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))
					}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default Page;